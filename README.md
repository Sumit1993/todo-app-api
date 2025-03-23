# NestJS API

This is a NestJS backend service that fetches data from [DummyJSON Todos API](https://dummyjson.com/docs/todos). It is deployed in a Kubernetes cluster managed via Rancher Desktop.

## Features
- Built with **NestJS**
- Provides an API wrapper around the DummyJSON Todos API
- Integrated with **Prometheus** for monitoring
- Runs in a **Kubernetes** cluster managed via **Rancher Desktop**
- Uses **DevSpace** and **Helm** for deployment

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
The NestJS service exposes the following endpoints:

- `GET /todos` – Fetches all todos
- `GET /todos/:id` – Fetches a single todo
- `POST /todos` – Creates a new todo
- `PUT /todos/:id` – Updates an existing todo
- `DELETE /todos/:id` – Deletes a todo

Once deployed, the API is accessible at:

```
http://localhost/api/todos
```

## Debugging
To debug in VS Code, use the included `launch.json` and start the **Attach to NestJS Debug** configuration.

## Monitoring
The service is instrumented with Prometheus, which collects performance metrics for monitoring.

### Metrics Providers
The service supports two monitoring configurations:

1. **Local Monitoring** - Uses a local Prometheus pushgateway
   - Set `METRICS_PROVIDER=local` and `LOCAL_PUSHGATEWAY_URL` in `.env`
   - Works with the local monitoring setup in todo-app-ops

2. **Grafana Cloud** - Used for cloud deployments
   - Set `METRICS_PROVIDER=grafana` and appropriate Grafana Cloud credentials
   - Used automatically when deployed to Render
