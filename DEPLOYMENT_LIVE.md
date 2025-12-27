# Live Deployment Guide

This guide provides multiple options to deploy your Payroll Management System live.

## Option 1: Deploy on Render (Free & Easy) ⭐ RECOMMENDED

### Backend Deployment (FastAPI)

1. **Push your code to GitHub** (Already done ✓)

2. **Create Render account**: https://render.com

3. **Deploy Backend**:
   - Go to https://dashboard.render.com/new/web
   - Connect your GitHub repo
   - Select repository: `Payroll-Management-System`
   - Environment: `Python 3`
   - Build Command: `pip install -r backend/requirements.txt`
   - Start Command: `cd backend && uvicorn main:app --host 0.0.0.0 --port 8000`
   - Set Environment Variables:
     - `SECRET_KEY`: Generate a secure key
   - Click Deploy
   - Your backend URL will be: `https://your-app.onrender.com`

### Frontend Deployment (React)

1. **Deploy Frontend**:
   - Go to https://dashboard.render.com/new/static
   - Connect your GitHub repo
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/dist`
   - Update `frontend/src/api.js` to use your backend URL:
   ```javascript
   const API_URL = 'https://your-app.onrender.com'
   ```
   - Click Deploy
   - Your frontend URL will be: `https://your-frontend.onrender.com`

---

## Option 2: Deploy on Vercel (Free Tier)

### Frontend only (Vercel specializes in frontend)

1. **Visit**: https://vercel.com
2. **Import Project**: Select GitHub repository
3. **Configure**:
   - **Root Directory**: `frontend` (important for monorepo setup)
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - **Environment Variables** (IMPORTANT):
     - Key: `VITE_API_URL`
     - Value: `https://your-backend-api.onrender.com` (or your backend URL)
4. **Deploy**

### Critical: Set Backend API URL
After deploying the backend (see Option 1 above), you **must** set the `VITE_API_URL` environment variable in Vercel:
- Go to Vercel Project Settings → Environment Variables
- Add: `VITE_API_URL=https://your-backend-url.onrender.com`
- Redeploy the frontend for changes to take effect

---

## Option 3: Deploy on Heroku (Paid)

### Backend & Frontend

1. **Install Heroku CLI**: https://devcenter.heroku.com/articles/heroku-cli
2. **Login**: `heroku login`
3. **Create app**: `heroku create payroll-management-system`
4. **Add Buildpacks**:
   ```bash
   heroku buildpacks:add heroku/python
   heroku buildpacks:add heroku/nodejs
   ```
5. **Create Procfile**:
   ```
   web: cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
6. **Deploy**: `git push heroku main`

---

## Option 4: Docker + Any Cloud (Advanced)

Create `Dockerfile` for containerized deployment:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install -r requirements.txt

COPY backend/ ./backend/

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Supports: AWS, Google Cloud, Azure, DigitalOcean, etc.

---

## Quick Deployment Checklist

### Before Deploying:
- [ ] Update `frontend/src/api.js` with live backend URL
- [ ] Update CORS settings in `backend/main.py` with live frontend URL
- [ ] Set secure `SECRET_KEY` environment variable
- [ ] Test locally: `npm run build` for frontend
- [ ] Ensure all dependencies in `requirements.txt` and `package.json`

### Update API Configuration:

**File**: `frontend/src/api.js`
```javascript
// Change this:
const API_URL = 'http://localhost:8000'

// To your live backend URL:
const API_URL = 'https://your-backend-url.onrender.com'
```

**File**: `backend/main.py`
```python
# Update CORS origins:
allow_origins=[
    "http://localhost:5173",
    "http://localhost:5174",
    "https://your-frontend-url.onrender.com"  # Add your live URL
]
```

---

## Live Links Example

Once deployed:
- **Frontend**: `https://payroll-ui.onrender.com`
- **Backend API**: `https://payroll-api.onrender.com`
- **API Docs**: `https://payroll-api.onrender.com/docs`

---

## For README.md

Add this to your GitHub README:

```markdown
## 🚀 Live Demo

- **Frontend**: [https://your-frontend-url.onrender.com](https://your-frontend-url.onrender.com)
- **Backend API**: [https://your-backend-url.onrender.com](https://your-backend-url.onrender.com)
- **API Documentation**: [https://your-backend-url.onrender.com/docs](https://your-backend-url.onrender.com/docs)

### Demo Credentials
- **Admin**: admin@company.com / Admin@2025!
- **Employee**: hire-me@anshumat.org / HireMe@2025!
```

---

## Recommended: Use Render (Free)

1. ✅ Free tier available
2. ✅ Easy GitHub integration
3. ✅ Auto-deploys on push
4. ✅ Good uptime
5. ✅ Custom domains supported

Start here: https://render.com
