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

// Event Listeners
btnStartStop.addEventListener('click', toggleTimer);
document.addEventListener('keydown', handleKeyPress);

// Main Functions
function toggleTimer() {
  if (!isRunning) startTimer();
  else stopTimer();
}

function startTimer() {
  if (isRunning) return;
  
  // Reset for new attempt
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
  generateScramble(); // New feature
}

function updateTime() {
  elapsedTime = Date.now() - startTime;
  timeDisplay.textContent = formatTime(elapsedTime);
}

// Helper Functions
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

// New Feature: Scramble Generator
function generateScramble() {
  const moves = ["U", "D", "L", "R", "F", "B"];
  const modifiers = ["", "'", "2"];
  let scramble = [];
  
  for (let i = 0; i < 20; i++) {
    scramble.push(
      moves[Math.floor(Math.random() * moves.length)] + 
      modifiers[Math.floor(Math.random() * modifiers.length)]
    );
  }
  
  console.log("New scramble:", scramble.join(" "));
  // You can display this in UI later
}

function handleKeyPress(e) {
  if (e.code === 'Space') {
    e.preventDefault();
    toggleTimer();
  }
}

// Initialize
timeDisplay.style.color = 'var(--white)';
