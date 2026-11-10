export type TourFloor = 'ground' | 'upper'
/** Scene coordinates in metres, as in the Blender file: x east, y north, z up. */
export type Point3 = readonly [number, number, number]
export type TourLink = { to: string; at: Point3 }
export type TourStop = {
  id: string
  title: string
  floor: TourFloor
  description: string
  /** Camera position of the rendered panorama. */
  eye: Point3
  /** Initial heading in degrees clockwise from north (the centre of every panorama). */
  heading: number
  /** Initial tilt in degrees; negative looks down. Defaults to level. */
  pitch?: number
  links: TourLink[]
}

export const FLOOR_Z: Record<TourFloor, number> = { ground: 0.05, upper: 2.75 }
const EYE_Z: Record<TourFloor, number> = { ground: 1.6, upper: 4.35 }
/** Floor-plan images cover this rectangle of the scene. */
export const PLAN_BOUNDS = { minX: -4.4, maxX: 4.2, minY: -9.2, maxY: 8.8 }

type StopInput = Omit<TourStop, 'eye' | 'links'> & { at: readonly [number, number] }
const inputs: StopInput[] = [
  { id: 'entrance', title: 'Workshop entrance', floor: 'ground', at: [1.6, 7.3], heading: 195, description: 'Come in through the roller door. The production floor runs the length of the building, with the spiral staircase and the mezzanine to your right.' },
  { id: 'reception', title: 'Reception', floor: 'ground', at: [-3.0, 7.3], heading: 150, pitch: -6, description: 'The front desk sits just inside the glass doors, with a door through to the workshop floor.' },
  { id: 'cnc', title: 'CNC router', floor: 'ground', at: [-0.5, 1.5], heading: 222, pitch: -12, description: 'The large-format CNC router sits under the mezzanine, with marked walkways keeping the space around the cutting bed clear.' },
  { id: 'machines', title: 'Lathe and laser cutters', floor: 'ground', at: [0.8, -1.5], heading: 15, pitch: -10, description: 'Along the east wall are the lathe and the laser cutters, each with its own extraction overhead.' },
  { id: 'back', title: 'Back of the workshop', floor: 'ground', at: [-0.5, -6.0], heading: 10, description: 'From the back wall you can look down the full length of the floor to the entrance. The washroom and electrical panel are behind you.' },
  { id: 'landing', title: 'Top of the stairs', floor: 'upper', at: [-1.75, 6.2], heading: 150, pitch: -8, description: 'The spiral staircase brings you up to the mezzanine. From here the gallery runs along the upper rooms.' },
  { id: 'gallery', title: 'Mezzanine gallery', floor: 'upper', at: [-1.75, 1.5], heading: 100, pitch: -18, description: 'Lean on the rail for a view down onto the lathe and laser cutters. The doors behind you open onto the upper rooms.' },
  { id: 'walkway', title: 'Workshop overlook', floor: 'upper', at: [1.5, -2.2], heading: 350, description: 'The walkway crosses the building for the best view of the whole production floor, right down to the roller door.' },
  { id: 'meeting', title: 'Meeting room', floor: 'upper', at: [-1.6, -3.6], heading: 190, pitch: -10, description: 'Where we sit down with clients and run training sessions, with a window through to the 3D printing room.' },
  { id: 'printers', title: '3D printing room', floor: 'upper', at: [2.2, -5.5], heading: 150, pitch: -10, description: 'Our 3D printers have a room of their own on the upper floor, next to the meeting room.' },
]

/** Each pair is walkable in both directions. `via` pins the marker to a doorway or stair instead of the destination floor. */
const connections: Array<{ between: [string, string]; via?: Point3 }> = [
  { between: ['entrance', 'reception'], via: [-1.55, 5.8, 0.6] },
  { between: ['entrance', 'cnc'] },
  { between: ['entrance', 'landing'], via: [-0.85, 6.8, 2.1] },
  { between: ['cnc', 'machines'] },
  { between: ['cnc', 'back'] },
  { between: ['machines', 'back'] },
  { between: ['landing', 'gallery'] },
  { between: ['gallery', 'walkway'] },
  { between: ['walkway', 'meeting'], via: [-0.8, -2.8, 3.3] },
  { between: ['walkway', 'printers'], via: [1.3, -2.8, 3.3] },
]

export const tourStops: TourStop[] = inputs.map(({ at, ...stop }) => ({ ...stop, eye: [at[0], at[1], EYE_Z[stop.floor]], links: [] }))
const byId = new Map(tourStops.map(stop => [stop.id, stop]))
for (const { between: [a, b], via } of connections) {
  const stopA = byId.get(a), stopB = byId.get(b)
  if (!stopA || !stopB) throw new Error(`Unknown tour stop in connection ${a} - ${b}`)
  stopA.links.push({ to: b, at: via ?? [stopB.eye[0], stopB.eye[1], FLOOR_Z[stopB.floor]] })
  stopB.links.push({ to: a, at: via ?? [stopA.eye[0], stopA.eye[1], FLOOR_Z[stopA.floor]] })
}
export function getStop(id: string): TourStop | undefined { return byId.get(id) }
export function panoUrl(id: string, size: 'small' | 'full'): string { return `/factory-tour/panos/${id}${size === 'small' ? '-sm' : ''}.webp` }
