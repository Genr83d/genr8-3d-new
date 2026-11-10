import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { buildFactoryScene, type FactoryTextures } from './factory-scene'
import { EYE_HEIGHT, FLOOR_HEIGHT, moveAlongFloor, tourStops, type TourFloor, type TourMode } from './tour-layout'
import { finishCameraJump, pickVisibleTourStop } from './tour-navigation'

export type Movement = 'forward' | 'backward' | 'left' | 'right'
export type FactoryRuntime = {
  goTo: (id: string) => void
  setMode: (mode: TourMode) => void
  setRoofVisible: (visible: boolean) => void
  setMovement: (movement: Movement, active: boolean) => void
  reset: () => void
  dispose: () => void
}
export type RuntimeOptions = { signal: AbortSignal; onSelectStop: (id: string) => void; onWarning: (message: string) => void; onContextLost: () => void }

export async function createFactoryRuntime(canvas: HTMLCanvasElement, options: RuntimeOptions): Promise<FactoryRuntime> {
  if (options.signal.aborted) throw new DOMException('Tour closed', 'AbortError')
  const mobile = matchMedia('(pointer: coarse)').matches
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, powerPreference: 'low-power' })
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, mobile ? 1.25 : 1.75))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  renderer.shadowMap.enabled = !mobile
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  const textures: THREE.Texture[] = []
  let startupDisposed = false
  const disposeStartup = () => {
    if (startupDisposed) return
    startupDisposed = true
    textures.forEach(texture => texture.dispose())
    renderer.dispose()
    renderer.forceContextLoss()
  }
  options.signal.addEventListener('abort', disposeStartup, { once: true })
  const loader = new THREE.TextureLoader()
  const names = ['concrete', 'plaster', 'wood'] as const
  const loaded = await Promise.allSettled(names.map(async name => {
    const texture = await loader.loadAsync(`/factory-tour/${name}.webp`)
    if (options.signal.aborted) { texture.dispose(); throw new DOMException('Tour closed', 'AbortError') }
    texture.colorSpace = THREE.SRGBColorSpace
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(name === 'concrete' ? 5 : 2, name === 'concrete' ? 7 : 2)
    texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy())
    textures.push(texture)
    return texture
  }))
  options.signal.removeEventListener('abort', disposeStartup)
  if (options.signal.aborted) {
    disposeStartup()
    throw new DOMException('Tour closed', 'AbortError')
  }
  const maps: FactoryTextures = { labels: {} }
  loaded.forEach((item, i) => { if (item.status === 'fulfilled') maps[names[i]] = item.value })
  if (loaded.some(item => item.status === 'rejected')) options.onWarning('Some textures could not load. You can explore now or restart the tour to try again.')
  for (const [i, stop] of tourStops.entries()) {
    const label = document.createElement('canvas'); label.width = 256; label.height = 64
    const ctx = label.getContext('2d')
    if (!ctx) continue
    ctx.fillStyle = 'rgba(12,26,32,0.94)'; ctx.beginPath(); ctx.roundRect(1, 1, 254, 62, 10); ctx.fill()
    ctx.fillStyle = '#98d4d0'; ctx.font = '600 18px Poppins, sans-serif'; ctx.textBaseline = 'middle'; ctx.fillText(String(i + 1).padStart(2, '0'), 14, 33)
    ctx.fillStyle = '#f3f5f3'; ctx.font = '500 16px Poppins, sans-serif'; ctx.fillText(stop.title, 48, 33, 196)
    const texture = new THREE.CanvasTexture(label); texture.colorSpace = THREE.SRGBColorSpace; textures.push(texture)
    maps.labels![stop.id] = texture
  }
  const factory = buildFactoryScene(maps)
  const { scene, roof, hotspots } = factory
  const camera = new THREE.PerspectiveCamera(63, 1, 0.08, 150)
  camera.position.set(...tourStops[0].position); camera.lookAt(...tourStops[0].target)
  const controls = new OrbitControls(camera, canvas)
  controls.enabled = false; controls.enableDamping = !reducedMotion
  controls.dampingFactor = 0.12; controls.minDistance = 5; controls.maxDistance = 52
  controls.maxPolarAngle = Math.PI * 0.49; controls.target.set(0, 2, -1)
  let mode: TourMode = 'walk', floor: TourFloor = 'ground'
  let disposed = false, visible = true, frame = 0, lastTime = 0
  let transition: { start: number; position: THREE.Vector3; rotation: THREE.Quaternion; destination: THREE.Vector3; destinationRotation: THREE.Quaternion } | null = null
  let yaw = 0, pitch = 0, heldPointer: number | null = null, dragX = 0, dragY = 0, dragDistance = 0
  let roofPreference = true
  const movement = new Set<Movement>()
  const pointer = new THREE.Vector2(), raycaster = new THREE.Raycaster()
  const euler = new THREE.Euler(0, 0, 0, 'YXZ')
  const dummyCamera = new THREE.PerspectiveCamera()
  const keys: Record<string, Movement> = { KeyW: 'forward', ArrowUp: 'forward', KeyS: 'backward', ArrowDown: 'backward', KeyA: 'left', ArrowLeft: 'left', KeyD: 'right', ArrowRight: 'right' }
  const syncAngles = () => { euler.setFromQuaternion(camera.quaternion, 'YXZ'); yaw = euler.y; pitch = euler.x }
  const settleJump = () => {
    if (!transition) return
    finishCameraJump(camera, { position: transition.destination, rotation: transition.destinationRotation })
    transition = null
    syncAngles()
  }
  syncAngles()
  const invalidate = () => { if (!disposed && !frame && visible && !document.hidden) frame = requestAnimationFrame(render) }
  function render(time: number) {
    frame = 0
    if (disposed || !visible || document.hidden) return
    const delta = Math.min(lastTime ? (time - lastTime) / 1000 : 0.016, 0.05); lastTime = time
    let again = false
    if (transition) {
      if (!transition.start) transition.start = time
      const progress = Math.min(1, (time - transition.start) / (reducedMotion ? 1 : 850))
      const eased = 1 - Math.pow(1 - progress, 4)
      camera.position.lerpVectors(transition.position, transition.destination, eased)
      camera.quaternion.slerpQuaternions(transition.rotation, transition.destinationRotation, eased)
      if (progress === 1) { transition = null; syncAngles() } else again = true
    } else if (mode === 'walk' && movement.size) {
      let forward = Number(movement.has('forward')) - Number(movement.has('backward'))
      let side = Number(movement.has('right')) - Number(movement.has('left'))
      const length = Math.hypot(forward, side) || 1; forward /= length; side /= length
      const speed = delta * 3.1
      const dx = (-Math.sin(yaw) * forward + Math.cos(yaw) * side) * speed
      const dz = (-Math.cos(yaw) * forward - Math.sin(yaw) * side) * speed
      const [x, z] = moveAlongFloor(camera.position.x, camera.position.z, dx, dz, floor)
      camera.position.set(x, (floor === 'upper' ? FLOOR_HEIGHT : 0) + EYE_HEIGHT, z)
      again = true
    }
    if (mode === 'overview' && !transition && controls.update(delta)) again = true
    renderer.render(scene, camera)
    if (again) invalidate()
  }
  const resize = () => {
    const rect = canvas.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    renderer.setSize(rect.width, rect.height, false); camera.aspect = rect.width / rect.height; camera.updateProjectionMatrix(); invalidate()
  }
  const goTo = (id: string) => {
    const stop = tourStops.find(item => item.id === id)
    if (!stop) return
    mode = 'walk'; controls.enabled = false; movement.clear(); floor = stop.floor; roof.visible = roofPreference
    dummyCamera.position.set(...stop.position); dummyCamera.lookAt(...stop.target)
    transition = { start: 0, position: camera.position.clone(), rotation: camera.quaternion.clone(), destination: dummyCamera.position.clone(), destinationRotation: dummyCamera.quaternion.clone() }
    invalidate()
  }
  const setMode = (nextMode: TourMode) => {
    movement.clear(); transition = null; mode = nextMode; controls.enabled = nextMode === 'overview'
    if (nextMode === 'overview') {
      roof.visible = false; camera.position.set(24, 25, 32); controls.target.set(0, 2, -1); controls.update()
    } else { roof.visible = roofPreference; goTo(floor === 'upper' ? 'mezzanine' : 'entrance') }
    invalidate()
  }
  const pickStop = (event: PointerEvent) => {
    const bounds = canvas.getBoundingClientRect()
    pointer.set((event.clientX - bounds.left) / bounds.width * 2 - 1, -(event.clientY - bounds.top) / bounds.height * 2 + 1)
    raycaster.setFromCamera(pointer, camera)
    const id = pickVisibleTourStop(raycaster, scene, hotspots)
    if (id) options.onSelectStop(id)
  }
  const pointerDown = (event: PointerEvent) => {
    canvas.focus({ preventScroll: true })
    if (event.button !== 0) return
    if (mode === 'walk') { settleJump(); syncAngles() }
    heldPointer = event.pointerId; dragX = event.clientX; dragY = event.clientY; dragDistance = 0
    canvas.setPointerCapture(event.pointerId)
  }
  const pointerMove = (event: PointerEvent) => {
    if (heldPointer !== event.pointerId) return
    const dx = event.clientX - dragX, dy = event.clientY - dragY
    dragDistance += Math.abs(dx) + Math.abs(dy); dragX = event.clientX; dragY = event.clientY
    if (mode !== 'walk') return
    yaw -= dx * 0.0035; pitch = THREE.MathUtils.clamp(pitch - dy * 0.0035, -1.2, 1.2)
    camera.quaternion.setFromEuler(euler.set(pitch, yaw, 0, 'YXZ')); invalidate()
  }
  const pointerUp = (event: PointerEvent) => {
    if (heldPointer === event.pointerId && dragDistance < 6) pickStop(event)
    heldPointer = null
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId)
  }
  const pointerCancel = () => { heldPointer = null }
  const keyDown = (event: KeyboardEvent) => {
    if (mode !== 'walk' || !keys[event.code]) return
    event.preventDefault(); settleJump(); syncAngles(); movement.add(keys[event.code]); invalidate()
  }
  const keyUp = (event: KeyboardEvent) => { if (keys[event.code]) { event.preventDefault(); movement.delete(keys[event.code]) } }
  const clearMovement = () => { movement.clear(); heldPointer = null }
  const visibility = () => { clearMovement(); lastTime = 0; if (document.hidden) { cancelAnimationFrame(frame); frame = 0 } else invalidate() }
  const contextLost = (event: Event) => { event.preventDefault(); clearMovement(); cancelAnimationFrame(frame); frame = 0; if (!disposed) options.onContextLost() }
  const observer = new ResizeObserver(resize); observer.observe(canvas)
  const visibilityObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; clearMovement(); lastTime = 0; if (!visible) { cancelAnimationFrame(frame); frame = 0 } else invalidate() }, { threshold: 0.02 }); visibilityObserver.observe(canvas)
  canvas.addEventListener('pointerdown', pointerDown); canvas.addEventListener('pointermove', pointerMove); canvas.addEventListener('pointerup', pointerUp); canvas.addEventListener('pointercancel', pointerCancel)
  canvas.addEventListener('keydown', keyDown); canvas.addEventListener('keyup', keyUp); canvas.addEventListener('blur', clearMovement); canvas.addEventListener('webglcontextlost', contextLost)
  window.addEventListener('blur', clearMovement); document.addEventListener('visibilitychange', visibility); controls.addEventListener('change', invalidate)
  resize(); invalidate()
  const runtime: FactoryRuntime = {
    goTo, setMode,
    setRoofVisible(value) { roofPreference = value; roof.visible = mode === 'overview' ? false : value; invalidate() },
    setMovement(direction, active) { if (mode !== 'walk') return; if (active) { settleJump(); syncAngles(); movement.add(direction) } else movement.delete(direction); invalidate() },
    reset() { goTo('entrance') },
    dispose() {
      if (disposed) return
      disposed = true; cancelAnimationFrame(frame); movement.clear(); observer.disconnect(); visibilityObserver.disconnect()
      canvas.removeEventListener('pointerdown', pointerDown); canvas.removeEventListener('pointermove', pointerMove); canvas.removeEventListener('pointerup', pointerUp); canvas.removeEventListener('pointercancel', pointerCancel)
      canvas.removeEventListener('keydown', keyDown); canvas.removeEventListener('keyup', keyUp); canvas.removeEventListener('blur', clearMovement); canvas.removeEventListener('webglcontextlost', contextLost)
      window.removeEventListener('blur', clearMovement); document.removeEventListener('visibilitychange', visibility); controls.removeEventListener('change', invalidate)
      controls.dispose(); factory.dispose(); textures.forEach(texture => texture.dispose()); renderer.dispose(); renderer.forceContextLoss()
    },
  }
  return runtime
}
