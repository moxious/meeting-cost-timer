const functions = require('@google-cloud/functions-framework');

functions.http('time', (req, res) => {
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
