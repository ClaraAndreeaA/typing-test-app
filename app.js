import { calculateWpm, calculateAccuracy } from './src/metrics.js';
import { saveResult } from './src/storage.js';
import { trapFocus } from './src/focus-trap.js';

// Minimal typing test logic for the scaffold (ES module)
const startBtn = document.getElementById('startBtn');
const retryBtn = document.getElementById('retryBtn');
const resRetry = document.getElementById('resRetry');
const helpBtn = document.getElementById('helpBtn');
const closeHelp = document.getElementById('closeHelp');
const helpModal = document.getElementById('helpModal');

const textContainer = document.getElementById('textContainer');
const input = document.getElementById('input');
const timeEl = document.getElementById('time');
const wpmEl = document.getElementById('wpm');
const accuracyEl = document.getElementById('accuracy');

const results = document.getElementById('results');
const resWpm = document.getElementById('resWpm');
const resAccuracy = document.getElementById('resAccuracy');
const resErrors = document.getElementById('resErrors');
const resTime = document.getElementById('resTime');

const modeSelect = document.getElementById('mode');
const difficultySelect = document.getElementById('difficulty');

let state = {
  targetText: '',
  position: 0,
  startTime: null,
  timer: null,
  elapsed: 0,
  running: false,
  errors: 0,
  releaseFocusTrap: null
};

const passages = {
  easy: [
    'The quick brown fox jumps over the lazy dog.',
    'Hello world. This is a simple typing test example.'
  ],
  medium: [
    'Typing quickly requires practice and focus. Try to keep a steady rhythm and minimize mistakes.',
    'Practice daily to see measurable improvements in words per minute and accuracy.'
  ],
  hard: [
    'When optimizing for speed, accuracy often suffers; balance is essential to long-term progress.',
    'Complex sentences, punctuation, and capitalization increase cognitive load and slow raw speed initially.'
  ]
};

function pickPassage() {
  const d = difficultySelect.value || 'medium';
  const list = passages[d] || passages.medium;
  return list[Math.floor(Math.random() * list.length)];
}

function renderTarget(text) {
  textContainer.innerHTML = '';
  for (let i = 0; i < text.length; i++) {
    const span = document.createElement('span');
    span.className = 'char';
    span.dataset.index = i;
    span.textContent = text[i];
    textContainer.appendChild(span);
  }
  markCurrent(0);
}

function markCurrent(index) {
  const prev = textContainer.querySelector('.char.current');
  if (prev) prev.classList.remove('current');
  const el = textContainer.querySelector(`.char[data-index="${index}"]`);
  if (el) el.classList.add('current');
}

function startTest() {
  state.targetText = pickPassage();
  state.position = 0;
  state.startTime = Date.now();
  state.elapsed = 0;
  state.errors = 0;
  state.running = true;
  renderTarget(state.targetText);
  input.value = '';
  input.focus();
  results.classList.add('hidden');
  document.getElementById('testArea').classList.remove('hidden');
  retryBtn.disabled = false;
  // trap focus inside modal only when modal opens; no trap needed here
  startTimer();
}

function startTimer() {
  clearInterval(state.timer);
  const mode = modeSelect.value;
  let total = 30;
  if (mode === 'words') total = 9999; // don't stop by time in words mode for this scaffold
  state.timer = setInterval(() => {
    state.elapsed = Math.floor((Date.now() - state.startTime) / 1000);
    timeEl.textContent = state.elapsed;
    // auto end for timed mode
    if (mode === 'time' && state.elapsed >= total) {
      endTest();
    }
  }, 250);
}

function endTest() {
  if (!state.running) return;
  state.running = false;
  clearInterval(state.timer);
  // compute WPM and accuracy
  const typed = input.value || '';
  const correctChars = computeCorrectChars(typed, state.targetText);
  const totalTyped = typed.length || 0;
  const minutes = Math.max((state.elapsed || 1) / 60, 1 / 60);
  const wpm = calculateWpm(correctChars, state.elapsed || 1);
  const accuracy = calculateAccuracy(correctChars, totalTyped);
  resWpm.textContent = wpm;
  resAccuracy.textContent = accuracy;
  resErrors.textContent = Math.max(0, totalTyped - correctChars);
  resTime.textContent = state.elapsed;
  results.classList.remove('hidden');
  results.setAttribute('aria-hidden', 'false');
  wpmEl.textContent = wpm;
  accuracyEl.textContent = accuracy;

  // persist result
  try {
    saveResult({
      date: new Date().toISOString(),
      mode: modeSelect.value,
      wpm,
      accuracy,
      time: state.elapsed,
      errors: Math.max(0, totalTyped - correctChars)
    });
  } catch (err) {
    // ignore storage errors for now
    console.warn('Could not save result', err);
  }
}

function computeCorrectChars(typed, target) {
  let ok = 0;
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === target[i]) ok++;
  }
  return ok;
}

input.addEventListener('input', (e) => {
  if (!state.running) {
    // Automatically start on first input if not started
    startTest();
  }
  const typed = input.value;
  updateHighlightOptimized(typed);
});

function updateHighlightOptimized(typed) {
  const spans = Array.from(textContainer.querySelectorAll('.char'));
  for (let i = 0; i < spans.length; i++) {
    const el = spans[i];
    const c = typed[i];
    const isCorrect = c !== undefined && c === el.textContent;
    const isIncorrect = c !== undefined && c !== el.textContent;

    if (isCorrect && !el.classList.contains('correct')) {
      el.classList.remove('incorrect');
      el.classList.add('correct');
    } else if (isIncorrect && !el.classList.contains('incorrect')) {
      el.classList.remove('correct');
      el.classList.add('incorrect');
    } else if (c === undefined && (el.classList.contains('correct') || el.classList.contains('incorrect'))) {
      el.classList.remove('correct', 'incorrect');
    }
  }
  markCurrent(typed.length);
}

startBtn.addEventListener('click', () => {
  startTest();
});

retryBtn.addEventListener('click', () => {
  startTest();
});

resRetry.addEventListener('click', () => {
  startTest();
});

helpBtn.addEventListener('click', () => {
  helpModal.classList.remove('hidden');
  const content = helpModal.querySelector('.modal-content');
  if (content) {
    state.releaseFocusTrap = trapFocus(content);
    // focus first focusable
    const first = content.querySelector('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])');
    if (first) first.focus();
  }
});
closeHelp && closeHelp.addEventListener('click', () => {
  helpModal.classList.add('hidden');
  if (state.releaseFocusTrap) {
    state.releaseFocusTrap();
    state.releaseFocusTrap = null;
  }
});

// Warn on unload if test is running
window.addEventListener('beforeunload', (e) => {
  if (state.running) {
    e.preventDefault();
    e.returnValue = '';
  }
});

// Basic keyboard shortcut: R to retry
window.addEventListener('keydown', (e) => {
  if ((e.key === 'r' || e.key === 'R') && !e.metaKey && !e.ctrlKey) {
    if (!results.classList.contains('hidden')) {
      startTest();
    }
  }
});

// Initialize
(function init() {
  state.targetText = pickPassage();
  renderTarget(state.targetText);
})();
