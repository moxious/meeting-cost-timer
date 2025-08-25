const functions = require('@google-cloud/functions-framework');

functions.http('redirect', (req, res) => {
  res.redirect('https://play.grafana.org/d/bedn3ke4t1uyoa/');
});
