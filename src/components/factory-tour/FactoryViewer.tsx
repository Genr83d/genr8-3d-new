import { useEffect, useRef, useState, type CSSProperties, type JSX } from 'react'
import { TourIcon } from './TourIcon'
import type { PanoRuntime } from './pano-runtime'
import { PLAN_BOUNDS, getStop, tourStops, type TourStop } from './tour-stops'

/** `turn` faces the stop's featured view; hotspots leave it false so visitors keep their heading. */
export type StopRequest = { id: string; turn: boolean; count: number }
type Props = { request: StopRequest; onSelectStop: (id: string, turn: boolean) => void }
type Status = 'idle' | 'loading' | 'ready' | 'error'

const planPosition = (stop: TourStop): CSSProperties => ({
  left: `${(stop.eye[0] - PLAN_BOUNDS.minX) / (PLAN_BOUNDS.maxX - PLAN_BOUNDS.minX) * 100}%`,
  top: `${(PLAN_BOUNDS.maxY - stop.eye[1]) / (PLAN_BOUNDS.maxY - PLAN_BOUNDS.minY) * 100}%`,
})

export function FactoryViewer({ request, onSelectStop }: Props): JSX.Element {
  const [started, setStarted] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [attempt, setAttempt] = useState(0)
  const [warning, setWarning] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hotspotRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const coneRef = useRef<HTMLSpanElement>(null)
  const runtimeRef = useRef<PanoRuntime | null>(null)
  const requestRef = useRef(request)
  const shownRef = useRef(-1)
  useEffect(() => { requestRef.current = request }, [request])

  useEffect(() => {
    if (!started || !canvasRef.current || !hotspotRef.current) return
    const controller = new AbortController(), canvas = canvasRef.current, hotspotLayer = hotspotRef.current
    let instance: PanoRuntime | null = null
    const first = requestRef.current
    void import('./pano-runtime').then(module => module.createPanoRuntime(canvas, {
      signal: controller.signal, hotspotLayer, startId: first.id,
      onSelectStop: id => onSelectStop(id, false),
      onView: heading => { if (coneRef.current) coneRef.current.style.transform = `translate(-50%, -100%) rotate(${heading.toFixed(1)}deg)` },
      onWarning: message => { if (!controller.signal.aborted) setWarning(message) },
      onContextLost: () => { if (!controller.signal.aborted) setStatus('error') },
    })).then(runtime => {
      if (controller.signal.aborted) { runtime.dispose(); return }
      instance = runtime; runtimeRef.current = runtime; shownRef.current = first.count
      setStatus('ready'); canvas.focus({ preventScroll: true })
    }).catch(() => { if (!controller.signal.aborted) setStatus('error') })
    return () => { controller.abort(); instance?.dispose(); runtimeRef.current = null }
  }, [started, attempt, onSelectStop])
  useEffect(() => {
    if (status !== 'ready' || shownRef.current === request.count) return
    shownRef.current = request.count
    const stop = getStop(request.id)
    if (stop) runtimeRef.current?.goTo(stop.id, request.turn)
  }, [request, status])

  const start = () => { setWarning(''); setStatus('loading'); setStarted(true) }
  const close = () => { setStarted(false); setStatus('idle'); setWarning('') }
  const restart = () => { setWarning(''); setStatus('loading'); setAttempt(value => value + 1); setStarted(true) }
  const fullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else if (frameRef.current?.requestFullscreen) await frameRef.current.requestFullscreen()
      else setWarning('Fullscreen is not available in this browser. The tour still works in this view.')
    } catch { setWarning('Fullscreen could not open. You can continue exploring in this view.') }
  }
  const ready = status === 'ready'
  const active = getStop(request.id) ?? tourStops[0]
  const index = tourStops.indexOf(active)
  return (
    <div ref={frameRef} className="ft-viewer">
      <div className="ft-viewport">
        {!ready && <img className="ft-poster" src="/factory-tour/preview.webp" alt="The GENR8-3D workshop seen from the entrance, with its green floor, mezzanine, and spiral staircase" width="1400" height="788" fetchPriority="high" />}
        {started && <canvas key={attempt} ref={canvasRef} className={`ft-canvas ${ready ? 'ft-canvas-ready' : ''}`} tabIndex={ready ? 0 : -1} role="application" aria-label={`360 degree view: ${active.title}. Drag or use the arrow keys to look around. Tour stops are also listed beside this view.`} aria-describedby="factory-controls-help" />}
        <div ref={hotspotRef} className="ft-hotspots" hidden={!ready} />
        {status === 'idle' && <div className="ft-entry">
          <span className="ft-entry-label">GENR8-3D / Factory tour</span>
          <h2>Your next visit starts here.</h2>
          <p>Look around the workshop in 360°, move between the machines, and head upstairs.</p>
          <button type="button" className="ft-enter" onClick={start}><TourIcon name="play" /> Enter the factory</button>
          <span className="ft-entry-note">The 360° views load when you enter.</span>
        </div>}
        {status === 'loading' && <div className="ft-entry ft-loading" role="status" aria-live="polite"><div className="ft-loading-bars" aria-hidden="true"><span /><span /><span /></div><h2>Opening the workshop</h2><p>Loading the first view.</p><button type="button" className="ft-text-button" onClick={close}>Cancel</button></div>}
        {status === 'error' && <div className="ft-entry" role="alert"><h2>The 360° view could not start.</h2><p>Try restarting the tour. If it still cannot open, check your connection and that hardware acceleration is enabled in your browser.</p><button type="button" className="ft-enter" onClick={restart}><TourIcon name="reset" /> Restart the tour</button><button type="button" className="ft-text-button" onClick={close}>Return to the preview</button></div>}
        {ready && <>
          <div className="ft-top-tools">
            <p className="ft-here"><span>{String(index + 1).padStart(2, '0')}</span>{active.title}</p>
            <div className="ft-icon-tools">
              <button type="button" title="Zoom in" aria-label="Zoom in" onClick={() => runtimeRef.current?.zoomBy(-12)}><TourIcon name="plus" /></button>
              <button type="button" title="Zoom out" aria-label="Zoom out" onClick={() => runtimeRef.current?.zoomBy(12)}><TourIcon name="minus" /></button>
              <button type="button" title="Toggle fullscreen" aria-label="Toggle fullscreen" onClick={() => { void fullscreen() }}><TourIcon name="expand" /></button>
              <button type="button" title="Close the tour" aria-label="Close the tour" onClick={close}><TourIcon name="close" /></button>
            </div>
          </div>
          <div className="ft-map">
            <div className="ft-plan" style={{ backgroundImage: `url(/factory-tour/plan-${active.floor}.webp)` }}>
              {tourStops.filter(stop => stop.floor === active.floor).map(stop => <button type="button" key={stop.id} className="ft-plan-dot" style={planPosition(stop)} aria-label={`Go to ${stop.title}`} title={stop.title} aria-current={stop.id === active.id ? 'location' : undefined} onClick={() => onSelectStop(stop.id, true)} />)}
              <span className="ft-plan-here" style={planPosition(active)} aria-hidden="true"><span ref={coneRef} className="ft-plan-cone" /></span>
            </div>
            <div className="ft-floor-tools" role="group" aria-label="Choose a floor">
              <button type="button" aria-pressed={active.floor === 'upper'} onClick={() => onSelectStop('landing', true)}>Upper</button>
              <button type="button" aria-pressed={active.floor === 'ground'} onClick={() => onSelectStop('entrance', true)}>Ground</button>
            </div>
          </div>
        </>}
      </div>
      <div className="ft-viewer-footer"><p id="factory-controls-help">{ready ? 'Drag to look around. Select a floor marker to move through the workshop.' : 'A 360° tour of our factory.'}</p><span className="ft-preview-badge">360° tour</span></div>
      {warning && <div className="ft-warning" role="status">{warning}</div>}
    </div>
  )
}
