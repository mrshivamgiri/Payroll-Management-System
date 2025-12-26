from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from jose import JWTError, jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey, Float, Enum
from sqlalchemy.orm import sessionmaker, declarative_base, relationship
import enum
from starlette.middleware.cors import CORSMiddleware
import ipaddress

SECRET_KEY = "change_me_in_env"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

DATABASE_URL = "sqlite:///./app.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Role(str, enum.Enum):
    admin = "admin"
    employee = "employee"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(Role), nullable=False, default=Role.employee)
    created_at = Column(DateTime, default=datetime.utcnow)
    expenses = relationship("Expense", back_populates="user")
    salary_slips = relationship("SalarySlip", back_populates="user")

class Expense(Base):
    __tablename__ = "expenses"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(Float, nullable=False)
    description = Column(String, nullable=True)
    status = Column(String, default="submitted")
    created_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="expenses")

class SalarySlip(Base):
    __tablename__ = "salary_slips"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    month = Column(String, nullable=False)
    base_salary = Column(Float, nullable=False)
    bonus = Column(Float, default=0.0)
    deductions = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="salary_slips")

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Payroll Management System")

# Allowed IP networks
ALLOWED_NETWORKS = [
    ipaddress.ip_network('74.220.52.0/24'),
    ipaddress.ip_network('74.220.60.0/24'),
]

@app.middleware("http")
async def restrict_ip_middleware(request: Request, call_next):
    client_ip = request.client.host
    if client_ip and not any(ipaddress.ip_address(client_ip) in net for net in ALLOWED_NETWORKS):
        raise HTTPException(status_code=403, detail="Access denied: IP not allowed")
    response = await call_next(request)
    return response

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health():
    return {"status": "ok"}


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: Role

class UserOut(BaseModel):
    id: int
    email: EmailStr
    role: Role

    class Config:
        from_attributes = True

class ExpenseCreate(BaseModel):
    amount: float
    description: Optional[str] = None

class ExpenseOut(BaseModel):
    id: int
    amount: float
    description: Optional[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class SalarySlipCreate(BaseModel):
    user_id: int
    month: str
    base_salary: float
    bonus: float = 0.0
    deductions: float = 0.0

class SalarySlipUpdate(BaseModel):
    month: Optional[str] = None
    base_salary: Optional[float] = None
    bonus: Optional[float] = 0.0
    deductions: Optional[float] = 0.0

class SalarySlipOut(BaseModel):
    id: int
    user_id: int
    month: str
    base_salary: float
    bonus: float
    deductions: float
    created_at: datetime

    class Config:
        from_attributes = True


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_current_user(token: str = Depends(oauth2_scheme), db=Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

async def get_current_admin(user: User = Depends(get_current_user)):
    if user.role != Role.admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

@app.post("/auth/signup", response_model=UserOut)
def signup(payload: UserCreate, db=Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(email=payload.email, hashed_password=get_password_hash(payload.password), role=payload.role)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@app.post("/auth/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db=Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/auth/me", response_model=UserOut)
async def me(user: User = Depends(get_current_user)):
    return user

# Admin: Create and update salary slip
@app.post("/salary-slip", response_model=SalarySlipOut)
async def create_salary_slip(payload: SalarySlipCreate, admin: User = Depends(get_current_admin), db=Depends(get_db)):
    target_user = db.query(User).filter(User.id == payload.user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
    slip = SalarySlip(user_id=payload.user_id, month=payload.month, base_salary=payload.base_salary, bonus=payload.bonus, deductions=payload.deductions)
    db.add(slip)
    db.commit()
    db.refresh(slip)
    return slip

@app.put("/salary-slip/{id}", response_model=SalarySlipOut)
async def update_salary_slip(id: int, payload: SalarySlipUpdate, admin: User = Depends(get_current_admin), db=Depends(get_db)):
    slip = db.query(SalarySlip).filter(SalarySlip.id == id).first()
    if not slip:
        raise HTTPException(status_code=404, detail="Salary slip not found")
    if payload.month is not None:
        slip.month = payload.month
    if payload.base_salary is not None:
        slip.base_salary = payload.base_salary
    if payload.bonus is not None:
        slip.bonus = payload.bonus
    if payload.deductions is not None:
        slip.deductions = payload.deductions
    db.commit()
    db.refresh(slip)
    return slip

# Employee endpoints
@app.get("/salary-slip", response_model=List[SalarySlipOut])
async def list_salary_slip(user: User = Depends(get_current_user), db=Depends(get_db)):
    slips = db.query(SalarySlip).filter(SalarySlip.user_id == user.id).order_by(SalarySlip.created_at.desc()).all()
    return slips

@app.post("/expense", response_model=ExpenseOut)
async def create_expense(payload: ExpenseCreate, user: User = Depends(get_current_user), db=Depends(get_db)):
    expense = Expense(user_id=user.id, amount=payload.amount, description=payload.description)
    db.add(expense)
    db.commit()
    db.refresh(expense)
    return expense

@app.get("/expense", response_model=List[ExpenseOut])
async def list_expense(user: User = Depends(get_current_user), db=Depends(get_db)):
    expenses = db.query(Expense).filter(Expense.user_id == user.id).order_by(Expense.created_at.desc()).all()
    return expenses

# Admin: Get all salary slips
@app.get("/salary-slip-all", response_model=List[dict])
async def list_all_salary_slips(admin: User = Depends(get_current_admin), db=Depends(get_db)):
    slips = db.query(SalarySlip).order_by(SalarySlip.created_at.desc()).all()
    result = []
    for slip in slips:
        result.append({
            "id": slip.id,
            "user_id": slip.user_id,
            "user": {"id": slip.user.id, "email": slip.user.email, "role": slip.user.role},
            "month": slip.month,
            "base_salary": slip.base_salary,
            "bonus": slip.bonus,
            "deductions": slip.deductions,
            "created_at": slip.created_at
        })
    return result

# Admin: Get all users (employees)
@app.get("/users", response_model=List[UserOut])
async def list_users(admin: User = Depends(get_current_admin), db=Depends(get_db)):
    users = db.query(User).all()
    return users

# Admin: Get all expenses for approval
@app.get("/expenses-all", response_model=List[dict])
async def list_all_expenses(admin: User = Depends(get_current_admin), db=Depends(get_db)):
    expenses = db.query(Expense).order_by(Expense.created_at.desc()).all()
    result = []
    for expense in expenses:
        result.append({
            "id": expense.id,
            "user_id": expense.user_id,
            "user_email": expense.user.email,
            "amount": expense.amount,
            "description": expense.description,
            "status": expense.status,
            "created_at": expense.created_at
        })
    return result

# Admin: Update expense status
@app.put("/expense/{id}/status", response_model=dict)
async def update_expense_status(id: int, status: str, admin: User = Depends(get_current_admin), db=Depends(get_db)):
    if status not in ["submitted", "approved", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    expense = db.query(Expense).filter(Expense.id == id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    expense.status = status
    db.commit()
    db.refresh(expense)
    return {"message": f"Expense status updated to {status}"}

# Seed demo users at startup
@app.on_event("startup")
async def seed_demo():
    db = SessionLocal()
    try:
        if not db.query(User).filter(User.email == "hire-me@anshumat.org").first():
            demo = User(email="hire-me@anshumat.org", hashed_password=get_password_hash("HireMe@2025!"), role=Role.employee)
            db.add(demo)
        if not db.query(User).filter(User.email == "admin@company.com").first():
            admin = User(email="admin@company.com", hashed_password=get_password_hash("Admin@2025!"), role=Role.admin)
            db.add(admin)
        db.commit()
    finally:
        db.close()