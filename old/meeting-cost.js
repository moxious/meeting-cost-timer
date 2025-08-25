const functions = require('@google-cloud/functions-framework');

functions.http('meetingCost', (req, res) => {
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
