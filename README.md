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

### Run Locally
```
npm run start:dev
```

### Deploy to Local Kubernetes (with DevSpace)
```
cd todo-app-api
devspace dev
```

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
