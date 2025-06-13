# Todo App API

A comprehensive NestJS backend service designed as a **testing platform for incident response and monitoring systems**. This API provides realistic incident simulation capabilities, structured logging, and comprehensive monitoring to validate AI-powered observability and alerting workflows.

## Purpose
This API serves as the **backend component of a todo application testing workspace** specifically built to generate realistic alerts and incidents for testing automated incident response systems, monitoring tools, and observability platforms.

## Features
- **Incident Simulation Engine**: Comprehensive error simulation (500 errors, latency, memory leaks, etc.)
- **Structured Logging**: Enhanced Winston logging with correlation IDs, memory stats, and error context
- **Prometheus Monitoring**: Full metrics instrumentation for alerts and performance tracking  
- **Memory Leak Testing**: Controllable memory allocation/deallocation for memory pressure testing
- **Production Deployment**: Deployed on Render.com with realistic cloud monitoring
- **Flexible Integration**: Designed to work with any incident response or monitoring system

## Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Rancher Desktop](https://rancherdesktop.io/)
- [Kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Helm](https://helm.sh/)
- [DevSpace](https://devspace.sh/)

## Getting Started

### Install Dependencies
```
cd todo-app-api
npm install
```

### Environment Setup
The application uses environment variables for configuration. For local development:

1. Copy the example environment file:
```
cp .env.example .env
```

2. Edit the `.env` file with your preferred settings. By default, it's configured for local development.

For local metrics monitoring, you need to:
1. Set `METRICS_PROVIDER=local` in your `.env` file
2. Set `LOCAL_PUSHGATEWAY_URL=http://localhost:9091/metrics/job/todo-api` (assuming you're running local monitoring)
3. Make sure you have the local monitoring stack running (see the todo-app-ops repository)

### Run Locally
```
npm run start:dev
```

### Deploy to Local Kubernetes (with DevSpace)
```
cd todo-app-api
devspace dev
```

### Cloud Deployment
For deploying to cloud services like Render, see [CLOUD_DEPLOYMENT.md](CLOUD_DEPLOYMENT.md).

### API Endpoints

#### Core Todo Endpoints
- `GET /todos` – Fetches all todos
- `GET /todos/:id` – Fetches a single todo  
- `POST /todos` – Creates a new todo
- `PUT /todos/:id` – Updates an existing todo
- `DELETE /todos/:id` – Deletes a todo

#### Incident Simulation Endpoints
- `GET /issues/simulate?type={issueType}` – Simulates various error conditions
  - Types: `slow`, `error`, `not-found`, `unauthorized`, `forbidden`, `bad-request`, `memory-leak`
- `POST /issues/service-down` – Simulates service unavailability
- `POST /issues/clear-memory-leak` – Clears allocated memory from memory leak simulation

#### Monitoring Endpoints  
- `GET /health` – Health check endpoint
- `GET /metrics` – Prometheus metrics endpoint

Once deployed, the API is accessible at:
```
http://localhost/api/todos
```

## Debugging
To debug in VS Code, use the included `launch.json` and start the **Attach to NestJS Debug** configuration.

## Monitoring & Incident Simulation

### Prometheus Metrics
The service is fully instrumented with Prometheus for comprehensive monitoring:
- HTTP request metrics (duration, count, status codes)
- Memory usage tracking  
- Custom business metrics
- Error rate monitoring

### Structured Logging
Enhanced logging provides rich context for incident analysis:
- **Correlation IDs**: Track requests across system boundaries
- **Memory Statistics**: Automatic memory usage logging on warnings/errors
- **Error Context**: Stack traces, error classification, and metadata
- **Performance Metrics**: Request timing and database operation logging

### Incident Simulation Features
- **Memory Leak Simulation**: Controllable memory allocation (10MB per request)
- **Error Rate Testing**: Configurable error responses for rate-based alerting
- **Latency Simulation**: Artificial delays to test performance monitoring
- **Service Downtime**: Simulated unavailability scenarios

### Alert Integration
Designed to trigger realistic Prometheus alerts:
- High error rate (>1% for 1+ minute)
- Memory usage thresholds (>200MB)  
- Request latency (>500ms average)
- Service availability monitoring

### Metrics Providers
The service supports two monitoring configurations:

1. **Local Monitoring** - Uses a local Prometheus pushgateway
   - Set `METRICS_PROVIDER=local` and `LOCAL_PUSHGATEWAY_URL` in `.env`
   - Works with the local monitoring setup in todo-app-ops

2. **Grafana Cloud** - Used for cloud deployments
   - Set `METRICS_PROVIDER=grafana` and appropriate Grafana Cloud credentials
   - Used automatically when deployed to Render
