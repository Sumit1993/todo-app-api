# Troubleshooting Guide

## Common Issues

### 429 Too Many Requests

**Symptom**: API returns 429 status code

**Cause**: Rate limit exceeded (100 requests/minute/IP)

**Solution**:
- Reduce request frequency
- Implement client-side rate limiting
- Contact admin to increase limits

### Slow API Responses

**Symptom**: Requests take longer than expected

**Cause**: External API (dummyjson.com) latency

**Solution**:
- Check external API status
- Increase timeout if needed
- Results are cached for 60s, subsequent requests should be fast

### Memory Usage Increasing

**Symptom**: Health endpoint shows growing heapUsed

**Cause**: Normal cache growth during operation

**Solution**:
- Cache automatically cleans up expired entries
- Memory stabilizes after initial load
- If persistent, restart the service

### Correlation ID Not Found in Logs

**Symptom**: Some log entries show "unknown" correlation ID

**Cause**: Async operations may lose context

**Solution**:
- This is expected for background tasks
- Request-initiated logs should have correlation IDs
