# Local Monitoring Setup

This guide explains how to set up and use local monitoring for the Todo App API during development.

## Overview

The Todo App supports two monitoring configurations:

1. **Local Monitoring** - For local development using Prometheus, Grafana, and Pushgateway
2. **Grafana Cloud** - For cloud deployment (configured automatically on Render)

This guide focuses on the local monitoring setup.

## Prerequisites

- Docker and Docker Compose installed
- The todo-app-ops repository cloned (contains the monitoring setup)

## Setting Up Local Monitoring

1. Navigate to the todo-app-ops repository:
   ```
   cd ../todo-app-ops/docker/local-monitoring
   ```

2. Start the local monitoring stack:
   ```
   docker-compose up -d
   ```

This starts:
- **Prometheus** - Metrics database (accessible at http://localhost:9090)
- **Grafana** - Visualization platform (accessible at http://localhost:3030)
- **Pushgateway** - Metrics push receiver (used by the API service)
- **Loki** - Log aggregator

## Configuring the Todo App API

1. Copy the example environment file in the todo-app-api directory:
   ```
   cp .env.example .env
   ```

2. Make sure the following settings are configured in your `.env`:
   ```
   METRICS_PROVIDER=local
   LOCAL_PUSHGATEWAY_URL=http://localhost:9091/metrics/job/todo-api
   ```

3. Start the API service:
   ```
   npm run start:dev
   ```

## Accessing Monitoring Dashboards

1. **Grafana Dashboard**: Open http://localhost:3030 in your browser
   - Default credentials: admin/admin
   - The Todo App dashboard should be available in the dashboard list

2. **Prometheus**: Open http://localhost:9090 in your browser to directly query metrics
   - You can use the Explorer view to check metrics like `http_request_duration_seconds`

## Troubleshooting

- **Metrics not showing up?** Check:
  - Is the Pushgateway running? Visit http://localhost:9091
  - Is the API service running with the correct environment variables?
  - Check the API logs for any errors related to metrics pushing

- **Logs not appearing?** Local monitoring uses file-based logs:
  - Check the `logs/application.log` file in the API service directory

## Switching to Grafana Cloud

When you're ready to deploy to the cloud:

1. Change your environment configuration to use Grafana Cloud:
   ```
   METRICS_PROVIDER=grafana
   GRAFANA_PUSH_URL=your-grafana-cloud-url
   GRAFANA_LOKI_URL=your-grafana-loki-url
   GRAFANA_API_KEY=your-grafana-api-key
   GRAFANA_USERNAME=your-grafana-username
   GRAFANA_PASSWORD=your-grafana-password
   ```

2. These variables are already configured in the Render deployment configuration. 