# Today I Learned (TIL) App

## Overview
The Today I Learned (TIL) app is a web application that allows users to discover random facts about any topic using the Wikipedia API. Users can search for topics and receive interesting, educational content in an easy-to-understand format.

## Features
- **Topic Search**: Enter any topic to discover interesting facts
- **Random Facts**: Get random Wikipedia articles related to your search
- **Clean Interface**: Simple, intuitive web interface
- **Load Balanced**: Deployed across multiple servers with load balancing
- **Responsive Design**: Works on desktop and mobile devices

## API Used
- **Wikipedia API**: Uses Wikipedia's REST API and Search API
  - Search API: `https://en.wikipedia.org/w/api.php`
  - Summary API: `https://en.wikipedia.org/api/rest_v1/page/summary/`
  - Documentation: https://www.mediawiki.org/wiki/API:Main_page
## Live Demo 
https://youtu.be/TgiiNFymFl4    

## Local Development

### Prerequisites
- Node.js 18+
- Docker
- Docker Compose

### Build Instructions

1. Clone the repository:
```bash
git clone <your-repo-url>
cd today-i-learned-app
```

2. Build the Docker image:
```bash
docker build -t emmanuella00/today-i-learned-app:v1 .
```

3. Run locally:
```bash
docker run -p 8080:8080 emmanuella00/today-i-learned-app:v1
```

4. Access the application at: http://localhost:8080

### Testing the API
```bash
curl http://localhost:8080/api/wiki?topic=cats
```

## Production Deployment

### Three-Server Setup
The application is deployed using:
- **Web01**: Application instance 1
- **Web02**: Application instance 2  
- **Lb01**: HAProxy load balancer

### Deployment Steps

1. **Deploy on Web01 and Web02**:
```bash
# SSH into web-01
ssh user@web-01
docker pull emmanuella00/today-i-learned-app:v1
docker run -d --name app --restart unless-stopped -p 8080:8080 emmanuella00/today-i-learned-app:v1

# SSH into web-02
ssh user@web-02
docker pull emmanuella00/today-i-learned-app:v1
docker run -d --name app --restart unless-stopped -p 8080:8080 emmanuella00/today-i-learned-app:v1
```

2. **Configure Load Balancer (Lb01)**:
Update `/etc/haproxy/haproxy.cfg`:
```haproxy
backend webapps
    balance roundrobin
    server web01 172.20.0.11:8080 check
    server web02 172.20.0.12:8080 check
```

3. **Reload HAProxy**:
```bash
docker exec -it lb-01 sh -c 'haproxy -sf $(pidof haproxy) -f /etc/haproxy/haproxy.cfg'
```

## Load Balancer Configuration

### HAProxy Configuration
```haproxy
global
    daemon
    maxconn 256

defaults
    mode http
    timeout connect 5000ms
    timeout client 50000ms
    timeout server 50000ms

frontend til_frontend
    bind *:80
    default_backend webapps

backend webapps
    balance roundrobin
    server web01 172.20.0.11:8080 check
    server web02 172.20.0.12:8080 check
```

## Testing Load Balancing

### Verification Steps
1. Test individual servers:
```bash
curl http://172.20.0.11:8080/api/wiki?topic=test
curl http://172.20.0.12:8080/api/wiki?topic=test
```

2. Test through load balancer:
```bash
curl http://lb-01/api/wiki?topic=test
```

3. Multiple requests to verify round-robin:
```bash
for i in {1..5}; do curl http://lb-01/api/wiki?topic=test; done
```

### Evidence of Load Balancing
- HAProxy stats page available at: http://lb-01:8404/stats
- Round-robin distribution confirmed through multiple requests
- Both servers show as "UP" in HAProxy stats

## Local Testing with Docker Compose

For local testing of the full setup:

```bash
docker-compose up -d
```

This starts:
- web01 on port 8081
- web02 on port 8082  
- lb01 on port 80
- HAProxy stats on port 8404

## Security Considerations

### Handling Secrets
- No API keys required for Wikipedia API
- For production deployments with secrets:
  ```bash
  docker run -d --name app -e API_KEY=$API_KEY -p 8080:8080 emmanuella00/today-i-learned-app:v1
  ```
- Never commit sensitive information to the repository
- Use environment variables for configuration

## API Documentation

### Endpoints

#### GET /api/wiki
Get a random fact about a topic.

**Parameters:**
- `topic` (required): The topic to search for

**Example Request:**
```bash
GET /api/wiki?topic=artificial%20intelligence
```

**Example Response:**
```json
{
  "title": "Artificial Intelligence",
  "extract": "Artificial intelligence (AI) is intelligence demonstrated by machines...",
  "url": "https://en.wikipedia.org/wiki/Artificial_intelligence"
}
```

**Error Responses:**
- `400`: Missing topic parameter
- `500`: Failed to fetch data from Wikipedia

## Error Handling

The application includes comprehensive error handling:
- Invalid API requests return appropriate HTTP status codes
- Network failures are handled gracefully
- User-friendly error messages displayed in the UI
- Fallback responses when no data is found

## Development Challenges

1. **Docker Configuration**: Initially had issues with file paths in Docker build context
2. **Frontend Integration**: Needed to serve static files through Express
3. **Load Balancer Setup**: Required proper network configuration for container communication
4. **API Rate Limits**: Wikipedia API has rate limits that needed consideration

## Credits

- **Wikipedia API**: All content provided by Wikipedia under Creative Commons license
- **HAProxy**: Load balancing solution
- **Node.js & Express**: Backend framework
- **Docker**: Containerization platform

## License

This project is for educational purposes as part of a web infrastructure assignment.

---

**Note**: This application serves educational content from Wikipedia and provides genuine value by making learning accessible and engaging through random fact discovery.
