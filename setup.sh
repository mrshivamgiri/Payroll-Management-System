#!/bin/bash

echo "========================================"
echo "Payroll Management System - Setup"
echo "========================================"
echo ""

echo "Installing Backend Dependencies..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
echo "Backend setup complete!"
echo ""

cd ..
echo "Installing Frontend Dependencies..."
cd frontend
npm install
echo "Frontend setup complete!"
echo ""

echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "To run the application:"
echo ""
echo "1. Start Backend (in backend folder):"
echo "   source venv/bin/activate"
echo "   uvicorn main:app --reload"
echo ""
echo "2. Start Frontend (in frontend folder):"
echo "   npm run dev"
echo ""
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:5173"
