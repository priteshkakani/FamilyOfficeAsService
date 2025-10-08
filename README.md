# FamilyOfficeAsService

# Family Office as a Service

## Backend Setup

1. Create a MySQL database named `family_office` and run `backend/schema.sql` to create tables.
2. Update `backend/app/database.py` with your MySQL username and password.
3. Install backend dependencies:
   ```sh
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
4. Start the backend server:
   ```sh
   uvicorn app.main:app --reload
   ```

## Frontend Setup

1. Install frontend dependencies:
   ```sh
   cd frontend
   npm install
   ```
2. Start the frontend:
   ```sh
   npm start
   ```

## Project Structure

- `backend/`: FastAPI backend
- `frontend/`: React frontend
- `backend/schema.sql`: MySQL schema

---

This project provides a working onboarding flow for a family office platform.

(Initial working onboarding scaffold: backend (FastAPI), frontend (React), MySQL schema)

# Docker & Kubernetes Deployment

## Docker Compose (Local Dev)

1. Build and start all services:
   ```sh
   docker-compose up --build
   ```
2. Access:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8000
   - MySQL: localhost:3306 (user: familyuser, password: familypassword)

## Kubernetes (Production/Cloud)

1. Build and push images (replace `priteshkakani` with your Docker Hub username if needed):
   ```sh
   # Backend
   docker build -t priteshkakani/familyoffice-backend:latest ./backend
   docker push priteshkakani/familyoffice-backend:latest
   # Frontend
   docker build -t priteshkakani/familyoffice-frontend:latest ./frontend
   docker push priteshkakani/familyoffice-frontend:latest
   ```
2. Deploy to Kubernetes:
   ```sh
   kubectl apply -f k8s/mysql-deployment.yaml
   kubectl apply -f k8s/backend-deployment.yaml
   kubectl apply -f k8s/frontend-deployment.yaml
   ```
3. Access:
   - Frontend: LoadBalancer IP (see `kubectl get svc frontend`)
   - Backend: ClusterIP or NodePort (see `kubectl get svc backend`)
   - MySQL: ClusterIP (internal to cluster)

---

- All configs are in the `k8s/` directory.
- For production, use Kubernetes secrets for DB passwords and configure persistent storage for MySQL.
- Scale pods by editing the `replicas` field in the deployment YAMLs.
