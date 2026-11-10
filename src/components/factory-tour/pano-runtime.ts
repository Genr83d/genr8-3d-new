import { LinearFilter, LinearMipmapLinearFilter, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, SphereGeometry, SRGBColorSpace, Texture, TextureLoader, Vector3, WebGLRenderer } from 'three'
import { FLOOR_Z, getStop, panoUrl, tourStops, type Point3, type TourStop } from './tour-stops'

export type PanoRuntime = {
  /** Move to a stop. `feature` turns to the stop's featured view; otherwise the visitor keeps looking the same way. */
  goTo: (id: string, feature: boolean) => void
  zoomBy: (degrees: number) => void
  dispose: () => void
}
type Options = {
  signal: AbortSignal
  hotspotLayer: HTMLElement
  startId: string
  onSelectStop: (id: string) => void
  onView: (headingDegrees: number) => void
  onWarning: (message: string) => void
  onContextLost: () => void
}

const FULL_WIDTH = 5120
const MIN_FOV = 32, MAX_FOV = 95
const rad = (degrees: number) => degrees * Math.PI / 180
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

/** Scene metres (x east, y north, z up) to a view direction in three.js space (y up, north = -z). */
export function directionTo(from: Point3, to: Point3, out = new Vector3()): Vector3 {
  return out.set(to[0] - from[0], to[2] - from[2], -(to[1] - from[1]))
}

export async function createPanoRuntime(canvas: HTMLCanvasElement, options: Options): Promise<PanoRuntime> {
  const { signal, hotspotLayer } = options
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const renderer = new WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.outputColorSpace = SRGBColorSpace
  const scene = new Scene()
  const camera = new PerspectiveCamera(75, 1, 0.1, 100)
  // The panoramas are equirectangular with north at the centre and east to its right.
  const geometry = new SphereGeometry(20, 96, 48)
  geometry.scale(-1, 1, 1); geometry.rotateY(-Math.PI / 2)
  const base = new Mesh(geometry, new MeshBasicMaterial({ color: 0xffffff }))
  const incoming = new Mesh(geometry, new MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthTest: false }))
  incoming.renderOrder = 1; incoming.visible = false
  scene.add(base, incoming)

  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  const useFull = renderer.capabilities.maxTextureSize >= FULL_WIDTH && !connection?.saveData
  const loader = new TextureLoader()
  const textures = new Map<string, Promise<Texture>>()
  const ready = new Map<string, Texture>()
  const load = (url: string): Promise<Texture> => {
    let pending = textures.get(url)
    if (!pending) {
      pending = loader.loadAsync(url).then(texture => {
        texture.colorSpace = SRGBColorSpace
        texture.minFilter = LinearMipmapLinearFilter; texture.magFilter = LinearFilter
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
        if (disposed) texture.dispose(); else ready.set(url, texture)
        return texture
      })
      pending.catch(() => { textures.delete(url) })
      textures.set(url, pending)
    }
    return pending
  }
  /** Keep only the panoramas for this stop and the small previews of its neighbours. */
  const evict = (stop: TourStop) => {
    const keep = new Set([panoUrl(stop.id, 'small'), panoUrl(stop.id, 'full'), ...stop.links.map(link => panoUrl(link.to, 'small'))])
    for (const [url, texture] of ready) {
      if (keep.has(url) || base.material.map === texture || incoming.material.map === texture) continue
      texture.dispose(); ready.delete(url); textures.delete(url)
    }
  }

  let disposed = false
  let current: TourStop | undefined
  let token = 0
  let heading = 0, pitch = 0, fov = 75
  let headingVelocity = 0, pitchVelocity = 0
  let turnFrom = 0, turnTo = 0, turnPitch = 0, turnProgress = 1
  let fade = 1
  let idleSpin = !reducedMotion
  let visible = true
  let frame = 0, lastTime = 0
  const pointers = new Map<number, { x: number; y: number }>()
  let pinchDistance = 0
  const keys = new Set<string>()
  const projected = new Vector3()
  let hotspots: Array<{ element: HTMLButtonElement; direction: Vector3; distance: number }> = []

  const requestRender = () => { if (!frame && !disposed) frame = requestAnimationFrame(render) }
  const applyCamera = () => {
    const h = rad(heading), p = rad(pitch)
    camera.fov = fov; camera.updateProjectionMatrix()
    camera.lookAt(Math.sin(h) * Math.cos(p), Math.sin(p), -Math.cos(h) * Math.cos(p))
    camera.updateMatrixWorld()
  }
  const placeHotspots = () => {
    const width = canvas.clientWidth, height = canvas.clientHeight
    for (const { element, direction, distance } of hotspots) {
      projected.copy(direction).project(camera)
      const inView = projected.z < 1 && Math.abs(projected.x) < 1.15 && Math.abs(projected.y) < 1.15
      element.hidden = !inView
      if (!inView) continue
      const scale = clamp(1.25 - distance * 0.06, 0.72, 1.1) * clamp(75 / fov, 0.85, 1.5)
      element.style.transform = `translate(${((projected.x + 1) / 2 * width).toFixed(1)}px, ${((1 - projected.y) / 2 * height).toFixed(1)}px) translate(-50%, -50%) scale(${scale.toFixed(3)})`
    }
  }
  const buildHotspots = (stop: TourStop) => {
    hotspotLayer.replaceChildren()
    hotspots = stop.links.flatMap(link => {
      const target = getStop(link.to)
      if (!target) return []
      const element = document.createElement('button')
      element.type = 'button'; element.className = 'ft-hotspot'
      element.setAttribute('aria-label', `Go to ${target.title}`)
      const ring = document.createElement('span'); ring.className = 'ft-hotspot-ring'; ring.setAttribute('aria-hidden', 'true')
      const label = document.createElement('span'); label.className = 'ft-hotspot-label'; label.textContent = target.title
      element.append(ring, label)
      element.addEventListener('click', () => options.onSelectStop(link.to))
      hotspotLayer.append(element)
      const direction = directionTo(stop.eye, link.at)
      // Markers on the floor lie flat, like a ring painted on the ground; doorway and stair markers face the visitor.
      const onFloor = Math.abs(link.at[2] - FLOOR_Z[target.floor]) < 0.01 && target.floor === stop.floor
      if (onFloor) ring.style.setProperty('--ft-squash', clamp(-direction.y / direction.length() + 0.12, 0.38, 1).toFixed(3))
      return [{ element, direction: direction.clone().normalize(), distance: direction.length() }]
    })
  }

  function render(time: number) {
    frame = 0
    if (disposed) return
    const dt = Math.min(0.05, lastTime ? (time - lastTime) / 1000 : 0.016)
    lastTime = time
    let animating = false
    if (keys.size) {
      const step = 70 * dt * (fov / 75)
      if (keys.has('ArrowLeft')) heading -= step
      if (keys.has('ArrowRight')) heading += step
      if (keys.has('ArrowUp')) pitch += step
      if (keys.has('ArrowDown')) pitch -= step
      animating = true
    }
    if (turnProgress < 1) {
      turnProgress = Math.min(1, turnProgress + dt / (reducedMotion ? 0.001 : 0.7))
      const eased = 1 - Math.pow(1 - turnProgress, 3)
      heading = turnFrom + (turnTo - turnFrom) * eased
      pitch += (turnPitch - pitch) * Math.min(1, dt * 5)
      animating = true
    } else if (!pointers.size && (Math.abs(headingVelocity) > 0.5 || Math.abs(pitchVelocity) > 0.5)) {
      heading += headingVelocity * dt; pitch += pitchVelocity * dt
      const decay = Math.exp(-dt * 4.5); headingVelocity *= decay; pitchVelocity *= decay
      animating = true
    } else if (idleSpin && !pointers.size && fade >= 1) {
      heading += 2.2 * dt; animating = true
    }
    if (fade < 1) {
      fade = Math.min(1, fade + dt / (reducedMotion ? 0.001 : 0.45))
      incoming.material.opacity = fade
      if (fade >= 1) {
        base.material.map = incoming.material.map; base.material.needsUpdate = true
        incoming.visible = false; incoming.material.map = null
        if (current) evict(current)
      }
      animating = true
    }
    pitch = clamp(pitch, -85, 85)
    applyCamera(); placeHotspots()
    renderer.render(scene, camera)
    options.onView(((heading % 360) + 360) % 360)
    lastTime = animating ? time : 0
    if (animating && visible) requestRender()
  }

  const show = (texture: Texture, crossfade: boolean) => {
    if (crossfade && base.material.map) {
      incoming.material.map = texture; incoming.material.opacity = 0; incoming.material.needsUpdate = true
      incoming.visible = true; fade = 0
    } else if (fade < 1 && incoming.visible) {
      incoming.material.map = texture; incoming.material.needsUpdate = true
    } else {
      base.material.map = texture; base.material.needsUpdate = true
    }
    requestRender()
  }
  const arrive = async (stop: TourStop, feature: boolean): Promise<void> => {
    const mine = ++token
    for (const hotspot of hotspots) hotspot.element.disabled = true
    hotspotLayer.classList.add('ft-hotspots-leaving')
    const fullUrl = panoUrl(stop.id, 'full')
    const first = useFull && ready.has(fullUrl) ? fullUrl : panoUrl(stop.id, 'small')
    const texture = await load(first)
    if (mine !== token || disposed) return
    current = stop
    if (feature) {
      const delta = ((stop.heading - heading) % 360 + 540) % 360 - 180
      turnFrom = heading; turnTo = heading + delta; turnPitch = stop.pitch ?? 0; turnProgress = base.material.map ? 0 : 1
      if (turnProgress === 1) { heading = turnTo; pitch = turnPitch }
      headingVelocity = 0; pitchVelocity = 0
    }
    buildHotspots(stop); hotspotLayer.classList.remove('ft-hotspots-leaving')
    show(texture, true)
    for (const link of stop.links) void load(panoUrl(link.to, 'small')).catch(() => undefined)
    if (useFull && first !== fullUrl) {
      try {
        const sharp = await load(fullUrl)
        if (mine === token && !disposed) { show(sharp, false); if (fade >= 1) evict(stop) }
      } catch { /* The small panorama stays in place. */ }
    }
  }

  // Pointer look, pinch zoom, and keyboard.
  let lastMove = 0
  const stopIdle = () => { idleSpin = false }
  const onPointerDown = (event: PointerEvent) => {
    stopIdle(); canvas.setPointerCapture(event.pointerId)
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
    headingVelocity = 0; pitchVelocity = 0; turnProgress = 1; pinchDistance = 0
    lastMove = performance.now()
  }
  const onPointerMove = (event: PointerEvent) => {
    const previous = pointers.get(event.pointerId)
    if (!previous) return
    const dx = event.clientX - previous.x, dy = event.clientY - previous.y
    previous.x = event.clientX; previous.y = event.clientY
    if (pointers.size >= 2) {
      const [a, b] = [...pointers.values()]
      const distance = Math.hypot(a.x - b.x, a.y - b.y)
      if (pinchDistance) fov = clamp(fov * pinchDistance / distance, MIN_FOV, MAX_FOV)
      pinchDistance = distance
    } else {
      const degreesPerPixel = fov / Math.max(1, canvas.clientHeight)
      const now = performance.now(), elapsed = Math.max(8, now - lastMove) / 1000
      lastMove = now
      heading -= dx * degreesPerPixel; pitch += dy * degreesPerPixel
      headingVelocity = reducedMotion ? 0 : clamp(-dx * degreesPerPixel / elapsed, -400, 400) * 0.6
      pitchVelocity = reducedMotion ? 0 : clamp(dy * degreesPerPixel / elapsed, -400, 400) * 0.6
    }
    requestRender()
  }
  const onPointerEnd = (event: PointerEvent) => {
    pointers.delete(event.pointerId); pinchDistance = 0
    if (performance.now() - lastMove > 90) { headingVelocity = 0; pitchVelocity = 0 }
    requestRender()
  }
  const onWheel = (event: WheelEvent) => {
    // Plain scrolling stays with the page; zoom with the buttons, a pinch, Ctrl + scroll, or in fullscreen.
    if (!event.ctrlKey && !document.fullscreenElement) return
    event.preventDefault(); stopIdle()
    fov = clamp(fov + event.deltaY * 0.04, MIN_FOV, MAX_FOV); requestRender()
  }
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key.startsWith('Arrow')) { event.preventDefault(); stopIdle(); turnProgress = 1; keys.add(event.key); requestRender() }
    else if (event.key === '+' || event.key === '=') { fov = clamp(fov - 6, MIN_FOV, MAX_FOV); requestRender() }
    else if (event.key === '-' || event.key === '_') { fov = clamp(fov + 6, MIN_FOV, MAX_FOV); requestRender() }
  }
  const onKeyUp = (event: KeyboardEvent) => { keys.delete(event.key) }
  const onBlur = () => { keys.clear(); pointers.clear() }
  const onContextLost = (event: Event) => { event.preventDefault(); options.onContextLost() }
  canvas.addEventListener('pointerdown', onPointerDown)
  canvas.addEventListener('pointermove', onPointerMove)
  canvas.addEventListener('pointerup', onPointerEnd)
  canvas.addEventListener('pointercancel', onPointerEnd)
  canvas.addEventListener('wheel', onWheel, { passive: false })
  canvas.addEventListener('keydown', onKeyDown)
  canvas.addEventListener('keyup', onKeyUp)
  canvas.addEventListener('blur', onBlur)
  canvas.addEventListener('webglcontextlost', onContextLost)

  const resize = () => {
    const width = canvas.clientWidth, height = canvas.clientHeight
    if (!width || !height) return
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    requestRender()
  }
  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(canvas)
  const viewObserver = new IntersectionObserver(entries => {
    visible = entries.some(entry => entry.isIntersecting) && !document.hidden
    if (visible) requestRender()
  })
  viewObserver.observe(canvas)
  const onVisibility = () => { visible = !document.hidden; keys.clear(); if (visible) requestRender() }
  document.addEventListener('visibilitychange', onVisibility)

  const dispose = () => {
    if (disposed) return
    disposed = true; token++
    cancelAnimationFrame(frame)
    resizeObserver.disconnect(); viewObserver.disconnect()
    document.removeEventListener('visibilitychange', onVisibility)
    canvas.removeEventListener('pointerdown', onPointerDown)
    canvas.removeEventListener('pointermove', onPointerMove)
    canvas.removeEventListener('pointerup', onPointerEnd)
    canvas.removeEventListener('pointercancel', onPointerEnd)
    canvas.removeEventListener('wheel', onWheel)
    canvas.removeEventListener('keydown', onKeyDown)
    canvas.removeEventListener('keyup', onKeyUp)
    canvas.removeEventListener('blur', onBlur)
    canvas.removeEventListener('webglcontextlost', onContextLost)
    hotspotLayer.replaceChildren(); hotspots = []
    for (const texture of ready.values()) texture.dispose()
    ready.clear(); textures.clear()
    geometry.dispose(); base.material.dispose(); incoming.material.dispose()
    renderer.dispose()
  }
  signal.addEventListener('abort', dispose, { once: true })

  const start = getStop(options.startId) ?? tourStops[0]
  fov = canvas.clientWidth < canvas.clientHeight ? 90 : 75
  heading = start.heading; pitch = start.pitch ?? 0
  resize()
  try { await arrive(start, false) } catch (error) { dispose(); throw error }
  if (signal.aborted) { dispose(); throw new DOMException('Tour closed', 'AbortError') }

  return {
    goTo: (id, feature) => {
      const stop = getStop(id)
      if (!stop || disposed) return
      if (stop === current && fade >= 1 && !feature) return
      stopIdle()
      arrive(stop, feature).catch(() => {
        if (disposed) return
        for (const hotspot of hotspots) hotspot.element.disabled = false
        hotspotLayer.classList.remove('ft-hotspots-leaving')
        options.onWarning(`The view of “${stop.title}” could not be loaded. Check your connection and try again.`)
      })
    },
    zoomBy: degrees => { stopIdle(); fov = clamp(fov + degrees, MIN_FOV, MAX_FOV); requestRender() },
    dispose,
  }
}
