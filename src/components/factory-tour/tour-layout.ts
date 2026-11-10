export type TourFloor = 'ground' | 'upper'
export type TourMode = 'walk' | 'overview'
export type Position3 = readonly [number, number, number]
export type TourStop = {
  id: string
  title: string
  floor: TourFloor
  description: string
  position: Position3
  target: Position3
  marker: Position3
}

export const FLOOR_HEIGHT = 3.8
export const EYE_HEIGHT = 1.65
export const PLAYER_RADIUS = 0.32
export const WORKSHOP = { halfWidth: 10, halfLength: 14, height: 8.5 }

export const tourStops: TourStop[] = [
  { id: 'entrance', title: 'Workshop entrance', floor: 'ground', description: 'Start at the entrance and look across the open workshop, with the mezzanine and spiral staircase above the production floor.', position: [0, EYE_HEIGHT, 11], target: [0, 2.6, -5], marker: [0, 0.14, 9] },
  { id: 'cnc', title: 'CNC work area', floor: 'ground', description: 'Take a closer look at the large gantry machine, its cutting bed, and the space around it for preparing materials.', position: [-0.3, EYE_HEIGHT, 3.8], target: [-4.7, 1.15, -1], marker: [-0.5, 0.14, 2.8] },
  { id: 'machines', title: 'Machine shop', floor: 'ground', description: 'Explore the lathe and workshop machinery, with their frames, controls, and working surfaces recreated for the tour.', position: [4.6, EYE_HEIGHT, 3.3], target: [5, 1.25, -1.3], marker: [5, 0.14, 2.4] },
  { id: 'workbenches', title: 'Workbenches', floor: 'ground', description: 'Move to the rear workbench to see the timber worktop, tool storage, and the smaller details of the workshop.', position: [-4.5, EYE_HEIGHT, -7.4], target: [-5.8, 1.1, -11], marker: [-4.8, 0.14, -8.1] },
  { id: 'assembly', title: 'Assembly area', floor: 'ground', description: 'Look around the assembly table and storage shelves, then follow the marked walkway back through the workshop.', position: [3.5, EYE_HEIGHT, -6.2], target: [5.7, 1.15, -10.1], marker: [4, 0.14, -7.2] },
  { id: 'mezzanine', title: 'Mezzanine walkway', floor: 'upper', description: 'Go upstairs for a view across the workshop from the steel-railed gallery. Use the floor controls to return downstairs.', position: [7.2, FLOOR_HEIGHT + EYE_HEIGHT, 5.8], target: [-3, 1.6, -2], marker: [7.6, FLOOR_HEIGHT + 0.14, 6.8] },
  { id: 'upper-rooms', title: 'Upper rooms', floor: 'upper', description: 'Explore the upper corridor, teal walls, timber doors, and windows overlooking the production floor.', position: [-4.5, FLOOR_HEIGHT + EYE_HEIGHT, -11.5], target: [4, FLOOR_HEIGHT + 1.25, -12.5], marker: [-3.5, FLOOR_HEIGHT + 0.14, -11.8] },
]

// Footprints match the procedural machinery, benches, and staircase.
export const groundObstacles: ReadonlyArray<readonly [number, number, number, number]> = [
  [-7.6, -1.7, -3.7, 1.9], [2.3, 7.7, -2.7, 0.5],
  [-8.5, -3.5, -12, -10], [3.3, 8.3, -11.8, -8.7],
  [8, 9.6, -8.4, -3.8], [6.1, 9.5, 8.5, 12.2],
]

export function canWalkAt(x: number, z: number, floor: TourFloor): boolean {
  if (!Number.isFinite(x) || !Number.isFinite(z)) return false
  const edgeX = WORKSHOP.halfWidth - PLAYER_RADIUS - 0.2
  const edgeZ = WORKSHOP.halfLength - PLAYER_RADIUS - 0.2
  if (Math.abs(x) > edgeX || Math.abs(z) > edgeZ) return false
  if (floor === 'upper') return Math.abs(x) >= 6 + PLAYER_RADIUS || z <= -10 - PLAYER_RADIUS
  return !groundObstacles.some(([minX, maxX, minZ, maxZ]) =>
    x > minX - PLAYER_RADIUS && x < maxX + PLAYER_RADIUS &&
    z > minZ - PLAYER_RADIUS && z < maxZ + PLAYER_RADIUS,
  )
}

export function moveAlongFloor(x: number, z: number, dx: number, dz: number, floor: TourFloor): [number, number] {
  // Small substeps prevent tunnelling through a machine after a slow frame.
  const steps = Math.max(1, Math.ceil(Math.hypot(dx, dz) / 0.12))
  const stepX = dx / steps, stepZ = dz / steps
  let nextX = x, nextZ = z
  for (let i = 0; i < steps; i++) {
    if (canWalkAt(nextX + stepX, nextZ, floor)) nextX += stepX
    if (canWalkAt(nextX, nextZ + stepZ, floor)) nextZ += stepZ
  }
  return [nextX, nextZ]
}
