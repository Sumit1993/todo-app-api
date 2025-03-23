# Cloud Deployment Guide

This guide explains how to deploy the Todo application to cloud services using free tiers.

## Architecture Overview

The application has been restructured to use the following cloud services:

- **Frontend**: Vercel (free tier)
- **Backend API**: Render (free tier)
- **Logging & Monitoring**: Grafana Cloud (free tier)

This eliminates the need for Kubernetes, reducing complexity and resource usage.

## Deployment Steps

### 1. Frontend Deployment (Vercel)

1. Create a Vercel account at https://vercel.com
2. Connect your GitHub repository
3. Import the `todo-app-ui` directory
4. Set the following environment variables:
   - `NEXT_PUBLIC_API_URL`: URL of your Render API (e.g., https://todo-app-api.onrender.com/api)
5. Deploy with default settings

### 2. Backend Deployment (Render)

1. Create a Render account at https://render.com
2. Connect your GitHub repository
3. Create a new Web Service pointing to the `todo-app-api` directory
4. Set the following environment variables:
   - `NODE_ENV`: production
   - `METRICS_PROVIDER`: grafana
   - `GRAFANA_PUSH_URL`: Your Grafana Cloud Prometheus remote write endpoint
   - `GRAFANA_LOKI_URL`: Your Grafana Loki API endpoint
   - `GRAFANA_API_KEY`: Your Grafana API key (for Loki access)
   - `GRAFANA_USERNAME`: Your Grafana Cloud username/instance ID (for metrics)
   - `GRAFANA_PASSWORD`: Your Grafana API key (for metrics)
5. Deploy with the following settings:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start:prod`

### 3. Grafana Cloud Setup

1. Create a free Grafana Cloud account at https://grafana.com/products/cloud/
2. Set up the following resources:
   
   #### For Metrics:
   - Navigate to the Prometheus section and get your remote write endpoint
   - Generate an API key with the "Metrics Publisher" role
   - Set the following environment variables in Render:
     - `GRAFANA_PUSH_URL`: Your Prometheus remote write endpoint
     - `GRAFANA_USERNAME`: Your Grafana Cloud instance ID
     - `GRAFANA_PASSWORD`: Your API key for metrics

   #### For Logging:
   - Navigate to Grafana Loki section and get your Loki URL endpoint
   - Generate an API key with the "Editor" role that has access to Loki
   - Set the following environment variables in Render:
     - `GRAFANA_LOKI_URL`: Your Loki push endpoint (typically ends with /loki/api/v1/push)
     - `GRAFANA_API_KEY`: Your API key for Loki access

## Verification

After deployment:

1. Verify the frontend is accessible via the Vercel URL
2. Check that API endpoints are responding at the Render URL
3. In Grafana Cloud:
   - Verify logs are appearing in Explore view (select Loki as data source)
   - Check that metrics are appearing in Explore view (select Prometheus as data source)
   - Create dashboards to monitor your application

## Creating a Basic Dashboard

1. In Grafana Cloud, go to Dashboards > New Dashboard
2. Add a new panel
3. For metrics, use queries like:
   - `http_request_duration_seconds_count` to see request counts
   - `http_request_duration_seconds_sum / http_request_duration_seconds_count` to see average request duration
4. For logs, use queries like:
   - `{app="todo-app-api"} |= "error"` to see error logs
   - `{app="todo-app-api"} |= "slow"` to see simulated slow response logs

## Resource Limitations

Be aware of the following limitations on free tiers:

- **Vercel**: Limited to 100GB bandwidth per month
- **Render**: Free web services spin down after 15 minutes of inactivity
- **Grafana Cloud**: 10K series metrics, 50GB of logs, 14-day retention 