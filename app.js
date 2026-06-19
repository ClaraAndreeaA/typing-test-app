// Minimal typing test logic for the scaffold
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
  errors: 0
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
  const el = textContainer.querySelector(`.char[data-index=\"${index}\"]`);
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
    if (mode === 'time' && state.elapsed >= 30) {
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
  const minutes = Math.max( (state.elapsed || 1) / 60, 1/60 );
  const wpm = Math.round((correctChars / 5) / minutes);
  const accuracy = totalTyped === 0 ? 100 : Math.round((correctChars / totalTyped) * 100);
  resWpm.textContent = wpm;
  resAccuracy.textContent = accuracy;
  resErrors.textContent = (totalTyped - correctChars) < 0 ? 0 : (totalTyped - correctChars);
  resTime.textContent = state.elapsed;
  results.classList.remove('hidden');
  results.setAttribute('aria-hidden', 'false');
  wpmEl.textContent = wpm;
  accuracyEl.textContent = accuracy;
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
  updateHighlight(typed);
});

function updateHighlight(typed) {
  const spans = textContainer.querySelectorAll('.char');
  let correctCount = 0;
  for (let i = 0; i < spans.length; i++) {
    const ch = spans[i];
    ch.classList.remove('correct','incorrect');
    const c = typed[i];
    if (c === undefined) {
      // not typed yet
    } else if (c === ch.textContent) {
      ch.classList.add('correct');
      correctCount++;
    } else {
      ch.classList.add('incorrect');
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
});
closeHelp && closeHelp.addEventListener('click', () => {
  helpModal.classList.add('hidden');
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
  // render an initial passage so layout is visible
  state.targetText = pickPassage();
  renderTarget(state.targetText);
})();
