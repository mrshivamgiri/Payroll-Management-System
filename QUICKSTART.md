# Payroll Management System - Quick Reference

## What's Included

✅ **Full-Stack Application**
- FastAPI Backend with SQLite database
- React Frontend with TailwindCSS
- Role-based authentication (Admin & Employee)
- Real-time data synchronization

✅ **Core Features**
- User signup/login with JWT authentication
- Admin: Create and update salary slips
- Admin: Approve/reject employee expenses
- Employee: View salary slips
- Employee: Submit and track expenses
- Charts and analytics dashboards
- Responsive mobile-friendly UI

✅ **Demo Users Ready**
- Admin Account: admin@company.com / Admin@2025!
- Employee Account: hire-me@anshumat.org / HireMe@2025!

## File Structure Overview

```
Payroll Management System/
├── backend/
│   ├── main.py                    # All FastAPI code
│   ├── requirements.txt           # Python packages
│   └── app.db                     # Auto-created database
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx               # Main routing
│   │   ├── api.js                # API client
│   │   ├── pages/                # Login, Signup, Dashboards
│   │   └── components/           # Navbar, Charts
│   ├── package.json              # Node packages
│   └── tailwind.config.js        # TailwindCSS config
│
├── README.md                      # Complete documentation
├── DEPLOYMENT.md                  # Setup guide
└── setup.sh / setup.bat          # Auto-setup scripts
```

## Getting Started in 3 Steps

### Step 1: Install Dependencies
```bash
# Windows
setup.bat

# macOS/Linux
chmod +x setup.sh && ./setup.sh
```

### Step 2: Start Backend
```bash
cd backend
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # macOS/Linux

uvicorn main:app --reload
```

### Step 3: Start Frontend
```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173` and login with demo credentials!

## API Endpoints Summary

### Auth (Public)
```
POST   /auth/signup          - Register new user
POST   /auth/login           - Get JWT token
GET    /auth/me              - Get current user
```

### Salary (Protected)
```
POST   /salary-slip          - Create (Admin only)
PUT    /salary-slip/{id}     - Update (Admin only)
GET    /salary-slip          - List own slips
GET    /salary-slip-all      - List all (Admin only)
```

### Expenses (Protected)
```
POST   /expense              - Submit new
GET    /expense              - List own
GET    /expenses-all         - List all (Admin only)
PUT    /expense/{id}/status  - Approve/reject (Admin only)
```

## Key Technologies

**Backend:**
- FastAPI (async Python web framework)
- SQLAlchemy (database ORM)
- SQLite (lightweight database)
- JWT (authentication tokens)
- Bcrypt (password hashing)

**Frontend:**
- React 18 (UI library)
- Vite (build tool - fast!)
- TailwindCSS (styling)
- Axios (HTTP requests)
- Chart.js (graphs & charts)

## Features by User Role

### Admin Can:
✅ Create salary slips for employees
✅ Edit existing salary slips
✅ View all employees
✅ Approve or reject expenses
✅ View salary analytics charts
✅ Monitor all salary history

### Employee Can:
✅ Login with email/password
✅ View own salary slips
✅ Submit monthly expenses
✅ Track expense status
✅ View salary trends chart
✅ See expense distribution chart

## Database Schema

**Users Table**
- id, email, hashed_password, role, created_at

**Salary Slips Table**
- id, user_id, month, base_salary, bonus, deductions, created_at

**Expenses Table**
- id, user_id, amount, description, status, created_at

## Common Tasks

### Create a Salary Slip
1. Login as admin
2. Go to "Salary Slips" tab
3. Click "Create Salary Slip"
4. Select employee, month, amounts
5. Click "Create"

### Submit an Expense
1. Login as employee
2. Go to "Expenses" tab
3. Click "New Expense"
4. Enter amount and description
5. Click "Submit Expense"

### View Salary Charts
1. Go to "Analytics" tab
2. View salary trends and distribution

## Troubleshooting Checklist

- [ ] Python 3.8+ installed?
- [ ] Node.js 16+ installed?
- [ ] Port 8000 available?
- [ ] Port 5173 available?
- [ ] `npm install` completed?
- [ ] Backend running?
- [ ] Frontend running?
- [ ] Using correct demo credentials?

## Performance

- Database optimized with proper indexes
- Frontend uses lazy loading and code splitting
- Charts rendered efficiently with Chart.js
- API responses cached where appropriate

## Security Implemented

✅ JWT authentication
✅ Password hashing with bcrypt
✅ CORS protection
✅ SQL injection prevention (ORM)
✅ Role-based access control

## Next Steps

1. **Test the application:**
   - Login with both admin and employee accounts
   - Create salary slips
   - Submit expenses
   - View analytics

2. **Customize for your needs:**
   - Modify colors in TailwindCSS
   - Add company logo
   - Change demo credentials
   - Add more users

3. **Deploy to production:**
   - Use PostgreSQL instead of SQLite
   - Set secure environment variables
   - Use Docker for containerization
   - Set up CI/CD pipeline

## Support

- **API Docs:** http://localhost:8000/docs (Swagger)
- **Database:** Delete app.db to reset
- **Logs:** Check terminal output
- **Errors:** Check browser console (F12)

## License

This is a sample project for educational purposes.

---

**Ready to run?** Start with the Quick Start section above!
