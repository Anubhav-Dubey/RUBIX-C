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
let resetTimeout = null;

// Event Listeners
btnStartStop.addEventListener('click', toggleTimer);
document.addEventListener('keydown', handleKeyPress);

function toggleTimer() {
  if (!isRunning) {
    startTimer();
  } else {
    stopTimer();
  }
}

function startTimer() {
  if (isRunning) return;
  
  // Clear any pending reset
  if (resetTimeout) {
    clearTimeout(resetTimeout);
    resetTimeout = null;
  }
  
  // ALWAYS reset to 0 when starting fresh
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
  
  // No automatic reset anymore - will reset on next start
}

function updateTime() {
  const currentTime = Date.now();
  elapsedTime = currentTime - startTime;
  timeDisplay.textContent = formatTime(elapsedTime);
}

function formatTime(milliseconds) {
  const date = new Date(milliseconds);
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');
  const centiseconds = Math.floor(date.getUTCMilliseconds() / 10).toString().padStart(2, '0');
  return `${minutes}:${seconds}.${centiseconds}`;
}

function updateStats() {
  lastTime = elapsedTime;
  lastTimeDisplay.textContent = `Last: ${formatTime(lastTime)}`;
  
  if (!bestTime || elapsedTime < bestTime) {
    bestTime = elapsedTime;
    bestTimeDisplay.textContent = `Best: ${formatTime(bestTime)}`;
  }
}

function showMessage(timeInMs) {
  const seconds = timeInMs / 1000;
  let message = "";
  let messageClass = "";
  
  if (seconds > 60) {
    message = "Keep practicing! 🧐";
    messageClass = "message-practice";
  } else if (seconds > 30) {
    message = "Good! 👍";
    messageClass = "message-good";
  } else if (seconds > 20) {
    message = "Fantastic!! ✨";
    messageClass = "message-fantastic";
  } else if (seconds > 15) {
    message = "Crazy fast!!! 🤯";
    messageClass = "message-crazy";
  } else {
    message = "GODLY SPEED!!! 🏆🤴";
    messageClass = "message-godly";
  }
  
  messageDisplay.textContent = message;
  messageDisplay.className = `message ${messageClass}`;
}

function handleKeyPress(e) {
  if (e.code === 'Space') {
    e.preventDefault();
    toggleTimer();
  }
}

// Initialize
timeDisplay.style.color = 'var(--white)';