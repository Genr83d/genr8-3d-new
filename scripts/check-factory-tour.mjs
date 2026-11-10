import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { gzipSync } from 'node:zlib'
import { build } from 'esbuild'

const cache = path.resolve('node_modules/.cache/factory-tour-check.mjs')
fs.mkdirSync(path.dirname(cache), { recursive: true })
await build({ stdin: { contents: `export * from './src/components/factory-tour/tour-stops'`, resolveDir: process.cwd() }, bundle: true, platform: 'node', format: 'esm', packages: 'external', outfile: cache })
const { tourStops, getStop, panoUrl, PLAN_BOUNDS, FLOOR_Z } = await import(cache + '?t=' + Date.now())

// Every stop has both panorama sizes, in the 2:1 shape the viewer expects.
function webpSize(file) {
  const data = fs.readFileSync(file)
  assert.equal(data.toString('ascii', 0, 4) + data.toString('ascii', 8, 12), 'RIFFWEBP', file + ' is a WebP image')
  const kind = data.toString('ascii', 12, 16)
  if (kind === 'VP8 ') return [data.readUInt16LE(26) & 0x3fff, data.readUInt16LE(28) & 0x3fff]
  if (kind === 'VP8X') return [data.readUIntLE(24, 3) + 1, data.readUIntLE(27, 3) + 1]
  const bits = data.readUInt32LE(21)
  return [(bits & 0x3fff) + 1, ((bits >> 14) & 0x3fff) + 1]
}
let fullBytes = 0, smallBytes = 0
assert.equal(new Set(tourStops.map(stop => stop.id)).size, tourStops.length, 'Stop IDs are unique')
for (const stop of tourStops) {
  for (const size of ['small', 'full']) {
    const file = 'public' + panoUrl(stop.id, size)
    assert.ok(fs.existsSync(file), 'Panorama exists: ' + file)
    const [width, height] = webpSize(file)
    assert.equal(width, height * 2, file + ' is equirectangular (2:1)')
    assert.ok(size === 'small' ? width <= 2560 : width >= 4096, file + ' has the expected resolution')
    const bytes = fs.statSync(file).size
    assert.ok(bytes < (size === 'small' ? 450_000 : 2_200_000), file + ' is within its transfer budget')
    if (size === 'small') smallBytes += bytes; else fullBytes += bytes
  }
  assert.ok(stop.eye[0] > PLAN_BOUNDS.minX && stop.eye[0] < PLAN_BOUNDS.maxX && stop.eye[1] > PLAN_BOUNDS.minY && stop.eye[1] < PLAN_BOUNDS.maxY, stop.id + ' sits on the floor plan')
  assert.ok(stop.eye[2] - FLOOR_Z[stop.floor] > 1.4 && stop.eye[2] - FLOOR_Z[stop.floor] < 1.8, stop.id + ' is at eye height')
  assert.ok(stop.links.length > 0, stop.id + ' has a way out')
  for (const link of stop.links) {
    const target = getStop(link.to)
    assert.ok(target && target !== stop, stop.id + ' links to a real stop')
    assert.ok(target.links.some(back => back.to === stop.id), `${stop.id} -> ${link.to} can be walked back`)
    assert.ok(Math.hypot(link.at[0] - stop.eye[0], link.at[1] - stop.eye[1]) > 0.5, `${stop.id} -> ${link.to} marker is not underfoot`)
  }
}
// The whole tour can be walked from the entrance using the floor markers alone.
const reached = new Set(['entrance'])
for (const id of reached) for (const link of getStop(id).links) reached.add(link.to)
assert.equal(reached.size, tourStops.length, 'Every stop is reachable from the entrance')
for (const id of ['entrance', 'landing']) assert.ok(getStop(id), 'Floor buttons need the ' + id + ' stop')
for (const name of ['preview.webp', 'plan-ground.webp', 'plan-upper.webp']) assert.ok(fs.existsSync('public/factory-tour/' + name), name + ' exists')

const manifest = JSON.parse(fs.readFileSync('dist/.vite/manifest.json', 'utf8'))
function staticFiles(key, seen = new Set()) {
  if (seen.has(key)) return seen
  seen.add(key)
  for (const child of manifest[key]?.imports ?? []) staticFiles(child, seen)
  return seen
}
const entryKey = Object.keys(manifest).find(key => manifest[key].isEntry)
const tourKey = Object.keys(manifest).find(key => manifest[key].name === 'FactoryTourPage' && manifest[key].isDynamicEntry)
const runtimeKey = Object.keys(manifest).find(key => key.endsWith('/pano-runtime.ts'))
assert.ok(entryKey && tourKey && runtimeKey, 'Main, tour, and 360 runtime have separate entry points')
assert.ok(!staticFiles(entryKey).has(runtimeKey), 'Main website does not load the 360 viewer')
assert.ok(!staticFiles(tourKey).has(runtimeKey), 'Tour preview does not load the 360 viewer')
const initial = staticFiles(entryKey)
const tourFiles = new Set([...staticFiles(tourKey), ...staticFiles(runtimeKey)].filter(key => !initial.has(key)))
const gzipBytes = [...tourFiles].reduce((sum, key) => sum + gzipSync(fs.readFileSync('dist/' + manifest[key].file)).length, 0)
const first = fs.statSync('public' + panoUrl('entrance', 'small')).size + fs.statSync('public/factory-tour/preview.webp').size + fs.statSync('public/factory-tour/plan-ground.webp').size
assert.ok(gzipBytes + first < 700_000, 'Entering the tour stays under 700 KB before the first sharp panorama')
console.log(JSON.stringify({ tourStops: tourStops.length, linksAndReachability: 'passed', panoramas: 'passed', smallPanoramaBytes: smallBytes, fullPanoramaBytes: fullBytes, tourJavaScriptGzipBytes: gzipBytes, bytesToFirstView: gzipBytes + first, viewerLoadsOnlyAfterEntry: true }, null, 2))
