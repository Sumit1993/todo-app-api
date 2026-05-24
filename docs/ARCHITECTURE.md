# Architecture Overview

## System Components

```
┌─────────────┐     ┌─────────────┐     ┌─────────────────┐
│   Frontend  │────▶│   API       │────▶│  External API   │
│   (React)   │     │  (NestJS)   │     │  (dummyjson)    │
└─────────────┘     └─────────────┘     └─────────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  Prometheus │
                    │   Metrics   │
                    └─────────────┘
```

## API Layer

### Request Flow

1. Request arrives at controller
2. Correlation ID assigned for tracing
3. Service layer processes request
4. Cache checked before external calls
5. Response returned with metrics

### Timeout Configuration

All external API calls use a **5 second timeout**:
- Axios HTTP client: 5000ms
- Service-level timeout: 5000ms (matches axios)

This ensures consistent behavior across all external calls.

### Caching Strategy

- TTL: 60 seconds
- Memory-efficient Map-based storage
- Automatic cleanup every 30 seconds
- Write-through invalidation

### Rate Limiting

- Window: 60 seconds
- Max requests: 100 per IP per minute
- Atomic check-and-increment operation
