// cube.js - Complete 3D Cube Visualizer
let cube, scene, camera, renderer;
let isAnimating = false;
let currentSpeed = 0.05;
const cubeSize = 2;
const faceColors = {
  'U': 0xFFFFFF, 'D': 0xFFFF00, 'L': 0xFFA500,
  'R': 0xFF0000, 'F': 0x00FF00, 'B': 0x0000FF
};

function initCube() {
  // Scene setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x222222);
  
  // Camera setup
  camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  camera.position.z = 5;
  
  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(300, 300);
  document.getElementById('cube-container').appendChild(renderer.domElement);
  
  // Lighting
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
  
  // Create cube
  const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
  const materials = [];
  ['R', 'L', 'U', 'D', 'F', 'B'].forEach(face => {
    materials.push(new THREE.MeshPhongMaterial({ 
      color: faceColors[face],
      shininess: 30
    }));
  });
  
  cube = new THREE.Mesh(geometry, materials);
  scene.add(cube);
  
  // Controls
  addDragControls();
  addSpeedControl();
  
  // Animation loop
  animate();
}

function animate() {
  requestAnimationFrame(animate);
  if (!isAnimating) {
    cube.rotation.x += 0.005;
    cube.rotation.y += 0.007;
  }
  renderer.render(scene, camera);
}

async function executeMove(move) {
  const axis = move.includes('U') || move.includes('D') ? 'y' :
               move.includes('L') || move.includes('R') ? 'x' : 'z';
  
  const direction = move.includes("'") ? -1 : move.includes("2") ? 2 : 1;
  const totalRotation = Math.PI/2 * direction;
  let rotated = 0;
  
  return new Promise((resolve) => {
    function animateMove() {
      const step = currentSpeed * Math.sign(totalRotation);
      cube.rotation[axis] += step;
      rotated += Math.abs(step);
      
      if (rotated < Math.abs(totalRotation)) {
        requestAnimationFrame(animateMove);
      } else {
        cube.rotation[axis] = Math.round(cube.rotation[axis] / (Math.PI/2)) * (Math.PI/2);
        resolve();
      }
    }
    animateMove();
  });
}

async function visualizeScramble(scramble) {
  if (isAnimating) return;
  isAnimating = true;
  
  cube.rotation.set(0, 0, 0);
  const moves = scramble.split(' ');
  updateMoveHistory(moves);
  
  for (let i = 0; i < moves.length; i++) {
    highlightCurrentMove(i);
    await executeMove(moves[i]);
  }
  
  isAnimating = false;
}

function addSpeedControl() {
  const speedControl = document.createElement('div');
  speedControl.innerHTML = `
    <div style="position: absolute; top: 10px; left: 10px; color: white;">
      Speed: 
      <select id="speedSelect" style="color: black;">
        <option value="0.02">Slow</option>
        <option value="0.05" selected>Normal</option>
        <option value="0.1">Fast</option>
      </select>
    </div>
  `;
  document.getElementById('cube-container').appendChild(speedControl);
  document.getElementById('speedSelect').addEventListener('change', (e) => {
    currentSpeed = parseFloat(e.target.value);
  });
}

function addDragControls() {
  let isDragging = false;
  let prevPos = { x: 0, y: 0 };
  const container = renderer.domElement;
  
  container.addEventListener('pointerdown', (e) => {
    isDragging = true;
    prevPos = { x: e.clientX, y: e.clientY };
  });
  
  container.addEventListener('pointermove', (e) => {
    if (!isDragging || isAnimating) return;
    const delta = {
      x: e.clientX - prevPos.x,
      y: e.clientY - prevPos.y
    };
    cube.rotation.y += delta.x * 0.01;
    cube.rotation.x += delta.y * 0.01;
    prevPos = { x: e.clientX, y: e.clientY };
  });
  
  container.addEventListener('pointerup', () => isDragging = false);
  container.addEventListener('pointerleave', () => isDragging = false);
}

function updateMoveHistory(moves) {
  let historyEl = document.getElementById('move-history');
  if (!historyEl) {
    historyEl = document.createElement('div');
    historyEl.id = 'move-history';
    document.getElementById('cube-container').appendChild(historyEl);
  }
  
  historyEl.innerHTML = '';
  moves.forEach((move, i) => {
    const moveEl = document.createElement('div');
    moveEl.textContent = move;
    moveEl.addEventListener('click', () => replayFromMove(i, moves));
    historyEl.appendChild(moveEl);
  });
}

function highlightCurrentMove(index) {
  const moves = document.querySelectorAll('#move-history div');
  moves.forEach((move, i) => {
    move.style.background = i === index ? '#666' : '#333';
  });
}

async function replayFromMove(index, moves) {
  if (isAnimating) return;
  isAnimating = true;
  cube.rotation.set(0, 0, 0);
  for (let i = index; i < moves.length; i++) {
    highlightCurrentMove(i);
    await executeMove(moves[i]);
  }
  isAnimating = false;
}

// Export API
window.cubeAPI = { initCube, visualizeScramble };