// Jack's Dashboard - Data fetcher and renderer
const GITHUB_API = 'https://api.github.com';
const OWNER = 'jackmorrison12';

// Task data synced from TASKS.md
const TASKS_DATA = [
  { id: 'task-002', description: 'Konami Code Easter Egg', status: 'waiting_review', pr: '#74', repo: 'milojack12/site' },
  { id: 'task-003', description: 'Social Icon Hover Effects', status: 'changes_requested', pr: '#73', repo: 'milojack12/site' },
  { id: 'task-004', description: 'Hidden Terminal Easter Egg', status: 'waiting_review', pr: '#75', repo: 'milojack12/site' }
];

// PR data
const PRS_DATA = [
  { number: 73, title: 'feat: Social Icon Hover Effects', status: 'changes_requested', updatedAt: '2026-02-27T21:34:23Z', url: 'https://github.com/jackmorrison12/site/pull/73' },
  { number: 74, title: 'feat: Add Konami Code Easter egg', status: 'COMMENTED', updatedAt: '2026-02-19T05:25:36Z', url: 'https://github.com/jackmorrison12/site/pull/74' },
  { number: 75, title: 'feat: Hidden Terminal Easter Egg', status: 'waiting_review', updatedAt: '2026-02-21T22:15:00Z', url: 'https://github.com/jackmorrison12/site/pull/75' }
];

// Activity log (could be fetched from memory files)
const ACTIVITY_DATA = [
  { date: '2026-03-12', type: 'pr_update', description: 'Updated PR check timestamps', time: '08:33' },
  { date: '2026-03-05', type: 'pr_fix', description: 'Fixed social icon visibility in PR #73', time: '18:00' },
  { date: '2026-02-27', type: 'pr_fix', description: 'Fixed AnimatedIcon wrapper issues', time: '21:30' },
  { date: '2026-02-21', type: 'pr_update', description: 'Rewrote terminal easter egg for Jack', time: '20:00' },
  { date: '2026-02-18', type: 'feature', description: 'Created profile README on milojack12', time: '14:35' }
];

// Status colors
const STATUS_COLORS = {
  'waiting_review': 'status-waiting',
  'changes_requested': 'status-changes',
  'COMMENTED': 'status-commented',
  'APPROVED': 'status-approved',
  'completed': 'status-completed',
  'in_progress': 'status-progress'
};

// Status labels
const STATUS_LABELS = {
  'waiting_review': 'Waiting Review',
  'changes_requested': 'Changes Requested',
  'COMMENTED': 'Commented',
  'APPROVED': 'Approved',
  'completed': 'Completed',
  'in_progress': 'In Progress'
};

// Utility: Format relative time
function getRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

// Render PRs
function renderPRs() {
  const container = document.getElementById('prsList');
  container.innerHTML = PRS_DATA.map(pr => `
    <div class="pr-item">
      <a href="${pr.url}" target="_blank" class="pr-title">#${pr.number}: ${pr.title}</a>
      <span class="status-badge ${STATUS_COLORS[pr.status] || 'status-default'}">${STATUS_LABELS[pr.status] || pr.status}</span>
      <span class="pr-meta">Updated ${getRelativeTime(pr.updatedAt)}</span>
    </div>
  `).join('');
}

// Render Stats
function renderStats() {
  const waiting = PRS_DATA.filter(p => p.status === 'waiting_review').length;
  const changes = PRS_DATA.filter(p => p.status === 'changes_requested').length;
  
  document.getElementById('openPrs').textContent = PRS_DATA.length;
  document.getElementById('waitingReview').textContent = waiting;
  document.getElementById('changesRequested').textContent = changes;
}

// Render Activity
function renderActivity() {
  const container = document.getElementById('activityList');
  container.innerHTML = ACTIVITY_DATA.slice(0, 5).map(act => `
    <div class="activity-item">
      <span class="activity-type ${act.type}">${getActivityIcon(act.type)}</span>
      <div class="activity-content">
        <p>${act.description}</p>
        <span class="activity-date">${act.date} ${act.time}</span>
      </div>
    </div>
  `).join('');
}

function getActivityIcon(type) {
  const icons = {
    'pr_update': '🔄',
    'pr_fix': '🔧',
    'feature': '✨',
    'merge': '✅',
    'comment': '💬'
  };
  return icons[type] || '📝';
}

// Render Tasks
function renderTasks() {
  const container = document.getElementById('tasksList');
  container.innerHTML = TASKS_DATA.map(task => `
    <div class="task-item">
      <span class="task-pr">${task.pr}</span>
      <span class="task-desc">${task.description}</span>
      <span class="status-badge ${STATUS_COLORS[task.status] || 'status-default'}">${STATUS_LABELS[task.status] || task.status}</span>
    </div>
  `).join('');
}

// Update timestamp
function updateTimestamp() {
  document.getElementById('lastUpdated').textContent = new Date().toLocaleString();
}

// Refresh all data
function refreshAll() {
  renderPRs();
  renderStats();
  renderActivity();
  renderTasks();
  updateTimestamp();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  refreshAll();
  
  // Auto-refresh every 5 minutes
  setInterval(refreshAll, 5 * 60 * 1000);
  
  // Manual refresh button
  document.getElementById('refreshBtn').addEventListener('click', () => {
    refreshAll();
  });
});
