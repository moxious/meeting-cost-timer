# Meeting Cost Timer API

A unified Express.js application that provides various utility endpoints, migrated from Google Cloud Functions.

## Endpoints

- **`/time`** - Get current time information and epoch timestamps
- **`/crappykv`** - Simple in-memory key-value store
- **`/meetingCost`** - Calculate meeting costs based on attendees and duration
- **`/redirect`** - Redirect to Grafana dashboard
- **`/health`** - Health check endpoint
- **`/`** - API documentation

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. The server will run on `http://localhost:8080`

## API Usage Examples

### Time Endpoint
```bash
curl "http://localhost:8080/time"
```

### Key-Value Store
```bash
# Set a value
curl "http://localhost:8080/crappykv?key=name&value=John"

# Get a value
curl "http://localhost:8080/crappykv?key=name"
```

### Meeting Cost Calculator
```bash
curl "http://localhost:8080/meetingCost?attendees=5&cost=100&startTime=1640995200"
```

### Redirect
```bash
curl -L "http://localhost:8080/redirect"
```

## Docker Deployment

### Build and Run Locally
```bash
# Build the image
docker build -t meeting-cost-timer .

# Run the container
docker run -p 8080:8080 meeting-cost-timer
```

### Deploy to Google Cloud Run

1. Update the `PROJECT_ID` in `deploy.sh`
2. Make sure you have `gcloud` CLI configured
3. Run the deployment script:
   ```bash
   ./deploy.sh
   ```

### Manual Deployment
```bash
# Build and tag
docker build -t gcr.io/YOUR_PROJECT_ID/meeting-cost-timer .

# Push to Container Registry
docker push gcr.io/YOUR_PROJECT_ID/meeting-cost-timer

# Deploy to Cloud Run
gcloud run deploy meeting-cost-timer \
  --image gcr.io/YOUR_PROJECT_ID/meeting-cost-timer \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080
```

## Environment Variables

- `PORT` - Server port (default: 8080)

## Architecture

- **Express.js** - Web framework
- **In-memory storage** - Simple key-value store (data is not persisted)
- **Docker** - Containerization for Cloud Run deployment
- **Alpine Linux** - Minimal base image for smaller container size

## Notes

- The key-value store (`/crappykv`) is in-memory and will reset when the container restarts
- All endpoints maintain the exact same API contract as the original Google Cloud Functions
- The app is configured to run on port 8080 (Google Cloud Run default)
- Health checks are included for Cloud Run monitoring

