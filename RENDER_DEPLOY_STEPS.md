# Render Deployment - Step by Step

## Your Current Setup ✅

### Frontend (package.json)
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```
✅ **Perfect for Render!**

### Backend (requirements.txt)
```
fastapi==0.115.2
uvicorn[standard]==0.32.0
SQLAlchemy==2.0.36
... (all dependencies included)
```
✅ **Ready to deploy!**

---

## Render Deployment Checklist

### STEP 1: Deploy Backend First

1. Go to: https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect Repository"**
4. Search and select: **`Payroll-Management-System`**
5. Click **"Connect"**

#### Configuration:
- **Name**: `payroll-api`
- **Environment**: `Python 3`
- **Region**: Choose closest to you
- **Build Command**: 
  ```
  pip install -r backend/requirements.txt
  ```
- **Start Command**: 
  ```
  cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
  ```

#### Environment Variables:
- Click **"Add Environment Variable"**
- **Key**: `SECRET_KEY`
- **Value**: `change-me-to-something-secure-12345`
- Click **"Add"**

#### Plan:
- Select **Free** (for testing)

6. Click **"Create Web Service"**
7. **Wait 5-10 minutes** for deployment
8. Once done, you'll see your URL: `https://payroll-api-xxxxx.onrender.com`

---

### STEP 2: Update API URL in Code

1. Go to GitHub: https://github.com/mrshivamgiri/Payroll-Management-System
2. Click on `frontend/src/api.js`
3. Click the **pencil icon** to edit
4. **Find this line** (line 3):
   ```javascript
   const API_URL = 'http://localhost:8000'
   ```
5. **Replace it with your backend URL**:
   ```javascript
   const API_URL = 'https://payroll-api-xxxxx.onrender.com'
   ```
   (Use YOUR actual URL from Step 1)

6. **Scroll down** and click **"Commit changes"**
7. Message: `Update API URL for Render deployment`
8. Click **"Commit"**

---

### STEP 3: Update CORS in Backend

1. In GitHub, go to `backend/main.py`
2. Click the **pencil icon** to edit
3. **Find this section** (around line 65-68):
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["http://localhost:5173", "http://localhost:5174"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

4. **Replace `allow_origins` with**:
   ```python
   allow_origins=[
       "http://localhost:5173",
       "http://localhost:5174",
       "https://payroll-ui-xxxxx.onrender.com"
   ]
   ```
   (Use YOUR frontend URL when you deploy it)

5. Click **"Commit changes"**
6. Message: `Update CORS for Render deployment`

---

### STEP 4: Deploy Frontend

1. Go back to: https://dashboard.render.com
2. Click **"New +"** → **"Static Site"**
3. Click **"Connect Repository"**
4. Select: **`Payroll-Management-System`**
5. Click **"Connect"**

#### Configuration:
- **Name**: `payroll-ui`
- **Build Command**: 
  ```
  cd frontend && npm install && npm run build
  ```
- **Publish Directory**: 
  ```
  frontend/dist
  ```

6. Click **"Create Static Site"**
7. **Wait 2-5 minutes** for deployment
8. You'll get URL: `https://payroll-ui-xxxxx.onrender.com`

---

### STEP 5: Final Update - Frontend URL in Backend

1. Go back to GitHub, edit `backend/main.py`
2. Update the CORS section with your actual frontend URL:
   ```python
   allow_origins=[
       "http://localhost:5173",
       "http://localhost:5174",
       "https://payroll-ui-xxxxx.onrender.com"  # YOUR actual URL
   ]
   ```
3. Commit and backend will auto-redeploy

---

## Your Live Links (Once Complete)

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | `https://payroll-ui-xxxxx.onrender.com` | Main app |
| Backend API | `https://payroll-api-xxxxx.onrender.com` | API endpoint |
| API Docs | `https://payroll-api-xxxxx.onrender.com/docs` | Swagger docs |

---

## Test Your Live App

1. Open: `https://payroll-ui-xxxxx.onrender.com`
2. Login with:
   - **Email**: `admin@company.com`
   - **Password**: `Admin@2025!`

---

## Common Issues & Solutions

| Problem | Solution |
|---------|----------|
| `502 Bad Gateway` | Wait 5+ minutes, backend may still be starting |
| `Cannot GET /` | Build failed - check Render logs |
| `CORS error in console` | Frontend URL not in backend `allow_origins` |
| `API not responding` | Check API URL in `frontend/src/api.js` is correct |
| `Database error` | SQLite auto-creates, usually works on first load |

---

## Update Your GitHub README

Once deployed, update `README.md`:

```markdown
## 🚀 Live Demo

- **Frontend**: https://payroll-ui-xxxxx.onrender.com
- **Backend API**: https://payroll-api-xxxxx.onrender.com
- **API Documentation**: https://payroll-api-xxxxx.onrender.com/docs

### Demo Credentials
- **Admin**: admin@company.com / Admin@2025!
- **Employee**: hire-me@anshumat.org / HireMe@2025!
```

---

## Done! 🎉

You now have a live Payroll Management System deployed on Render!

Share your live URL with others.
