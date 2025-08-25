# Meeting Cost Timer API

A unified Express.js application that provides various utility endpoints, migrated from Google Cloud Functions.

## Endpoints

- **`/time`** - Get current time information and epoch timestamps
- **`/crappykv`** - Simple in-memory key-value store
- **`/meetingCost`** - Calculate meeting costs based on attendees and duration
- **`/redirect`** - Redirect to Grafana dashboard
- **`/health`** - Health check endpoint
- **`/`** - Interactive BINGO board game (React app)
- **`/startup`** - Startup probe endpoint

## React BINGO App

The root `/` endpoint serves a complete React application featuring:

- **5x5 BINGO board** with meeting-related phrases instead of traditional numbers
- **Free space** in the center position
- **Clickable buttons** that stay depressed when marked
- **Random phrase generation** for each new game with no duplicates
- **Responsive design** for mobile and desktop
- **New Game button** to reset and generate a new board

**Note**: All API endpoints (`/time`, `/crappykv`, `/meetingCost`, etc.) remain accessible at their specific paths and are not affected by the React app routing.

### Features:
- **Meeting-themed phrases** like "Meeting that could have been an email" and "Someone says 'Let me share my screen'"
- **No duplicate phrases** on any single board
- **Visual feedback** for marked/unmarked cells
- **Hover effects** and smooth transitions
- **Mobile-responsive design** with optimized text sizing

## Local Development

1. Install dependencies:
   ```bash
   npm install
   cd bingo && npm install
   ```

2. Build the React app:
   ```bash
   cd bingo && npm run build
   cd ..
   ```
   
   **Important**: The React app must be built with `npm run build` in the `bingo/` directory before starting the Express server. This creates the production build that Express serves.

3. Start the development server:
   ```bash
   npm run dev
   ```

4. The server will run on `http://localhost:8080`
   - API endpoints: `http://localhost:8080/time`, `/crappykv`, etc.
   - BINGO app: `http://localhost:8080/` (root path)

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

### BINGO App
```bash
# Open in browser
open "http://localhost:8080/"
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

- **Express.js** - Web framework and API server
- **React** - Frontend BINGO game application
- **In-memory storage** - Simple key-value store (data is not persisted)
- **Docker** - Containerization for Cloud Run deployment
- **Alpine Linux** - Minimal base image for smaller container size

## Notes

- The key-value store (`/crappykv`) is in-memory and will reset when the container restarts
- All endpoints maintain the exact same API contract as the original Google Cloud Functions
- The React BINGO app is built during Docker build and served statically by Express
- The app is configured to run on port 8080 (Google Cloud Run default)
- Health checks are included for Cloud Run monitoring