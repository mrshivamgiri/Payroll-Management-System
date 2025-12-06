# Payroll Management System

A comprehensive full-stack payroll management application built with FastAPI (backend) and React (frontend). The system supports role-based access with separate dashboards for Admins and Employees.

## 🚀 Live Demo

**Coming Soon!** Follow the deployment guide below to deploy your own instance.

### How to Get Live Links:
1. See [DEPLOYMENT_LIVE.md](./DEPLOYMENT_LIVE.md) for detailed deployment instructions
2. Recommended: Deploy free on [Render](https://render.com)
3. Once deployed, update this README with your live URLs

### Demo Credentials
- **Admin**: `admin@company.com` / `Admin@2025!`
- **Employee**: `hire-me@anshumat.org` / `HireMe@2025!`

## Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **SQLAlchemy** - ORM for database management
- **SQLite** - Lightweight relational database
- **Python-Jose** - JWT token authentication
- **Passlib + Bcrypt** - Secure password hashing

### Frontend
- **React** - UI library for building interactive interfaces
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Axios** - HTTP client for API communication
- **React Router** - Client-side routing

## Features

### Authentication
- ✅ User signup and login with email
- ✅ JWT-based authentication
- ✅ Role-based access control (Admin & Employee)
- ✅ Secure password hashing with bcrypt

### Admin Features
- ✅ Create and manage salary slips for employees
- ✅ Update existing salary slip details
- ✅ View all salary slips and employee information
- ✅ Define base salary, bonus, and deductions

### Employee Features
- ✅ View personal salary slips
- ✅ Submit monthly expenses
- ✅ Track expense history with status
- ✅ View salary breakdown (base, bonus, deductions)

### Optional Features
- 📊 Charts for salary and expense visualization (Chart.js)
- 📄 Export salary slips as PDF
- 🔔 Email notifications
- ✅ Expense approval/rejection workflow

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment**
   - On Windows:
   ```bash
   venv\Scripts\activate
   ```
   - On macOS/Linux:
   ```bash
   source venv/bin/activate
   ```

4. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Run the FastAPI server**
   ```bash
   uvicorn main:app --reload
   ```
   The backend will be available at `http://localhost:8000`
   API documentation: `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

## Demo Users

### Employee
- **Email:** hire-me@anshumat.org
- **Password:** HireMe@2025!
- **Role:** Employee

### Admin
- **Email:** admin@company.com
- **Password:** Admin@2025!
- **Role:** Admin

## API Endpoints

### Authentication
- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Login user (returns JWT token)
- `GET /auth/me` - Get current user information

### Admin Endpoints
- `POST /salary-slip` - Create a new salary slip
- `PUT /salary-slip/{id}` - Update an existing salary slip
- `GET /salary-slip-all` - Get all salary slips (admin only)
- `GET /users` - Get all users (admin only)

### Employee Endpoints
- `GET /salary-slip` - View own salary slips
- `POST /expense` - Submit a new expense
- `GET /expense` - View own expense history

## Database Schema

### Users Table
- `id` - Primary key
- `email` - Unique user email
- `hashed_password` - Bcrypt hashed password
- `role` - User role (admin/employee)
- `created_at` - Account creation timestamp

### Salary Slips Table
- `id` - Primary key
- `user_id` - Foreign key to Users
- `month` - Salary month (YYYY-MM format)
- `base_salary` - Base salary amount
- `bonus` - Bonus amount
- `deductions` - Deductions amount
- `created_at` - Record creation timestamp

### Expenses Table
- `id` - Primary key
- `user_id` - Foreign key to Users
- `amount` - Expense amount
- `description` - Expense description
- `status` - Expense status (submitted/approved/rejected)
- `created_at` - Record creation timestamp

## Project Structure

```
Payroll Management System/
├── backend/
│   ├── main.py              # FastAPI application and routes
│   ├── requirements.txt      # Python dependencies
│   └── app.db               # SQLite database (auto-created)
└── frontend/
    ├── src/
    │   ├── App.jsx          # Main React component
    │   ├── api.js           # API client configuration
    │   ├── index.css        # Global styles
    │   ├── main.jsx         # React entry point
    │   ├── pages/
    │   │   ├── Login.jsx     # Login page
    │   │   ├── Signup.jsx    # Signup page
    │   │   ├── AdminDashboard.jsx    # Admin dashboard
    │   │   └── EmployeeDashboard.jsx # Employee dashboard
    │   └── components/
    │       └── Navbar.jsx    # Navigation bar component
    ├── index.html           # HTML entry point
    ├── package.json         # Node dependencies
    ├── vite.config.js       # Vite configuration
    ├── tailwind.config.js   # TailwindCSS configuration
    └── postcss.config.js    # PostCSS configuration
```

## Security Features

1. **JWT Authentication** - Secure token-based authentication
2. **Password Hashing** - Bcrypt hashing with salt rounds
3. **CORS Configuration** - Restricted to frontend origin
4. **Role-Based Access Control** - Admin endpoints protected
5. **SQL Injection Prevention** - SQLAlchemy ORM prevents SQL injection

## Testing

To test the application:

1. Start the backend server
2. Start the frontend development server
3. Navigate to `http://localhost:5173`
4. Use demo credentials to login
5. Test features based on user role:
   - **Admin:** Create/update salary slips
   - **Employee:** View salary slips and submit expenses

## Future Enhancements

- 📊 Dashboard charts and analytics
- 📄 PDF export for salary slips
- 🔔 Email notifications for salary slip generation
- ✅ Expense approval workflow with admin review
- 💬 In-app notifications system
- 📱 Mobile-responsive improvements
- 🔐 Two-factor authentication
- 📊 Advanced reporting and analytics
- 🗂️ File upload for expense receipts
- 📧 Email integration for notifications

## Troubleshooting

### Backend Issues

1. **Port 8000 already in use:**
   ```bash
   uvicorn main:app --reload --port 8001
   ```
   Update frontend API URL in `api.js`

2. **Database locked error:**
   Delete `app.db` and restart the server (data will be reseeded)

### Frontend Issues

1. **Port 5173 already in use:**
   Update `vite.config.js` with a different port

2. **CORS errors:**
   Ensure backend is running on `http://localhost:8000`

3. **Module not found:**
   ```bash
   npm install
   npm run dev
   ```

## License

This project is provided as-is for educational purposes.

## Support

For issues or questions, please check:
- Backend logs in terminal running uvicorn
- Browser console for frontend errors
- API documentation at `http://localhost:8000/docs`
