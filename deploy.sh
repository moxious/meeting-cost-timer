#!/bin/bash

# Set your project ID and service name
PROJECT_ID="dev-advocacy-380120"
SERVICE_NAME="meeting-cost-dashboard"
REGION="us-central1"

cd bingo && npm install && npm run build && cd ..

# Build the Docker image for x86_64 (Cloud Run compatibility)
echo "Building Docker image for x86_64 platform..."
docker build --platform linux/amd64 -t gcr.io/$PROJECT_ID/$SERVICE_NAME .

# Push to Google Container Registry
echo "Pushing to Google Container Registry..."
docker push gcr.io/$PROJECT_ID/$SERVICE_NAME

# Deploy to Cloud Run
echo "Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 1 \
  --timeout 300 \
  --concurrency 100

echo "Deployment complete!"
echo "Service URL: https://$SERVICE_NAME-$(gcloud config get-value project).run.app"
