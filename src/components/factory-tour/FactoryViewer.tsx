import { useEffect, useRef, useState, type JSX, type PointerEvent } from 'react'
import { TourIcon } from './TourIcon'
import type { FactoryRuntime, Movement } from './factory-runtime'
import type { TourMode } from './tour-layout'

type Props = { activeStopId: string; requestId: number; mode: TourMode; onModeChange: (mode: TourMode) => void; onSelectStop: (id: string) => void }
type Status = 'idle' | 'loading' | 'ready' | 'error'

export function FactoryViewer({ activeStopId, requestId, mode, onModeChange, onSelectStop }: Props): JSX.Element {
  const [started, setStarted] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [attempt, setAttempt] = useState(0)
  const [roofVisible, setRoofVisible] = useState(true)
  const [warning, setWarning] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const runtimeRef = useRef<FactoryRuntime | null>(null)

  useEffect(() => {
    if (!started || !canvasRef.current) return
    const controller = new AbortController(), canvas = canvasRef.current
    let instance: FactoryRuntime | null = null
    void import('./factory-runtime').then(module => module.createFactoryRuntime(canvas, {
      signal: controller.signal,
      onSelectStop,
      onWarning: message => { if (!controller.signal.aborted) setWarning(message) },
      onContextLost: () => { if (!controller.signal.aborted) setStatus('error') },
    })).then(runtime => {
      if (controller.signal.aborted) { runtime.dispose(); return }
      instance = runtime; runtimeRef.current = runtime; setStatus('ready'); canvas.focus({ preventScroll: true })
    }).catch(() => { if (!controller.signal.aborted) setStatus('error') })
    return () => { controller.abort(); instance?.dispose(); runtimeRef.current = null }
  }, [started, attempt, onSelectStop])
  useEffect(() => { if (status === 'ready') runtimeRef.current?.setMode(mode) }, [mode, status])
  useEffect(() => { if (status === 'ready' && mode === 'walk') runtimeRef.current?.goTo(activeStopId) }, [activeStopId, requestId, status, mode])
  useEffect(() => { if (status === 'ready') runtimeRef.current?.setRoofVisible(roofVisible) }, [roofVisible, status])

  const start = () => { setWarning(''); onModeChange('walk'); setStatus('loading'); setStarted(true) }
  const close = () => { setStarted(false); setStatus('idle'); setWarning('') }
  const restart = () => { setWarning(''); onModeChange('walk'); setStatus('loading'); setAttempt(value => value + 1); setStarted(true) }
  const fullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else if (frameRef.current?.requestFullscreen) await frameRef.current.requestFullscreen()
      else setWarning('Fullscreen is not available in this browser. The tour still works in this view.')
    } catch { setWarning('Fullscreen could not open. You can continue exploring in this view.') }
  }
  const pressMovement = (event: PointerEvent<HTMLButtonElement>, direction: Movement) => {
    event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); runtimeRef.current?.setMovement(direction, true)
  }
  const ready = status === 'ready'
  return (
    <div ref={frameRef} className="ft-viewer">
      <div className="ft-viewport">
        {!ready && <img className="ft-poster" src="/factory-tour/preview.webp" alt="Rendered reference of the GENR8-3D workshop, green floor, mezzanine, and spiral staircase" width="1400" height="788" fetchPriority="high" />}
        {started && <canvas key={attempt} ref={canvasRef} className={`ft-canvas ${ready ? 'ft-canvas-ready' : ''}`} tabIndex={ready ? 0 : -1} role="application" aria-label="Interactive factory tour. Drag to look around; use W A S D or arrow keys to move. Tour stops are also available beside this view." aria-describedby="factory-controls-help" />}
        {status === 'idle' && <div className="ft-entry">
          <span className="ft-entry-label">GENR8-3D / Factory tour</span>
          <h2>Your next visit starts here.</h2>
          <p>Explore the workshop, walk around the machines, and take a look upstairs.</p>
          <button type="button" className="ft-enter" onClick={start}><TourIcon name="play" /> Enter the factory</button>
          <span className="ft-entry-note">The interactive tour loads when you enter.</span>
        </div>}
        {status === 'loading' && <div className="ft-entry ft-loading" role="status" aria-live="polite"><div className="ft-loading-bars" aria-hidden="true"><span /><span /><span /></div><h2>Opening the workshop</h2><p>Preparing the space and its textures.</p><button type="button" className="ft-text-button" onClick={close}>Cancel</button></div>}
        {status === 'error' && <div className="ft-entry" role="alert"><h2>The 3D view could not start.</h2><p>Try restarting the tour. If it still cannot open, check that your browser supports WebGL 2 and hardware acceleration is enabled.</p><button type="button" className="ft-enter" onClick={restart}><TourIcon name="reset" /> Restart the tour</button><button type="button" className="ft-text-button" onClick={close}>Return to the preview</button></div>}
        {ready && <>
          <div className="ft-top-tools">
            <div className="ft-mode-switch" aria-label="Choose navigation mode">
              <button type="button" aria-pressed={mode === 'walk'} onClick={() => onModeChange('walk')}><TourIcon name="walk" /> Walk</button>
              <button type="button" aria-pressed={mode === 'overview'} onClick={() => onModeChange('overview')}><TourIcon name="overview" /> Overview</button>
            </div>
            <div className="ft-icon-tools">
              <button type="button" title="Return to the entrance" aria-label="Return to the entrance" onClick={() => onSelectStop('entrance')}><TourIcon name="reset" /></button>
              <button type="button" title={roofVisible ? 'Hide the roof' : 'Show the roof'} aria-label={roofVisible ? 'Hide the roof' : 'Show the roof'} aria-pressed={roofVisible} disabled={mode === 'overview'} onClick={() => setRoofVisible(value => !value)}><TourIcon name="roof" /></button>
              <button type="button" title="Toggle fullscreen" aria-label="Toggle fullscreen" onClick={() => { void fullscreen() }}><TourIcon name="expand" /></button>
              <button type="button" title="Close the tour" aria-label="Close the tour" onClick={close}><TourIcon name="close" /></button>
            </div>
          </div>
          <div className="ft-floor-tools" aria-label="Choose a floor">
            <button type="button" onClick={() => onSelectStop('entrance')}>Ground floor</button>
            <button type="button" onClick={() => onSelectStop('mezzanine')}>Upstairs <TourIcon name="up" /></button>
          </div>
          {mode === 'walk' && <div className="ft-movement-pad" role="group" aria-label="Move around the factory">
            {(['forward', 'left', 'backward', 'right'] as const).map(direction => <button type="button" key={direction} className={`ft-move-${direction}`} aria-label={`Move ${direction}`} onPointerDown={event => pressMovement(event, direction)} onPointerUp={() => runtimeRef.current?.setMovement(direction, false)} onPointerCancel={() => runtimeRef.current?.setMovement(direction, false)} onLostPointerCapture={() => runtimeRef.current?.setMovement(direction, false)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); runtimeRef.current?.setMovement(direction, true) } }} onKeyUp={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); runtimeRef.current?.setMovement(direction, false) } }} onBlur={() => runtimeRef.current?.setMovement(direction, false)}><TourIcon name={direction === 'forward' ? 'up' : direction === 'backward' ? 'down' : direction} /></button>)}
          </div>}
        </>}
      </div>
      <div className="ft-viewer-footer"><p id="factory-controls-help">{ready ? mode === 'walk' ? 'Drag to look around. Use WASD, arrow keys, or the movement pad to walk.' : 'Drag to rotate. Scroll or pinch to zoom. Select a stop to go inside.' : 'An interactive reconstruction of our factory.'}</p><span className="ft-preview-badge">Interactive preview</span></div>
      {warning && <div className="ft-warning" role="status">{warning}</div>}
    </div>
  )
}
