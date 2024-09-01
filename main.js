import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
//import { GLTFLoader } from 'three/examples/jsm/Addons.js'
//import { OrbitControls } from 'three/examples/jsm/Addons.js'

//SETUP RENDER
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0x000000)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.NeutralToneMapping
renderer.toneMappingExposure = 0.45
document.body.appendChild(renderer.domElement)

//SETUP CAMERA
const camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 1, 1000)
camera.position.set(14, 24, 101)
camera.lookAt(0, 0, 0)

//SETUP SCENE
const scene = new THREE.Scene()

const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32)
groundGeometry.rotateX(-Math.PI / 2)
const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x555555,
    side: THREE.DoubleSide
})
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial)
groundMesh.castShadow = false
groundMesh.receiveShadow = true
//scene.add(groundMesh)

//ENVIORMENT
//new RGBELoader().load('enviorments/autumn_ground_4k.hdr', (enviormentMap) => {
//new RGBELoader().load('enviorments/green_sanctuary_4k.hdr', (enviormentMap) => {
//new RGBELoader().load('enviorments/rosendal_park_sunset_puresky_4k.hdr', (enviormentMap) => {
//new RGBELoader().load('enviorments/hilly_terrain_01_puresky_4k.hdr', (enviormentMap) => {
new RGBELoader().load('/celvaprod-three-js/enviorments/river_walk_1_4k.hdr', (enviormentMap) => {
//new RGBELoader().load('enviorments/rainforest_trail_4k.hdr', (enviormentMap) => {
    enviormentMap.mapping = THREE.EquirectangularReflectionMapping
    scene.background = enviormentMap
    scene.environment = enviormentMap
})

//SETUP LIGHT
const spotLight = new THREE.SpotLight(0xffffff, 500, 100, Math.PI / 3, 0.5)
spotLight.position.set(0, 10, 5)
spotLight.castShadow = true
spotLight.shadow.mapSize.width = 2048;
spotLight.shadow.mapSize.height = 2048;
spotLight.shadow.camera.near = 0.5;
spotLight.shadow.camera.far = 50;
spotLight.shadow.bias = -0.001
scene.add(spotLight)

const ambientLight = new THREE.AmbientLight(0xf62456, 1.5)
scene.add(ambientLight)

//3D OBJECT
const loader = new GLTFLoader().setPath('/celvaprod-three-js/microfono/')
loader.load('scene.gltf', (gltf) => {
    const mesh = gltf.scene
    
    mesh.traverse((node) => {
        if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
        }
    })
    
    mesh.position.set(0, 0.5, -1)
    scene.add(mesh)
})

//SETUP CONTROLS
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.enablePan = false
controls.minDistance = 5
controls.maxDistance = 20
controls.minPolarAngle = 0.5
controls.maxPolarAngle = 1.5
controls.autoRotate = false
controls.target = new THREE.Vector3(0, 1, 0)
controls.update()

//EVENTS
window.addEventListener('resize', () => {
    const width = window.innerWidth
    const height = window.innerHeight
    renderer.setSize(width, height)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
})

//RENDER LOOP
function animate() {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
}

animate()