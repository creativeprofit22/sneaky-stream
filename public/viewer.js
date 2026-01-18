// Sneaky Stream - Browser Viewer
(function () {
  const statusEl = document.getElementById('status');
  const screenshotEl = document.getElementById('screenshot');
  const placeholderEl = document.getElementById('placeholder');
  const fpsEl = document.getElementById('fps');
  const timestampEl = document.getElementById('timestamp');

  let ws = null;
  let frameCount = 0;
  let lastFpsUpdate = Date.now();

  function connect() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    ws = new WebSocket(`${protocol}//${window.location.host}`);

    ws.onopen = () => {
      statusEl.textContent = 'Connected';
      statusEl.className = 'status connected';
      placeholderEl.style.display = 'none';
      screenshotEl.style.display = 'block';
    };

    ws.onclose = () => {
      statusEl.textContent = 'Disconnected';
      statusEl.className = 'status disconnected';
      screenshotEl.style.display = 'none';
      placeholderEl.style.display = 'block';

      // Reconnect after 2 seconds
      setTimeout(connect, 2000);
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
      ws.close();
    };

    ws.onmessage = (event) => {
      // Update screenshot
      screenshotEl.src = event.data;

      // Update timestamp
      timestampEl.textContent = new Date().toLocaleTimeString();

      // Calculate FPS
      frameCount++;
      const now = Date.now();
      if (now - lastFpsUpdate >= 1000) {
        fpsEl.textContent = `${frameCount} FPS`;
        frameCount = 0;
        lastFpsUpdate = now;
      }
    };
  }

  // Start connection
  connect();
})();
