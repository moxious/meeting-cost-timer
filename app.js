/**
 * This code exists for the sole purpose to support this Grafana dashboard:
 * https://play.grafana.org/d/bedn3ke4t1uyoa/
 * 
 * This is a toy!  It's not production-ready, and it's not scalable. It's there
 * to provide barely enough computation that we can make the dashboard do what we want.
 */
const express = require('express');
const { LRUCache } = require('lru-cache');
const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware - allow all origins
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://play.grafana.org');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', '*');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// LRU cache for crappykv with max 1000 entries
const kvStore = new LRUCache({
  max: 1000,
  ttl: 1000 * 60 * 60 * 24, // 24 hours TTL (optional)
  updateAgeOnGet: true, // Update age when accessed
  allowStale: false
});

// Time endpoint (migrated from time.js)
app.get('/time', (req, res) => {
  const now = new Date();
  const millisecondsSinceEpoch = now.getTime();
  const secondsSinceEpoch = Math.floor(millisecondsSinceEpoch / 1000);
  const minutesSinceEpoch = Math.floor(secondsSinceEpoch / 60);
  const hoursSinceEpoch = Math.floor(minutesSinceEpoch / 60);
  const daysSinceEpoch = Math.floor(hoursSinceEpoch / 24);
  
  res.json({
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    utcTime: now.toISOString(),
    utcTimeReadable: now.toUTCString(),
    secondsSinceEpoch: secondsSinceEpoch,
    millisecondsSinceEpoch: millisecondsSinceEpoch,
    minutesSinceEpoch: minutesSinceEpoch,
    hoursSinceEpoch: hoursSinceEpoch,
    daysSinceEpoch: daysSinceEpoch,
    unixTimestamp: secondsSinceEpoch
  });
});

// Crappykv endpoint (migrated from crappykv.js)
app.get('/crappykv', (req, res) => {
  const { key, value } = req.query;
  
  // Check if key is provided
  if (!key) {
    return res.status(400).json({ 
      error: "Key parameter is required" 
    });
  }
  
  // Check key length
  if (key.length > 1024) {
    return res.status(400).json({
      error: "Exceeds maximum of 1024 characters"
    });
  }
  
  // Check value length if provided
  if (value !== undefined && value.length > 1024) {
    return res.status(400).json({
      error: "Exceeds maximum of 1024 characters"
    });
  }
  
  // If value is provided, set the key-value pair
  if (value !== undefined) {
    kvStore.set(key, value);
  }
  
  // Return the current value for the key (or null if not found)
  const currentValue = kvStore.get(key) || null;
  
  res.json({
    key: key,
    value: currentValue
  });
});

// Meeting cost endpoint (migrated from meeting-cost.js)
app.get('/meetingCost', (req, res) => {
  const attendees = parseInt(req.query.attendees);
  const cost = parseFloat(req.query.cost);
  const startTime = parseInt(req.query.startTime);
  
  const errorMessage = "Call this function with attendees, cost, and startTime, all of which are integers > 0; startTime should be indicated as seconds since the epoch relative to UTC time"

  // Input validation
  if (!attendees || attendees <= 0 || !Number.isInteger(attendees)) {
    return res.status(400).json({
      error: errorMessage
    });
  }
  
  if (!cost || cost <= 0 || !Number.isFinite(cost)) {
    return res.status(400).json({ error: errorMessage });
  }
  
  if (!startTime || startTime <= 0 || !Number.isInteger(startTime)) {
    return res.status(400).json({ error: errorMessage });
  }
  
  const totalCostPerHour = attendees * cost;
  const costPerMinute = totalCostPerHour / 60;
  const costPerSecond = costPerMinute / 60;
  const costPerMillisecond = costPerSecond / 1000;
  
  // Calculate elapsed time and total cost so far
  const currentTimeSeconds = Math.floor(Date.now() / 1000);
  const elapsedSeconds = Math.max(0, currentTimeSeconds - startTime);
  const totalMeetingCostSoFar = elapsedSeconds * costPerSecond;
  
  res.json({
    attendees: attendees,
    perPersonHourlyCost: cost,
    startTime: startTime,
    totalCostPerHour: totalCostPerHour,
    costPerMinute: costPerMinute,
    costPerSecond: costPerSecond,
    costPerMillisecond: costPerMillisecond,
    currentTimeSeconds: currentTimeSeconds,
    elapsedSeconds: elapsedSeconds,
    totalMeetingCostSoFar: totalMeetingCostSoFar
  });
});

// Serve static files from the React app build at root
app.use('/', express.static('bingo/build'));

// Serve the React app at root
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'bingo/build' });
});

// Handle React app routing - serve index.html for any route that's not an API endpoint
app.get('*', (req, res) => {
  // Skip API endpoints
  if (req.path.startsWith('/time') || 
      req.path.startsWith('/crappykv') || 
      req.path.startsWith('/meetingCost') || 
      req.path.startsWith('/redirect') || 
      req.path.startsWith('/health') ||
      req.path.startsWith('/startup')) {
    return res.status(404).json({ error: 'Not found' });
  }
  
  // Serve React app for all other routes
  res.sendFile('index.html', { root: 'bingo/build' });
});

// Redirect endpoint (migrated from redirect.js)
app.get('/redirect', (req, res) => {
  res.redirect('https://play.grafana.org/d/bedn3ke4t1uyoa/');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Startup probe endpoint (responds immediately)
app.get('/startup', (req, res) => {
  res.status(200).send('OK');
});

// Root endpoint
app.get('/', (req, res) => {
  res.redirect('https://play.grafana.org/d/bedn3ke4t1uyoa/');
});

// Start server
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port} (bound to 0.0.0.0)`);
  console.log(`Environment: PORT=${process.env.PORT}, NODE_ENV=${process.env.NODE_ENV}`);
  console.log(`Process ID: ${process.pid}`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Error handling
server.on('error', (error) => {
  console.error('Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use`);
  }
  process.exit(1);
});

module.exports = app;
