const hostEl = document.getElementById('host');
const summary = document.getElementById('summary');
const details = document.getElementById('details');

function formatDuration(seconds) {
  if (!seconds || seconds <= 0) return '0s';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [
    h ? `${h}h` : null,
    m ? `${m}m` : null,
    `${s}s`
  ].filter(Boolean).join(' ');
}

fetch('./status.json', { cache: 'no-store' })
  .then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.text();
  })
  .then(text => {
    if (!text.trim()) throw new Error('Empty status.json');
    return JSON.parse(text);
  })
  .then(data => {
    hostEl.textContent = data.host;

    const rows = [
      ['Status', data.status.toUpperCase()],
      ['Last healthcheck', data.last_checked],
      ['Healthcheck latency', `${data.latency_ms} ms`],
      ['HTTP status', data.http_code],
      ['Instance running since', data.up_since || '—'],
      ['Time up', formatDuration(data.uptime_seconds)],
      ['Last crash', data.last_crash || '—']
    ];

    summary.innerHTML = rows
      .map(([k, v]) => `<div><strong>${k}:</strong> ${v}</div>`)
      .join('');

    summary.className = data.status === 'up' ? 'up' : 'down';

    if (data.status === 'down' && data.logs) {
      details.hidden = false;
      details.textContent = JSON.stringify(data.logs, null, 2);
    } else {
      details.hidden = true;
    }
  })
  .catch(err => {
    console.error(err);
    summary.textContent = '⚠️ Unable to load monitoring state';
    summary.className = 'unknown';
    details.hidden = true;
  });
