// Jack's Dashboard - Data fetcher and renderer
const GITHUB_API = 'https://api.github.com';
const OWNER = 'jackmorrison12';
const MY_PRS = [73, 74, 75]; // PRs I created

// Task data synced from TASKS.md
const TASKS_DATA = [
  { id: 'task-002', description: 'Konami Code Easter Egg', status: 'waiting_review', pr: '#74', repo: 'milojack12/site' },
  { id: 'task-003', description: 'Social Icon Hover Effects', status: 'changes_requested', pr: '#73', repo: 'milojack12/site' },
  { id: 'task-004', description: 'Hidden Terminal Easter Egg', status: 'waiting_review', pr: '#75', repo: 'milojack12/site' }
];

// All open PRs (includes Dependabot)
const ALL_OPEN_PRS = [
  { number: 80, title: 'Bump immutable from 5.1.4 to 5.1.5', author: 'dependabot', isMine: false, status: 'pending' },
  { number: 79, title: 'Bump minimatch from 3.1.2 to 3.1.5', author: 'dependabot', isMine: false, status: 'pending' },
  { number: 78, title: 'Bump rollup from 2.79.2 to 2.80.0', author: 'dependabot', isMine: false, status: 'pending' },
  { number: 76, title: 'Bump ajv from 6.12.6 to 6.14.0', author: 'dependabot', isMine: false, status: 'pending' },
  { number: 75, title: 'feat: Hidden Terminal Easter Egg', author: 'milojack12', isMine: true, status: 'waiting_review', updatedAt: '2026-02-21T22:15:00Z', url: 'https://github.com/jackmorrison12/site/pull/75' },
  { number: 74, title: 'feat: Add Konami Code Easter egg', author: 'milojack12', isMine: true, status: 'COMMENTED', updatedAt: '2026-02-19T05:25:36Z', url: 'https://github.com/jackmorrison12/site/pull/74' },
  { number: 73, title: 'feat: Social Icon Hover Effects', author: 'milojack12', isMine: true, status: 'changes_requested', updatedAt: '2026-02-27T21:34:23Z', url: 'https://github.com/jackmorrison12/site/pull/73' },
  { number: 48, title: 'Add 2024 wrapped page', author: 'jackmorrison12', isMine: false, status: 'pending', updatedAt: '2026-01-15T10:00:00Z', url: 'https://github.com/jackmorrison12/site/pull/48' }
];

// Activity log
const ACTIVITY_DATA = [
  { date: '2026-03-12', type: 'pr_check', description: 'Checked PR statuses - 3 still awaiting review', time: '16:02' },
  { date: '2026-03-12', type: 'feature', description: 'Launched Jack\'s Dashboard v1.0', time: '15:45' },
  { date: '2026-03-05', type: 'pr_fix', description: 'Fixed social icon visibility in PR #73', time: '18:00' },
  { date: '2026-02-27', type: 'pr_fix', description: 'Fixed AnimatedIcon wrapper issues', time: '21:30' },
  { date: '2026-02-21', type: 'pr_update', description: 'Rewrote terminal easter egg for Jack', time: '20:00' }
];

// Status styles
const STATUS_STYLES = {
  'waiting_review': { class: 'status-waiting', label: '⏳ Waiting Review' },
  'changes_requested': { class: 'status-changes', label: '🔧 Changes Requested' },
  'COMMENTED': { class: 'status-commented', label: '💬 Commented' },
  'APPROVED': { class: 'status-approved', label: '✅ Approved' },
  'pending': { class: 'status-pending', label: '⏸️ Pending' },
  'completed': { class: 'status-completed', label: '✅ Completed' },
  'in_progress': { class: 'status-progress', label: '🔄 In Progress' }
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
  const myPRs = ALL_OPEN_PRS.filter(pr => pr.isMine);
  
  container.innerHTML = myPRs.map(pr => {
    const style = STATUS_STYLES[pr.status] || STATUS_STYLES.pending;
    return `
      <div class="pr-item">
        <a href="${pr.url}" target="_blank" class="pr-title">#${pr.number}: ${pr.title}</a>
        <span class="status-badge ${style.class}">${style.label}</span>
        <span class="pr-meta">Updated ${getRelativeTime(pr.updatedAt)}</span>
      </div>
    `;
  }).join('');
  
  // Add summary of other PRs
  const otherCount = ALL_OPEN_PRS.filter(pr => !pr.isMine).length;
  if (otherCount > 0) {
    container.innerHTML += `
      <div class="pr-summary">
        <span class="text-muted">Plus ${otherCount} other open PRs (including ${otherCount - 1} dependabot bumps)</span>
      </div>
    `;
  }
}

// Render Stats
function renderStats() {
  const myPRs = ALL_OPEN_PRS.filter(pr => pr.isMine);
  const waiting = myPRs.filter(p => p.status === 'waiting_review').length;
  const changes = myPRs.filter(p => p.status === 'changes_requested').length;
  const commented = myPRs.filter(p => p.status === 'COMMENTED').length;
  
  document.getElementById('openPrs').textContent = myPRs.length;
  document.getElementById('waitingReview').textContent = waiting;
  document.getElementById('changesRequested').textContent = changes;
  
  // Add commented count if element exists
  const commentedEl = document.getElementById('commented');
  if (commentedEl) commentedEl.textContent = commented;
}

// Render Activity
function renderActivity() {
  const container = document.getElementById('activityList');
  container.innerHTML = ACTIVITY_DATA.slice(0, 5).map(act => `
    <div class="activity-item">
      <span class="activity-icon">${getActivityIcon(act.type)}</span>
      <div class="activity-content">
        <p>${act.description}</p>
        <span class="activity-date">${act.date} • ${act.time}</span>
      </div>
    </div>
  `).join('');
}

function getActivityIcon(type) {
  const icons = {
    'pr_update': '🔄',
    'pr_fix': '🔧',
    'pr_check': '👁️',
    'feature': '✨',
    'merge': '✅',
    'comment': '💬'
  };
  return icons[type] || '📝';
}

// Render Tasks
function renderTasks() {
  const container = document.getElementById('tasksList');
  container.innerHTML = TASKS_DATA.map(task => {
    const style = STATUS_STYLES[task.status] || STATUS_STYLES.pending;
    return `
      <div class="task-item">
        <span class="task-pr">${task.pr}</span>
        <span class="task-desc">${task.description}</span>
        <span class="status-badge ${style.class}">${style.label}</span>
      </div>
    `;
  }).join('');
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
  
  // Manual refresh
  document.getElementById('refreshBtn').addEventListener('click', refreshAll);
});
