const summary = document.getElementById('summary');
const hostEl = document.getElementById('host');
const details = document.getElementById('details');

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
    return JSON.parse(text);
  })
  .then(data => {
    hostEl.textContent = data.host ?? 'Unknown host';

    if (data.status === 'up') {
      summary.textContent = '✅ Working as expected';
      summary.className = 'up';
      details.hidden = true;
      return;
    }

    summary.textContent = '❌ SERVICE DOWN';
    summary.className = 'down';

    details.hidden = false;
    details.textContent = JSON.stringify({
      http_code: data.http_code,
      latency_ms: data.latency_ms,
      last_checked: data.last_checked,
      error: data.error,
      logs: data.logs
    }, null, 2);
  })
  .catch(err => {
    console.error(err);
    summary.textContent = '⚠️ Unable to load monitoring state';
    summary.className = 'unknown';
    details.hidden = true;
  });
