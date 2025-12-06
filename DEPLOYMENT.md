# Deployment & Setup Guide

## Quick Start

### For Windows Users

1. **Run the setup script:**
   ```bash
   setup.bat
   ```

2. **In two separate terminals:**

   **Terminal 1 - Backend:**
   ```bash
   cd backend
   venv\Scripts\activate
   uvicorn main:app --reload
   ```

   **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

### For macOS/Linux Users

1. **Run the setup script:**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

2. **In two separate terminals:**

   **Terminal 1 - Backend:**
   ```bash
   cd backend
   source venv/bin/activate
   uvicorn main:app --reload
   ```

   **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

## Accessing the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs (Swagger UI)

## Demo Credentials

### Employee Account
- Email: `hire-me@anshumat.org`
- Password: `HireMe@2025!`

### Admin Account
- Email: `admin@company.com`
- Password: `Admin@2025!`

## Troubleshooting

### Backend won't start
- Make sure Python 3.8+ is installed: `python --version`
- Delete `__pycache__` and `app.db` files and try again
- Check if port 8000 is available

### Frontend won't start
- Make sure Node.js 16+ is installed: `node --version`
- Delete `node_modules` folder and run `npm install` again
- Check if port 5173 is available

### CORS Errors
- Ensure both backend and frontend are running
- Backend should be on `http://localhost:8000`
- Frontend should be on `http://localhost:5173`

### Database Issues
- Delete `app.db` file in backend folder - it will be recreated with demo users

## Project Structure

```
Payroll Management System/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt      # Python dependencies
│   ├── app.db               # SQLite database (auto-created)
│   ├── .env.example         # Environment variables template
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable components
│   │   ├── api.js          # API client
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
├── README.md
├── DEPLOYMENT.md
├── setup.bat               # Windows setup script
└── setup.sh                # macOS/Linux setup script
```

## Features Implemented

### Core Features (✅ Complete)
- JWT-based authentication with role-based access control
- Admin dashboard for salary slip management
- Employee dashboard for viewing salaries and submitting expenses
- Responsive UI with TailwindCSS
- Real-time data updates

### Optional Features (✅ Implemented)
- Charts and analytics for salary trends
- Expense approval/rejection workflow
- Salary and expense distribution visualization
- Demo user seeding

### API Endpoints

**Authentication:**
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user

**Admin Endpoints:**
- `POST /salary-slip` - Create salary slip
- `PUT /salary-slip/{id}` - Update salary slip
- `GET /salary-slip-all` - Get all salary slips
- `GET /users` - Get all users
- `GET /expenses-all` - Get all expenses
- `PUT /expense/{id}/status` - Approve/reject expenses

**Employee Endpoints:**
- `GET /salary-slip` - View own salary slips
- `POST /expense` - Submit expense
- `GET /expense` - View own expenses

## Development Tips

### Adding New Features

1. **Backend (FastAPI):**
   - Add route in `main.py`
   - Create Pydantic models for request/response
   - Update database models if needed

2. **Frontend (React):**
   - Add API method in `src/api.js`
   - Create component in `src/pages/` or `src/components/`
   - Import and use in parent components

### Database Queries

The database is automatically created on first run with demo users:
- Email: `hire-me@anshumat.org` (Employee)
- Email: `admin@company.com` (Admin)

To reset the database, delete `app.db` and restart the backend.

## Environment Variables

Create a `.env` file in the backend folder with:

```env
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
DATABASE_URL=sqlite:///./app.db
CORS_ORIGINS=http://localhost:5173
ENVIRONMENT=development
```

## Performance Notes

- Database queries are optimized with proper filtering
- Frontend uses efficient state management with React hooks
- Charts use Chart.js for smooth rendering
- CORS is configured for security

## Security Features

1. **JWT Tokens** - Secure token-based authentication
2. **Password Hashing** - Bcrypt with salt for secure passwords
3. **Role-Based Access** - Admin endpoints protected
4. **CORS** - Cross-origin requests restricted to localhost

## Next Steps for Production

1. Use PostgreSQL instead of SQLite
2. Add HTTPS/SSL certificates
3. Set strong SECRET_KEY and store in environment
4. Configure CORS properly for your domain
5. Add rate limiting
6. Implement logging and monitoring
7. Add database migrations
8. Use Docker for containerization
9. Set up CI/CD pipeline
10. Add email notifications

## Support & Issues

- Check backend logs in terminal
- Check browser console for frontend errors
- API documentation available at `/docs` endpoint
- Ensure ports 8000 and 5173 are not in use
