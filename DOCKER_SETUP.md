# TAUfoods Backend - Docker Setup

## Build Docker Image
```bash
docker build -t taufoods-backend .
```

## Run with Docker Compose (Recommended)
```bash
docker-compose up -d
```

This starts:
- Backend on http://localhost:5000
- MongoDB on http://localhost:27017
- Frontend on http://localhost:3000

## Run Standalone
```bash
docker run -p 5000:5000 \
  -e MONGO_URI=mongodb://your-cluster.mongodb.net/taufoods \
  -e JWT_SECRET=your_secret \
  taufoods-backend
```

## Deploy to Docker Hub
```bash
# Tag image
docker tag taufoods-backend yourusername/taufoods-backend

# Login
docker login

# Push
docker push yourusername/taufoods-backend
```

## View Logs
```bash
docker logs -f container_name
```
