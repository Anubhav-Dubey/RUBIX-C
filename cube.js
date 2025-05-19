// cube.js - Complete 3D Rubik's Cube Visualizer
let cube, scene, camera, renderer;
let isAnimating = false;
let currentSpeed = 0.05;
const cubeSize = 2.5; // Slightly larger for better visibility

// Cube face colors (standard Rubik's scheme)
const faceColors = {
  'U': 0xFFFFFF,  // White
  'D': 0xFFFF00,  // Yellow
  'L': 0xFFA500,  // Orange
  'R': 0xFF0000,  // Red
  'F': 0x00FF00,  // Green
  'B': 0x0000FF   // Blue
};

// Initialize 3D scene
function initCube() {
  // 1. Create scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x222222);

  // 2. Set up camera (adjusted for better viewing)
  camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
  camera.position.set(3, 3, 5);
  camera.lookAt(0, 0, 0);

  // 3. Initialize renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(300, 300);
  
  const container = document.getElementById('cube-container');
  container.innerHTML = ''; // Clear previous
  container.appendChild(renderer.domElement);

  // 4. Add lighting (enhanced)
  const ambientLight = new THREE.AmbientLight(0x404040, 2);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
  directionalLight.position.set(5, 10, 7);
  scene.add(directionalLight);

  // 5. Create the cube
  createCubeModel();

  // 6. Add controls
  addSpeedControl();
  addDragControls();
  addResizeListener();

  // 7. Start animation loop
  animate();
}

function createCubeModel() {
  const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
  const materials = [];
  
  // Create materials for each face
  ['R', 'L', 'U', 'D', 'F', 'B'].forEach(face => {
    materials.push(new THREE.MeshPhongMaterial({
      color: faceColors[face],
      shininess: 50,
      specular: 0x111111
    }));
  });

  cube = new THREE.Mesh(geometry, materials);
  scene.add(cube);
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  // Gentle auto-rotation when not animating
  if (!isAnimating) {
    cube.rotation.x += 0.003;
    cube.rotation.y += 0.005;
  }
  
  renderer.render(scene, camera);
}

// Execute a single move
async function executeMove(move) {
  const axis = getMoveAxis(move);
  const direction = getMoveDirection(move);
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
        // Snap to exact 90° increments
        cube.rotation[axis] = Math.round(cube.rotation[axis] / (Math.PI/2)) * (Math.PI/2);
        resolve();
      }
    }
    animateMove();
  });
}

// Visualize entire scramble
async function visualizeScramble(scramble) {
  if (isAnimating || !scramble) return;
  isAnimating = true;
  
  // Reset cube orientation
  cube.rotation.set(0, 0, 0);
  
  const moves = scramble.split(' ');
  updateMoveHistory(moves);

  for (let i = 0; i < moves.length; i++) {
    highlightCurrentMove(i);
    await executeMove(moves[i]);
  }

  isAnimating = false;
}

// Helper functions
function getMoveAxis(move) {
  if (move.includes('U') || move.includes('D')) return 'y';
  if (move.includes('L') || move.includes('R')) return 'x';
  return 'z';
}

function getMoveDirection(move) {
  if (move.includes("'")) return -1;
  if (move.includes("2")) return 2;
  return 1;
}

// UI Controls
function addSpeedControl() {
  const speedControl = `
    <div class="speed-control">
      <label>Animation Speed:</label>
      <select id="speedSelect">
        <option value="0.02">Slow</option>
        <option value="0.05" selected>Normal</option>
        <option value="0.1">Fast</option>
        <option value="0.15">Ultra Fast</option>
      </select>
    </div>
  `;
  
  document.getElementById('cube-container').insertAdjacentHTML('afterbegin', speedControl);
  document.getElementById('speedSelect').addEventListener('change', (e) => {
    currentSpeed = parseFloat(e.target.value);
  });
}

function addDragControls() {
  let isDragging = false;
  let previousPosition = { x: 0, y: 0 };
  const container = renderer.domElement;

  container.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return; // Only left mouse button
    isDragging = true;
    previousPosition = { x: e.clientX, y: e.clientY };
  });

  container.addEventListener('pointermove', (e) => {
    if (!isDragging || isAnimating) return;
    
    const delta = {
      x: e.clientX - previousPosition.x,
      y: e.clientY - previousPosition.y
    };

    cube.rotation.y += delta.x * 0.01;
    cube.rotation.x += delta.y * 0.01;
    previousPosition = { x: e.clientX, y: e.clientY };
  });

  const endDrag = () => isDragging = false;
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointerleave', endDrag);
}

function addResizeListener() {
  window.addEventListener('resize', () => {
    const container = document.getElementById('cube-container');
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
}

// Move history display
function updateMoveHistory(moves) {
  let historyEl = document.getElementById('move-history');
  
  if (!historyEl) {
    historyEl = document.createElement('div');
    historyEl.id = 'move-history';
    document.getElementById('cube-container').appendChild(historyEl);
  }

  historyEl.innerHTML = '';
  
  moves.forEach((move, i) => {
    const moveEl = document.createElement('span');
    moveEl.className = 'move';
    moveEl.textContent = move;
    moveEl.onclick = () => replayFromMove(i, moves);
    historyEl.appendChild(moveEl);
  });
}

function highlightCurrentMove(index) {
  const moves = document.querySelectorAll('.move');
  moves.forEach((move, i) => {
    move.style.backgroundColor = i === index ? '#555' : '#333';
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

// Export public methods
window.cubeAPI = {
  initCube,
  visualizeScramble
};
