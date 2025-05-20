// cube.js - Fixed and optimized
let cube, scene, camera, renderer;
let isAnimating = false;
let currentSpeed = 0.05;

function initCube() {
  // 1. Setup scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x222222);
  
  // 2. Setup camera
  camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  camera.position.z = 5;
  
  // 3. Create renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(300, 300);
  document.getElementById('cube-container').appendChild(renderer.domElement);
  
  // 4. Add lights
  const light = new THREE.AmbientLight(0x404040);
  scene.add(light);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
  
  // 5. Create cube
  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const materials = [
    new THREE.MeshBasicMaterial({ color: 0xff0000 }), // Right
    new THREE.MeshBasicMaterial({ color: 0xffa500 }), // Left
    new THREE.MeshBasicMaterial({ color: 0xffffff }), // Top
    new THREE.MeshBasicMaterial({ color: 0xffff00 }), // Bottom
    new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // Front
    new THREE.MeshBasicMaterial({ color: 0x0000ff })  // Back
  ];
  
  cube = new THREE.Mesh(geometry, materials);
  scene.add(cube);
  
  // 6. Start animation
  animate();
}

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.005;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}

// Initialize on load
window.addEventListener('load', initCube);
