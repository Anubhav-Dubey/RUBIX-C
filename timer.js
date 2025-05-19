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
  timeDisplay.style.color = '#FF5722';
}

function stopTimer() {
  clearInterval(timer);
  elapsedTime = Date.now() - startTime;
  isRunning = false;
  btnStartStop.textContent = 'Start';
  timeDisplay.style.color = '#4CAF50';
  
  updateStats();
  showMessage(elapsedTime);
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
timeDisplay.style.color = '#ffffff';
