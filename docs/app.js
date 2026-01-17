fetch('status.json')
  .then(res => res.json())
  .then(data => {
    const host = document.getElementById('host');
    const summary = document.getElementById('summary');
    const details = document.getElementById('details');

    host.textContent = data.host;

    if (data.status === 'up') {
      summary.textContent = '✅ Working as expected';
      summary.className = 'up';
      details.hidden = true;
      return;
    }

    summary.textContent = '❌ SERVICE DOWN';
    summary.className = 'down';

    const failureDetails = {
      status: data.status,
      http_code: data.http_code,
      latency_ms: data.latency_ms,
      last_checked: data.last_checked,
      error: data.error,
      logs: data.logs
    };

    details.hidden = false;
    details.textContent = JSON.stringify(failureDetails, null, 2);
  })
  .catch(err => {
    document.getElementById('summary').textContent =
      '⚠️ Unable to load monitoring state';
  });
