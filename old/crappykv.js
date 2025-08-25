const functions = require('@google-cloud/functions-framework');

// In-memory storage object
const kvStore = {};

functions.http('crappykv', (req, res) => {
  const { key, value } = req.query;
  
  // Check if key is provided
  if (!key) {
    return res.status(400).json({ 
      error: "Key parameter is required" 
    });
  }
  
  // If value is provided, set the key-value pair
  if (value !== undefined) {
    kvStore[key] = value;
  }
  
  // Return the current value for the key (or null if not found)
  const currentValue = kvStore[key] || null;
  
  res.json({
    key: key,
    value: currentValue
  });
});
