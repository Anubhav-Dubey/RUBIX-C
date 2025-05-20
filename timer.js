// DOM Elements
const btnStartStop = document.getElementById('btnStartStop');
const timeDisplay = document.getElementById('timeDisplay');
const lastTimeDisplay = document.getElementById('lastTime');
const bestTimeDisplay = document.getElementById('bestTime');
const messageDisplay = document.getElementById('messageDisplay');

// Timer Variables
let timer = null;
let startTime = 0;
let elapsedTime = 0;
let isRunning = false;
let lastTime = null;
let bestTime = null;

// Scramble Generator
const MOVES = ["U", "D", "L", "R", "F", "B"];
const MODIFIERS = ["", "'", "2"];

function generateScramble(length=20) {
  let scramble = [];
  let lastMove = "";
  
  for (let i = 0; i < length; i++) {
    let move;
    do {
      move = MOVES[Math.floor(Math.random() * MOVES.length)];
    } while (move === lastMove);
    
    const modifier = MODIFIERS[Math.floor(Math.random() * MODIFIERS.length)];
    scramble.push(move + modifier);
    lastMove = move;
  }
  
  const scrambleStr = scramble.join(' ');
  document.getElementById("scramble").textContent = scrambleStr;
   // ===== ADD THIS LINE =====
  if (window.cubeAPI) window.cubeAPI.visualizeScramble(scrambleStr);
  // ========================

  return scrambleStr;
}
  // Trigger 3D visualization
  if (window.cubeAPI) {
    window.cubeAPI.visualizeScramble(scrambleStr);
  }
  
  return scrambleStr;
}

// Event Listeners
btnStartStop.addEventListener('click', toggleTimer);
document.addEventListener('keydown', handleKeyPress);

function toggleTimer() {
  if (!isRunning) startTimer();
  else stopTimer();
}

function startTimer() {
  if (isRunning) return;
  
  elapsedTime = 0;
  timeDisplay.textContent = "00:00.00";
  messageDisplay.textContent = "";
  messageDisplay.className = "message";
  
  startTime = Date.now();
  timer = setInterval(updateTime, 10);
  isRunning = true;
  btnStartStop.textContent = 'Stop';
  timeDisplay.style.color = 'var(--orange)';
  timeDisplay.parentElement.style.boxShadow = '0 0 30px rgba(255, 87, 34, 0.6)';
}

function stopTimer() {
  clearInterval(timer);
  elapsedTime = Date.now() - startTime;
  isRunning = false;
  btnStartStop.textContent = 'Start';
  timeDisplay.style.color = 'var(--green)';
  timeDisplay.parentElement.style.boxShadow = '0 0 30px rgba(76, 175, 80, 0.6)';
  
  updateStats();
  showMessage(elapsedTime);
  generateScramble(); // Generate new scramble on stop
}

function updateTime() {
  elapsedTime = Date.now() - startTime;
  timeDisplay.textContent = formatTime(elapsedTime);
}

function formatTime(ms) {
  const date = new Date(ms);
  return [
    date.getUTCMinutes().toString().padStart(2, '0'),
    date.getUTCSeconds().toString().padStart(2, '0'),
    Math.floor(date.getUTCMilliseconds() / 10).toString().padStart(2, '0')
  ].join(':');
}

function updateStats() {
  lastTime = elapsedTime;
  lastTimeDisplay.textContent = `Last: ${formatTime(lastTime)}`;
  
  if (!bestTime || elapsedTime < bestTime) {
    bestTime = elapsedTime;
    bestTimeDisplay.textContent = `Best: ${formatTime(bestTime)}`;
  }
}

function showMessage(ms) {
  const sec = ms / 1000;
  let msg = "", cls = "";
  
  if (sec > 60) { msg = "Keep practicing! 🧐"; cls = "practice"; }
  else if (sec > 30) { msg = "Good! 👍"; cls = "good"; }
  else if (sec > 20) { msg = "Fantastic!! ✨"; cls = "fantastic"; }
  else if (sec > 15) { msg = "Crazy fast!!! 🤯"; cls = "crazy"; }
  else { msg = "GODLY SPEED!!! 🏆"; cls = "godly"; }
  
  messageDisplay.textContent = msg;
  messageDisplay.className = `message ${cls}`;
}

function handleKeyPress(e) {
  if (e.code === 'Space') {
    e.preventDefault();
    toggleTimer();
  }
}

// Initialize
timeDisplay.style.color = 'var(--white)';
generateScramble(); // Initial scramble

// Initialize cube when page loads
// ===== ADD THIS INIT CODE =====
// Initialize cube when page loads
window.addEventListener('load', () => {
  if (window.cubeAPI) {
    window.cubeAPI.initCube();
    
    // Optional: First scramble visualization
    const initialScramble = generateScramble();
    window.cubeAPI.visualizeScramble(initialScramble);
  }
});
// =============================
