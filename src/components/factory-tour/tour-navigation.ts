import * as THREE from 'three'

export function finishCameraJump(camera: THREE.PerspectiveCamera, destination: { position: THREE.Vector3; rotation: THREE.Quaternion }): void {
  camera.position.copy(destination.position)
  camera.quaternion.copy(destination.rotation)
  camera.updateMatrixWorld()
}

export function isVisibleInScene(object: THREE.Object3D): boolean {
  let node: THREE.Object3D | null = object
  while (node) {
    if (!node.visible) return false
    node = node.parent
  }
  return true
}

export function pickVisibleTourStop(raycaster: THREE.Raycaster, scene: THREE.Scene, hotspots: THREE.Object3D[]): string | null {
  const hit = raycaster.intersectObjects(hotspots).find(item => isVisibleInScene(item.object))
  if (!hit) return null
  const blocker = raycaster.intersectObjects(scene.children, true).find(item =>
    item.object instanceof THREE.Mesh && !hotspots.includes(item.object) && isVisibleInScene(item.object),
  )
  if (blocker && blocker.distance < hit.distance - 0.08) return null
  return typeof hit.object.userData.stopId === 'string' ? hit.object.userData.stopId : null
}
