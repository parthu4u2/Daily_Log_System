const STORAGE_KEY = 'daily-log-system-v1';
const TASKS = [
  { id: 'steps', title: '🚶 10,000 Steps Goal', points: 4 },
  { id: 'dsa', title: '📘 DSA Practice', points: 3 },
  { id: 'aiml', title: '🤖 AI/ML Learning', points: 3 }
];

const state = loadState();
const todayKey = formatDateKey(new Date());
ensureLogExists(todayKey);
renderApp();
registerServiceWorker();

function loadState() {
  const fallback = { logs: {} };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function ensureLogExists(dateKey) {
  if (!state.logs[dateKey]) {
    state.logs[dateKey] = {
      dateKey,
      tasks: Object.fromEntries(TASKS.map((t) => [t.id, { completed: false, imageData: '' }])),
      score: 0
    };
    saveState();
  }
}

function calculateScore(log) {
  return TASKS.reduce((total, task) => {
    return total + (log.tasks[task.id]?.completed ? task.points : 0);
  }, 0);
}

function renderApp() {
  const today = state.logs[todayKey];
  today.score = calculateScore(today);
  saveState();

  document.getElementById('todayDate').textContent = new Date(todayKey).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  document.getElementById('scoreValue').textContent = String(today.score);
  document.getElementById('streakValue').textContent = String(getCurrentStreak());

  renderTasks(today);
  renderHistory();
  wireActions();
}

function renderTasks(todayLog) {
  const container = document.getElementById('dailyTasks');
  container.querySelectorAll('.task').forEach((node) => node.remove());
  const template = document.getElementById('taskTemplate');

  TASKS.forEach((task) => {
    const fragment = template.content.cloneNode(true);
    const article = fragment.querySelector('.task');
    const title = fragment.querySelector('.task-title');
    const points = fragment.querySelector('.task-points');
    const checkbox = fragment.querySelector('.task-check');
    const file = fragment.querySelector('.task-file');
    const preview = fragment.querySelector('.preview');
    const taskState = todayLog.tasks[task.id];

    title.textContent = task.title;
    points.textContent = `${task.points} pts`;
    checkbox.checked = Boolean(taskState.completed);

    checkbox.addEventListener('change', () => {
      taskState.completed = checkbox.checked;
      todayLog.score = calculateScore(todayLog);
      saveState();
      renderApp();
    });

    file.addEventListener('change', () => {
      const selected = file.files?.[0];
      if (!selected) return;
      const reader = new FileReader();
      reader.onload = () => {
        taskState.imageData = String(reader.result || '');
        saveState();
        renderApp();
      };
      reader.readAsDataURL(selected);
    });

    if (taskState.imageData) {
      preview.src = taskState.imageData;
      preview.hidden = false;
      preview.alt = `${task.title} proof image`;
    }

    article.dataset.taskId = task.id;
    container.appendChild(fragment);
  });
}

function renderHistory() {
  const list = document.getElementById('historyList');
  list.innerHTML = '';

  const dates = Object.keys(state.logs).sort();
  if (!dates.length) return;

  const firstDate = new Date(`${dates[0]}T00:00:00`);
  const endDate = new Date();

  for (let d = new Date(firstDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const key = formatDateKey(d);
    const log = state.logs[key];
    const score = log ? calculateScore(log) : 0;

    const li = document.createElement('li');
    li.className = `history-item ${score === 10 ? 'full' : score > 0 ? 'partial' : 'missed'}`;
    li.innerHTML = `<span>${key}</span><strong>${score}/10</strong>`;
    list.prepend(li);
  }
}

function getCurrentStreak() {
  let streak = 0;
  const cursor = new Date();

  while (true) {
    const key = formatDateKey(cursor);
    const log = state.logs[key];
    const score = log ? calculateScore(log) : 0;
    if (score !== 10) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function wireActions() {
  const exportBtn = document.getElementById('exportBtn');
  const clearBtn = document.getElementById('clearBtn');

  exportBtn.onclick = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `daily-log-backup-${todayKey}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  clearBtn.onclick = () => {
    state.logs[todayKey] = {
      dateKey: todayKey,
      tasks: Object.fromEntries(TASKS.map((t) => [t.id, { completed: false, imageData: '' }])),
      score: 0
    };
    saveState();
    renderApp();
  };
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      // non-blocking for unsupported contexts
    });
  }
}
