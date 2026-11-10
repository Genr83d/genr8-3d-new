import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { gzipSync } from 'node:zlib'
import { build } from 'esbuild'
import * as THREE from 'three'

const cache = path.resolve('node_modules/.cache/factory-tour-check.mjs')
fs.mkdirSync(path.dirname(cache), { recursive: true })
await build({ stdin: { contents: `export * from './src/components/factory-tour/factory-scene';export * from './src/components/factory-tour/tour-layout';export * from './src/components/factory-tour/tour-navigation';`, resolveDir: process.cwd() }, bundle: true, platform: 'node', format: 'esm', packages: 'external', outfile: cache })
const { buildFactoryScene, tourStops, canWalkAt, moveAlongFloor, finishCameraJump, pickVisibleTourStop } = await import(cache + '?t=' + Date.now())

for (const stop of tourStops) assert.ok(canWalkAt(stop.position[0], stop.position[2], stop.floor), 'Safe arrival for ' + stop.id)
assert.equal(canWalkAt(0, 0, 'upper'), false, 'Cannot step off the mezzanine')
assert.equal(canWalkAt(0, 0, 'ground'), true, 'Central aisle stays open')
assert.equal(canWalkAt(-4.7, -1, 'ground'), false, 'Cannot enter the CNC machine')
assert.equal(canWalkAt(30, 0, 'ground'), false, 'Cannot leave the building')
assert.equal(canWalkAt(NaN, 0, 'ground'), false)
const [x, z] = moveAlongFloor(-.5, 0, -30, 0, 'ground')
assert.ok(x >= -1.39 && canWalkAt(x, z, 'ground'), 'A long movement cannot tunnel through machinery')
const [ux, uz] = moveAlongFloor(7, 3, -3, 0, 'upper')
assert.ok(ux >= 6.32 && uz === 3, 'Upper walkway prevents walking into the void')

// Interrupt a camera jump between floors. Manual control must start on a safe floor.
const camera = new THREE.PerspectiveCamera(63, 1.5, .08, 150)
camera.position.set(2.882, 3.9, 8.918)
const upstairs = tourStops.find(stop => stop.id === 'mezzanine')
const destination = new THREE.PerspectiveCamera()
destination.position.set(...upstairs.position); destination.lookAt(...upstairs.target)
finishCameraJump(camera, { position: destination.position, rotation: destination.quaternion })
assert.ok(canWalkAt(camera.position.x, camera.position.z, upstairs.floor), 'Interrupted jump settles on valid mezzanine')
assert.ok(camera.quaternion.angleTo(destination.quaternion) < .000001)

const labelTexture = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1)
const factory = buildFactoryScene({ labels: Object.fromEntries(tourStops.map(stop => [stop.id, labelTexture])) })
let meshes = 0, triangles = 0, vertices = 0
const geometries = new Set()
factory.scene.traverse(object => {
  if (!object.isMesh) return
  meshes++; geometries.add(object.geometry)
  const p = object.geometry.getAttribute('position'); vertices += p.count
  triangles += (object.geometry.index?.count ?? p.count) / 3
  for (const value of p.array) assert.ok(Number.isFinite(value), 'No corrupt geometry coordinates')
})
assert.equal(factory.markers.length, tourStops.length)
assert.ok(meshes < 40, 'Static draw-call budget')
assert.ok(triangles < 100000, 'Triangle budget')

// Hidden roofs must never occlude a visible hotspot in overview mode.
factory.roof.visible = false
camera.position.set(24, 25, 32); camera.lookAt(0, 2, -1); camera.updateMatrixWorld()
for (const id of ['cnc', 'workbenches', 'upper-rooms']) {
  const marker = factory.hotspots.find(object => object.isSprite && object.userData.stopId === id)
  const direction = marker.position.clone().sub(camera.position).normalize()
  const ray = new THREE.Raycaster(camera.position, direction); ray.camera = camera
  assert.equal(pickVisibleTourStop(ray, factory.scene, factory.hotspots), id, 'Hidden roof does not block ' + id)
}
// Actual masonry remains an occluder.
camera.position.set(15, 1.65, 3)
const entrance = factory.markers.find(object => object.userData.stopId === 'entrance')
const outsideRay = new THREE.Raycaster(camera.position, entrance.position.clone().sub(camera.position).normalize()); outsideRay.camera = camera
assert.equal(pickVisibleTourStop(outsideRay, factory.scene, factory.hotspots), null, 'Hotspots cannot be selected through an outside wall')
let disposed = 0
for (const geometry of geometries) geometry.addEventListener('dispose', () => disposed++)
factory.dispose(); labelTexture.dispose()
assert.equal(disposed, geometries.size, 'All GPU geometry is released')
assert.equal(factory.scene.children.length, 0)

const imageBytes = fs.readdirSync('public/factory-tour').filter(name => name.endsWith('.webp')).reduce((sum, name) => sum + fs.statSync('public/factory-tour/' + name).size, 0)
assert.ok(imageBytes < 400000, 'Texture and poster transfer budget')
const manifest = JSON.parse(fs.readFileSync('dist/.vite/manifest.json', 'utf8'))
function staticFiles(key, seen = new Set()) {
  if (seen.has(key)) return seen
  seen.add(key)
  for (const child of manifest[key]?.imports ?? []) staticFiles(child, seen)
  return seen
}
const entryKey = Object.keys(manifest).find(key => manifest[key].isEntry)
const tourKey = Object.keys(manifest).find(key => manifest[key].name === 'FactoryTourPage' && manifest[key].isDynamicEntry)
const runtimeKey = Object.keys(manifest).find(key => key.endsWith('/factory-runtime.ts'))
assert.ok(entryKey && tourKey && runtimeKey, 'Main, tour, and 3D runtime have separate entry points')
assert.ok(!staticFiles(entryKey).has(runtimeKey), 'Main website does not load the 3D engine')
assert.ok(!staticFiles(tourKey).has(runtimeKey), 'Tour preview does not load the 3D engine')
const initial = staticFiles(entryKey)
const tourFiles = new Set([...staticFiles(tourKey), ...staticFiles(runtimeKey)].filter(key => !initial.has(key)))
const gzipBytes = [...tourFiles].reduce((sum, key) => sum + gzipSync(fs.readFileSync('dist/' + manifest[key].file)).length, 0)
assert.ok(gzipBytes + imageBytes < 650000, 'Full tour payload budget')
console.log(JSON.stringify({ tourStops: tourStops.length, collisionAndJumpChecks: 'passed', hotspotOcclusion: 'passed', meshes, triangles, vertices, resourceDisposal: 'passed', posterAndTextureBytes: imageBytes, additionalTourJavaScriptGzipBytes: gzipBytes, tourJavaScriptPlusImagesBytes: gzipBytes + imageBytes, engineLoadsOnlyAfterEntry: true }, null, 2))
