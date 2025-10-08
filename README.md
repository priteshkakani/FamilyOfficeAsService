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
