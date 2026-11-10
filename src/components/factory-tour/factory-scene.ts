import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { tourStops, FLOOR_HEIGHT } from './tour-layout'

export type FactoryTextures = { concrete?: THREE.Texture; plaster?: THREE.Texture; wood?: THREE.Texture; labels?: Record<string, THREE.Texture> }
export type FactoryScene = { scene: THREE.Scene; roof: THREE.Group; markers: THREE.Mesh[]; hotspots: THREE.Object3D[]; dispose: () => void }

// Geometry is grouped by material and merged: detail does not mean hundreds of draw calls.
export function buildFactoryScene(textures: FactoryTextures = {}): FactoryScene {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('#c4d4dd')
  scene.fog = new THREE.Fog('#c4d4dd', 45, 110)
  const root = new THREE.Group(); root.name = 'GENR8-3D workshop reconstruction'; scene.add(root)
  const roof = new THREE.Group(); roof.name = 'Removable roof'; scene.add(roof)
  const markers: THREE.Mesh[] = []
  const hotspots: THREE.Object3D[] = []
  const buckets = new Map<THREE.Material, THREE.BufferGeometry[]>()
  const roofBuckets = new Map<THREE.Material, THREE.BufferGeometry[]>()
  const materials: THREE.Material[] = []
  const standard = (color: string, roughness = 0.7, metalness = 0, map?: THREE.Texture) => {
    const material = new THREE.MeshStandardMaterial({ color, roughness, metalness, map: map ?? null }); materials.push(material); return material
  }
  const palette = {
    floor: standard('#6b8864', 0.65, 0.08, textures.concrete),
    concrete: standard('#b7b5a7', 0.9, 0, textures.plaster),
    cream: standard('#e5dfc9', 0.85, 0, textures.plaster),
    teal: standard('#287b6d', 0.86, 0, textures.plaster),
    steel: standard('#283b3b', 0.43, 0.65),
    silver: standard('#a8b4b0', 0.38, 0.6),
    machine: standard('#b9c8c1', 0.52, 0.35),
    mint: standard('#8eb9a6', 0.49, 0.3),
    dark: standard('#23312f', 0.78, 0.12),
    wood: standard('#ba9c6d', 0.75, 0, textures.wood),
    blue: standard('#25618d', 0.52, 0.45),
    red: standard('#b33a24', 0.6, 0.2),
    yellow: standard('#d6b850', 0.7),
    glass: standard('#7babb7', 0.18, 0.6),
    white: standard('#eee9db', 0.75),
  }
  const lightMaterial = new THREE.MeshStandardMaterial({ color: '#fff3d0', emissive: '#fff4d7', emissiveIntensity: 2.5 }); materials.push(lightMaterial)
  const addGeometry = (geometry: THREE.BufferGeometry, material: THREE.Material, x: number, y: number, z: number, rotation: Position = [0, 0, 0], onRoof = false) => {
    geometry.applyMatrix4(new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation)), new THREE.Vector3(1, 1, 1)))
    const target = onRoof ? roofBuckets : buckets
    const list = target.get(material) ?? []; list.push(geometry); target.set(material, list)
  }
  type Position = [number, number, number]
  const box = (x: number, y: number, z: number, w: number, h: number, d: number, material: THREE.Material, rotation: Position = [0, 0, 0], onRoof = false) => addGeometry(new THREE.BoxGeometry(w, h, d), material, x, y, z, rotation, onRoof)
  const cylinder = (x: number, y: number, z: number, radius: number, height: number, material: THREE.Material, rotation: Position = [0, 0, 0], segments = 12) => addGeometry(new THREE.CylinderGeometry(radius, radius, height, segments), material, x, y, z, rotation)
  const beam = (a: Position, b: Position, radius: number, material: THREE.Material, onRoof = false) => {
    const start = new THREE.Vector3(...a), end = new THREE.Vector3(...b), direction = end.clone().sub(start)
    const geometry = new THREE.CylinderGeometry(radius, radius, direction.length(), 6)
    geometry.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize()))
    const middle = start.add(end).multiplyScalar(0.5)
    addGeometry(geometry, material, middle.x, middle.y, middle.z, [0, 0, 0], onRoof)
  }
  // Concrete apron and green workshop slab.
  box(0, -0.18, 0, 34, 0.25, 43, palette.concrete)
  box(0, -0.035, 0, 20, 0.18, 28, palette.floor)
  // Ground-floor masonry; front wall has a broad open roller-door entrance.
  box(-10.12, 1.9, 0, 0.25, 3.8, 28, palette.cream)
  box(10.12, 1.9, 0, 0.25, 3.8, 28, palette.cream)
  box(0, 1.9, -14.1, 20.5, 3.8, 0.25, palette.cream)
  for (const x of [-7.3, 7.3]) box(x, 1.9, 14.1, 5.6, 3.8, 0.25, palette.cream)
  box(0, 3.75, 14.1, 9, 0.4, 0.35, palette.steel)
  // Upper walls and gallery: an open central space, with rooms to the rear.
  box(-10.12, 6.05, 0, 0.25, 4.5, 28, palette.teal)
  box(10.12, 6.05, 0, 0.25, 4.5, 28, palette.teal)
  box(0, 6.05, -14.1, 20.5, 4.5, 0.25, palette.teal)
  box(0, 6.05, 14.1, 20.5, 4.5, 0.25, palette.teal)
  box(-8, FLOOR_HEIGHT - 0.18, 0, 4, 0.36, 28, palette.concrete)
  box(8, FLOOR_HEIGHT - 0.18, 0, 4, 0.36, 28, palette.concrete)
  box(0, FLOOR_HEIGHT - 0.18, -12, 12, 0.36, 4, palette.concrete)
  // Gallery railings with timber handrails.
  for (const x of [-6, 6]) {
    for (let z = -10; z <= 13.5; z += 1.4) cylinder(x, 4.35, z, 0.035, 1.1, palette.steel, [0, 0, 0], 6)
    for (const y of [4.05, 4.38]) beam([x, y, -10], [x, y, 13.5], 0.025, palette.steel)
    beam([x, 4.92, -10], [x, 4.92, 13.5], 0.052, palette.wood)
  }
  for (let x = -6; x <= 6; x += 1.4) cylinder(x, 4.35, -10, 0.035, 1.1, palette.steel, [0, 0, 0], 6)
  for (const y of [4.05, 4.38, 4.92]) beam([-6, y, -10], [6, y, -10], y > 4.8 ? 0.052 : 0.025, y > 4.8 ? palette.wood : palette.steel)
  // Upper doors, jambs, and glazed windows.
  for (const x of [-7.6, -3.1, 2, 7.2]) {
    box(x, 5, -13.92, 1.25, 2.4, 0.08, palette.wood)
    box(x - 0.68, 5, -13.83, 0.1, 2.55, 0.14, palette.wood)
    box(x + 0.68, 5, -13.83, 0.1, 2.55, 0.14, palette.wood)
    box(x, 6.25, -13.83, 1.46, 0.1, 0.14, palette.wood)
    cylinder(x + 0.46, 4.97, -13.73, 0.045, 0.15, palette.silver, [Math.PI / 2, 0, 0])
  }
  for (const x of [-9.95, 9.95]) for (const z of [-6.5, 0, 6.5]) {
    box(x, 6.1, z, 0.08, 1.6, 2.6, palette.wood)
    box(x * 0.997, 6.1, z, 0.09, 1.38, 2.35, palette.glass)
    box(x * 0.99, 6.1, z, 0.11, 0.05, 2.35, palette.silver)
    box(x * 0.99, 6.1, z, 0.11, 1.38, 0.05, palette.silver)
  }
  // Structural columns and steel roof trusses.
  for (const x of [-9.7, 9.7]) for (const z of [-13.5, -6.5, 0.5, 7.5, 13.5]) box(x, 4.2, z, 0.18, 8.4, 0.18, palette.steel)
  for (const z of [-13, -6.5, 0, 6.5, 13]) {
    beam([-10, 7.7, z], [0, 9.1, z], 0.075, palette.steel, true)
    beam([0, 9.1, z], [10, 7.7, z], 0.075, palette.steel, true)
    beam([-10, 7.7, z], [10, 7.7, z], 0.07, palette.steel, true)
    for (let x = -9; x < 9; x += 3) beam([x, 7.7, z], [x + 1.5, 8.9 - Math.abs(x + 1.5) * 0.12, z], 0.025, palette.steel, true)
  }
  for (const x of [-7.5, -2.5, 2.5, 7.5]) box(x, 8.35, 0, 0.07, 0.1, 28, palette.steel, [0, 0, 0], true)
  const roofMat = standard('#3a4647', 0.65, 0.5)
  box(-5, 8.47, 0, 10.3, 0.12, 29, roofMat, [0, 0, 0.137], true)
  box(5, 8.47, 0, 10.3, 0.12, 29, roofMat, [0, 0, -0.137], true)
  // Strip lights are emissive geometry; one sun supplies the shadow pass.
  for (const x of [-5.5, 5.5]) for (const z of [-10, -3, 4, 11]) {
    box(x, 7.5, z, 0.38, 0.08, 1.9, palette.steel)
    box(x, 7.44, z, 0.28, 0.025, 1.75, lightMaterial)
  }
  for (const x of [-5.8, 5.8]) for (const z of [-8, 0, 8]) box(x, 3.49, z, 0.16, 0.05, 1.65, lightMaterial)
  // The characteristic spiral stair, to the right of the entrance.
  cylinder(7.8, 1.95, 10.4, 0.09, 3.9, palette.silver)
  for (let i = 0; i < 23; i++) {
    const angle = i * Math.PI * 2 / 22, y = 0.15 + i * FLOOR_HEIGHT / 23
    const x = 7.8 + Math.cos(angle) * 0.72, z = 10.4 + Math.sin(angle) * 0.72
    box(x, y, z, 1.45, 0.085, 0.39, palette.silver, [0, -angle, 0])
    const px = 7.8 + Math.cos(angle) * 1.43, pz = 10.4 + Math.sin(angle) * 1.43
    cylinder(px, y + 0.5, pz, 0.026, 1.05, palette.steel, [0, 0, 0], 6)
    if (i) {
      const prev = (i - 1) * Math.PI * 2 / 22
      beam([7.8 + Math.cos(prev) * 1.43, y + 0.86, 10.4 + Math.sin(prev) * 1.43], [px, y + 1.03, pz], 0.035, palette.steel)
    }
  }
  // CNC bed, slats, gantry, carriage, spindle, and control stand.
  for (const x of [-7.1, -2.3]) for (const z of [-3, 1.2]) box(x, 0.55, z, 0.28, 1.1, 0.3, palette.machine)
  box(-4.7, 0.55, -0.9, 5.2, 0.3, 4.7, palette.dark)
  box(-4.7, 1.04, -0.9, 5.35, 0.3, 4.85, palette.machine)
  for (let i = 0; i < 22; i++) box(-7.15 + i * 0.23, 1.22, -0.9, 0.12, 0.06, 4.55, palette.silver)
  for (const x of [-7.2, -2.2]) box(x, 1.62, -1.4, 0.25, 1.05, 0.4, palette.machine)
  box(-4.7, 2.12, -1.4, 5.5, 0.5, 0.52, palette.machine)
  box(-4.7, 2.16, -1.08, 5.1, 0.12, 0.1, palette.steel)
  box(-4.1, 1.9, -1.05, 0.48, 0.67, 0.28, palette.dark)
  cylinder(-4.1, 1.5, -0.85, 0.13, 0.6, palette.silver)
  box(-1.6, 1.5, -2.8, 0.15, 1.3, 0.15, palette.steel)
  box(-1.6, 2.02, -2.8, 0.75, 0.5, 0.14, palette.machine, [-0.25, 0, 0])
  box(-1.6, 2.02, -2.69, 0.52, 0.3, 0.025, palette.dark, [-0.25, 0, 0])
  // A long lathe with headstock, chuck, carriage and tailstock.
  for (const x of [3.1, 6.9]) box(x, 0.55, -1.3, 0.7, 1.1, 1.3, palette.mint)
  box(5, 1.11, -1.3, 5, 0.28, 1.3, palette.mint)
  box(5, 1.3, -1.3, 4.4, 0.15, 0.6, palette.steel)
  box(3.1, 1.8, -1.3, 1.05, 1.22, 1.05, palette.mint)
  cylinder(3.8, 1.9, -1.3, 0.32, 0.45, palette.silver, [0, 0, Math.PI / 2], 20)
  cylinder(5, 1.9, -1.3, 0.065, 2.25, palette.silver, [0, 0, Math.PI / 2])
  box(5, 1.52, -1.3, 0.8, 0.35, 0.85, palette.machine)
  box(6.7, 1.65, -1.3, 0.45, 0.7, 0.6, palette.mint)
  for (const x of [3, 5, 6.7]) cylinder(x, 1.45, -0.58, 0.16, 0.08, palette.dark, [Math.PI / 2, 0, 0], 16)
  box(3.1, 2.1, -0.75, 0.4, 0.28, 0.05, palette.dark)
  cylinder(3.3, 1.85, -0.73, 0.06, 0.04, palette.red, [Math.PI / 2, 0, 0])
  // Timber benches and assembly surfaces.
  for (const [x, z, width, depth] of [[-6, -11, 4.7, 1.6], [5.8, -10.2, 4.5, 2.6]]) {
    box(x, 1.03, z, width, 0.13, depth, palette.wood)
    box(x, 0.22, z, width - 0.15, 0.08, depth - 0.1, palette.steel)
    for (const dx of [-width / 2 + 0.15, width / 2 - 0.15]) for (const dz of [-depth / 2 + 0.15, depth / 2 - 0.15]) box(x + dx, 0.5, z + dz, 0.09, 1, 0.09, palette.steel)
  }
  // Bench vice, drill, boxes and tool wall.
  box(-7.4, 1.22, -10.8, 0.4, 0.3, 0.5, palette.blue)
  for (const x of [-7.55, -7.25]) box(x, 1.48, -10.8, 0.08, 0.28, 0.5, palette.steel)
  beam([-7.8, 1.25, -10.8], [-7.1, 1.25, -10.8], 0.04, palette.silver)
  box(-4.7, 1.2, -11.1, 0.17, 0.3, 0.2, palette.yellow)
  box(-4.7, 1.43, -11.04, 0.37, 0.17, 0.17, palette.dark)
  box(-6, 2.05, -13.86, 4.8, 1.2, 0.08, palette.wood)
  for (let i = 0; i < 10; i++) {
    box(-8 + i * 0.43, 2.1, -13.72, 0.065, 0.45 + (i % 3) * 0.1, 0.05, palette.silver, [0, 0, i % 2 ? 0.15 : -0.15])
    box(-8 + i * 0.43, 1.79, -13.72, 0.1, 0.18, 0.09, i % 2 ? palette.red : palette.wood)
  }
  for (const [x, z] of [[4.5, -10.6], [6.1, -10], [7, -10.8]]) {
    box(x, 1.3, z, 0.65, 0.45, 0.55, palette.wood)
    box(x, 1.54, z, 0.15, 0.015, 0.55, palette.cream)
  }
  // Storage rack on right wall, with small printed parts and material spools.
  for (const x of [8.2, 9.4]) for (const z of [-8.1, -4.1]) box(x, 1.5, z, 0.06, 3, 0.06, palette.steel)
  for (const y of [0.25, 1, 1.75, 2.5]) box(8.8, y, -6.1, 1.3, 0.07, 4.1, palette.steel)
  for (let i = 0; i < 8; i++) {
    const z = -7.6 + (i % 4) * 0.9, y = i < 4 ? 1.22 : 1.97
    cylinder(8.8, y, z, 0.22, 0.25, i % 3 === 0 ? palette.blue : i % 3 === 1 ? palette.cream : palette.red, [Math.PI / 2, 0, 0], 14)
    cylinder(8.8, y, z, 0.08, 0.28, palette.dark, [Math.PI / 2, 0, 0], 10)
  }
  // Safety paint is dashed geometry, slightly above the slab.
  for (const x of [-1.25, 1.25]) for (let z = -12; z < 13; z += 1.2) box(x, 0.062, z, 0.065, 0.006, 0.5, palette.white)
  for (const z of [-4.4, 2.5]) for (let x = -8.5; x < -1.6; x += 0.7) box(x, 0.065, z, 0.3, 0.006, 0.065, palette.yellow)
  // Wall-mounted fire extinguishers and electrical service details.
  for (const x of [-9.7, 9.7]) {
    cylinder(x, 0.92, 5.5, 0.14, 0.65, palette.red)
    box(x, 1.3, 5.5, 0.22, 0.1, 0.14, palette.dark)
    box(x * 0.99, 1.6, -9, 0.15, 0.7, 0.55, palette.silver)
    beam([x * 0.99, 1.8, -8.8], [x * 0.99, 3.2, -8.8], 0.025, palette.silver)
  }
  // Merge static primitives by material. Bounds keep frustum culling reliable.
  for (const [bucket, parent] of [[buckets, root], [roofBuckets, roof]] as const) for (const [material, geometries] of bucket) {
    const geometry = mergeGeometries(geometries)
    if (!geometry) throw new Error('Factory geometry could not be assembled.')
    geometry.computeBoundingSphere()
    const mesh = new THREE.Mesh(geometry, material); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh)
    geometries.forEach(g => g.dispose())
  }
  const markerMat = new THREE.MeshStandardMaterial({ color: '#d9efff', emissive: '#3c98bf', emissiveIntensity: 1.5, roughness: 0.3 }); materials.push(markerMat)
  for (const stop of tourStops) {
    const marker = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.045, 6, 24), markerMat)
    marker.position.set(...stop.marker); marker.rotation.x = -Math.PI / 2; marker.userData.stopId = stop.id
    markers.push(marker); hotspots.push(marker); scene.add(marker)
    const texture = textures.labels?.[stop.id]
    if (texture) {
      const material = new THREE.SpriteMaterial({ map: texture, depthTest: true }); materials.push(material)
      const sprite = new THREE.Sprite(material); sprite.position.set(stop.marker[0], stop.marker[1] + 0.85, stop.marker[2]); sprite.scale.set(2.4, 0.6, 1); sprite.userData.stopId = stop.id; hotspots.push(sprite); scene.add(sprite)
    }
  }
  const hemi = new THREE.HemisphereLight('#e3f0ff', '#787c57', 2.2); scene.add(hemi)
  const sun = new THREE.DirectionalLight('#fff1d5', 3.1); sun.position.set(-10, 17, 16); sun.castShadow = true
  sun.shadow.mapSize.set(1024, 1024); sun.shadow.camera.left = -21; sun.shadow.camera.right = 21; sun.shadow.camera.top = 25; sun.shadow.camera.bottom = -25
  sun.shadow.camera.near = 1; sun.shadow.camera.far = 65; sun.shadow.bias = -0.001; sun.shadow.normalBias = 0.04; scene.add(sun)
  const fill = new THREE.DirectionalLight('#d4e9fa', 1.4); fill.position.set(5, 6, -10); scene.add(fill)
  const fill2 = new THREE.PointLight('#fff2d5', 55, 35, 2); fill2.position.set(0, 6.6, -5); scene.add(fill2)
  scene.updateMatrixWorld(true)
  return { scene, roof, markers, hotspots, dispose: () => {
    scene.traverse(object => { if (object instanceof THREE.Mesh) object.geometry.dispose() })
    materials.forEach(m => m.dispose()); sun.shadow.dispose(); scene.clear()
  } }
}
