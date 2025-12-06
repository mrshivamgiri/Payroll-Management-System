# API Endpoints Reference

## Authentication Endpoints

### User Signup
**Endpoint:** `POST /auth/signup`
**Authentication:** None (Public)
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "role": "employee"  // or "admin"
}
```
**Response:** User object with id, email, role
**Status Code:** 200 OK

### User Login
**Endpoint:** `POST /auth/login`
**Authentication:** None (Public)
**Request Body:** (application/x-www-form-urlencoded)
```
username=user@example.com
password=SecurePassword123!
```
**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer"
}
```
**Status Code:** 200 OK

### Get Current User
**Endpoint:** `GET /auth/me`
**Authentication:** Required (Bearer Token)
**Response:** Current user object (id, email, role)
**Status Code:** 200 OK

---

## Admin Endpoints (Protected - Admin Only)

### Create Salary Slip
**Endpoint:** `POST /salary-slip`
**Authentication:** Required (Bearer Token, Admin Role)
**Request Body:**
```json
{
  "user_id": 1,
  "month": "2025-01",
  "base_salary": 50000,
  "bonus": 5000,
  "deductions": 5000
}
```
**Response:** Salary slip object with id, user_id, month, amounts, created_at
**Status Code:** 200 OK

### Update Salary Slip
**Endpoint:** `PUT /salary-slip/{id}`
**Authentication:** Required (Bearer Token, Admin Role)
**Request Body:**
```json
{
  "month": "2025-01",
  "base_salary": 55000,
  "bonus": 6000,
  "deductions": 5000
}
```
**Response:** Updated salary slip object
**Status Code:** 200 OK

### Get All Salary Slips
**Endpoint:** `GET /salary-slip-all`
**Authentication:** Required (Bearer Token, Admin Role)
**Response:** Array of all salary slip objects
**Status Code:** 200 OK

### Get All Users
**Endpoint:** `GET /users`
**Authentication:** Required (Bearer Token, Admin Role)
**Response:** Array of all user objects
**Status Code:** 200 OK

### Get All Expenses
**Endpoint:** `GET /expenses-all`
**Authentication:** Required (Bearer Token, Admin Role)
**Response:** Array of expense objects with user info
**Status Code:** 200 OK

### Update Expense Status
**Endpoint:** `PUT /expense/{id}/status`
**Authentication:** Required (Bearer Token, Admin Role)
**Query Parameters:** `status=approved` or `status=rejected`
**Response:**
```json
{
  "message": "Expense status updated to approved"
}
```
**Status Code:** 200 OK

---

## Employee Endpoints (Protected - All Authenticated Users)

### Get Own Salary Slips
**Endpoint:** `GET /salary-slip`
**Authentication:** Required (Bearer Token)
**Response:** Array of salary slips for current user
**Status Code:** 200 OK

### Create Expense
**Endpoint:** `POST /expense`
**Authentication:** Required (Bearer Token)
**Request Body:**
```json
{
  "amount": 1500,
  "description": "Client meeting travel"
}
```
**Response:** Created expense object with id, amount, description, status, created_at
**Status Code:** 200 OK

### Get Own Expenses
**Endpoint:** `GET /expense`
**Authentication:** Required (Bearer Token)
**Response:** Array of expenses for current user
**Status Code:** 200 OK

---

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Email already registered"
}
```

### 401 Unauthorized
```json
{
  "detail": "Could not validate credentials"
}
```

### 403 Forbidden
```json
{
  "detail": "Admin access required"
}
```

### 404 Not Found
```json
{
  "detail": "User not found"
}
```

---

## Demo Credentials

### Employee
- Email: `hire-me@anshumat.org`
- Password: `HireMe@2025!`

### Admin
- Email: `admin@company.com`
- Password: `Admin@2025!`

---

## Using the API

### 1. Login and get token
```bash
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin@company.com&password=Admin@2025!"
```

### 2. Use token for authenticated requests
```bash
curl -X GET "http://localhost:8000/auth/me" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Example: Create salary slip (Admin)
```bash
curl -X POST "http://localhost:8000/salary-slip" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "month": "2025-01",
    "base_salary": 50000,
    "bonus": 5000,
    "deductions": 5000
  }'
```

---

## API Documentation

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

Open these URLs in your browser after starting the backend to explore the API interactively.

---

## Status Codes Reference

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Request completed successfully |
| 400 | Bad Request | Invalid data or email already exists |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | User doesn't have required role (e.g., not admin) |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Internal server error |

---

## Rate Limiting

Not implemented in demo version. Recommended for production.

## CORS

CORS is configured to allow:
- Origin: `http://localhost:5173`
- Methods: All (GET, POST, PUT, DELETE, etc.)
- Headers: All

---

## Token Format

JWT tokens are valid for 24 hours by default.

Token structure:
- Header: Algorithm and type
- Payload: Subject (email) and expiration
- Signature: Signed with SECRET_KEY

---

## Testing Checklist

- [ ] Can signup new user
- [ ] Can login with credentials
- [ ] Can get current user info
- [ ] Can create salary slip (admin)
- [ ] Can update salary slip (admin)
- [ ] Can view all users (admin)
- [ ] Can view own salary slips
- [ ] Can submit expense
- [ ] Can view own expenses
- [ ] Can approve expense (admin)
- [ ] Can reject expense (admin)
- [ ] Invalid token returns 401
- [ ] Non-admin admin endpoints return 403
