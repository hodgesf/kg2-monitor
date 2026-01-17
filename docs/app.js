const hostEl = document.getElementById('host');
const summary = document.getElementById('summary');
const details = document.getElementById('details');
const failureSection = document.getElementById('failure-section');

function formatPST(isoString) {
  if (!isoString) return '—';
  const d = new Date(isoString);
  if (isNaN(d)) return '—';

  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZoneName: 'short'
  }).format(d);
}

function formatDuration(seconds) {
  const s = Number(seconds);
  if (!Number.isFinite(s) || s < 0) return '0s';

  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;

  return [
    h ? `${h}h` : null,
    m ? `${m}m` : null,
    `${r}s`
  ].filter(Boolean).join(' ');
}

fetch('./status.json', { cache: 'no-store' })
  .then(res => {
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return res.text();
  })
  .then(text => {
    if (!text.trim()) {
      throw new Error('Empty status.json');
    }

    const data = JSON.parse(text);

    // ---- REQUIRED BACKEND CONTRACT ----
    if (
      typeof data.host !== 'string' ||
      typeof data.status !== 'string' ||
      typeof data.last_checked !== 'string' ||
      typeof data.http_code !== 'number' ||
      typeof data.latency_ms !== 'number' ||
      typeof data.uptime_seconds !== 'number'
    ) {
      throw new Error('Invalid status.json schema');
    }

    return data;
  })
  .then(data => {
    hostEl.textContent = data.host;

    const rows = [
      ['Status', data.status.toUpperCase()],
      ['Last healthcheck', formatPST(data.last_checked)],
      ['Healthcheck latency', `${data.latency_ms} ms`],
      ['HTTP status', data.http_code],
      ['Instance running since', formatPST(data.up_since)],
      ['Time up', formatDuration(data.uptime_seconds)],
      ['Last crash', formatPST(data.last_crash)]
    ];

    summary.innerHTML = rows
      .map(([k, v]) => {
        const valueClass =
          k === 'Status'
            ? (data.status === 'up' ? 'status-up' : 'status-down')
            : '';

        return `
          <div>
            <strong>${k}:</strong>
            <span class="${valueClass}">${v}</span>
          </div>
        `;
      })
      .join('');

    if (data.status === 'down' && data.logs) {
      failureSection.hidden = false;
      details.textContent = JSON.stringify(data.logs, null, 2);
    } else {
      failureSection.hidden = true;
      details.textContent = '';
    }
  })
  .catch(err => {
    console.error('Status render failure:', err);

    summary.innerHTML = '⚠️ Unable to load monitoring state';
    failureSection.hidden = true;
    details.textContent = '';
  });
