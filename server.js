const express = require('express');
const path = require('path');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'dist' directory (the output of `expo export`)
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback to index.html for React Navigation / single-page apps
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  // Keep-Awake mechanism for Render
  const renderUrl = process.env.RENDER_EXTERNAL_URL;
  if (renderUrl) {
    console.log(`Keep-awake mechanism started. Pinging ${renderUrl} every 14 minutes.`);
    
    // Ping every 14 minutes (840,000 milliseconds)
    setInterval(() => {
      // Use https since Render URLs are https
      https.get(renderUrl, (res) => {
        console.log(`[Keep-Awake] Pinged successfully. Status: ${res.statusCode}`);
      }).on('error', (err) => {
        console.error(`[Keep-Awake] Ping failed:`, err.message);
      });
    }, 14 * 60 * 1000);
  } else {
    console.log('No RENDER_EXTERNAL_URL found. Keep-awake is disabled (normal for local development).');
  }
});
