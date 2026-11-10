import { useCallback, useState, type JSX } from 'react'
import { Link } from 'react-router-dom'
import { FactoryViewer, type StopRequest } from '../components/factory-tour/FactoryViewer'
import { TourIcon } from '../components/factory-tour/TourIcon'
import { getStop, tourStops } from '../components/factory-tour/tour-stops'
import '../components/factory-tour/factory-tour.css'

export function FactoryTourPage(): JSX.Element {
  const [request, setRequest] = useState<StopRequest>({ id: tourStops[0].id, turn: true, count: 0 })
  const selectStop = useCallback((id: string, turn: boolean) => {
    if (getStop(id)) setRequest(previous => ({ id, turn, count: previous.count + 1 }))
  }, [])
  const active = getStop(request.id) ?? tourStops[0]
  const activeIndex = tourStops.indexOf(active)
  return (
    <div className="ft-page">
      <header className="ft-heading"><div><p className="chip">Virtual Factory Tour</p><h1>Step inside the workshop.</h1><p>Look around the production floor in 360°, move between the machines, and see the workshop from the mezzanine.</p></div><Link to="/contact" className="secondary-button">Plan a real visit <TourIcon name="right" /></Link></header>
      <div className="ft-experience">
        <FactoryViewer request={request} onSelectStop={selectStop} />
        <aside className="ft-guide" aria-label="Factory tour guide">
          <div className="ft-guide-top"><span>Explore the factory</span><span>{String(activeIndex + 1).padStart(2, '0')} / {String(tourStops.length).padStart(2, '0')}</span></div>
          <nav className="ft-stops" aria-label="Jump to a factory area">{tourStops.map((stop, index) => <button type="button" key={stop.id} aria-current={active.id === stop.id ? 'location' : undefined} onClick={() => selectStop(stop.id, true)}><span className="ft-stop-number">{String(index + 1).padStart(2, '0')}</span><span>{stop.title}</span><TourIcon name="right" /></button>)}</nav>
          <div className="ft-stop-detail" aria-live="polite"><span className="ft-floor-label">{active.floor === 'upper' ? 'Upper floor' : 'Ground floor'}</span><h2>{active.title}</h2><p>{active.description}</p></div>
          <div className="ft-step-controls"><button type="button" onClick={() => selectStop(tourStops[(activeIndex + tourStops.length - 1) % tourStops.length].id, true)}><TourIcon name="left" /> Previous</button><button type="button" onClick={() => selectStop(tourStops[(activeIndex + 1) % tourStops.length].id, true)}>Next stop <TourIcon name="right" /></button></div>
        </aside>
      </div>
      <div className="ft-afterword"><p>Prefer to see it in person?</p><Link to="/contact">Arrange a visit to GENR8-3D <TourIcon name="right" /></Link></div>
    </div>
  )
}
