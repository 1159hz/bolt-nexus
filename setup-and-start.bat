@echo off
echo ============================================
echo Bolt Nexus - Complete Setup and Start
echo ============================================
echo.

echo Step 1: Installing Backend Dependencies...
cd backend
pip install -r requirements.txt
cd ..
echo.

echo Step 2: Installing Frontend Dependencies...
cd frontend
call npm install
cd ..
echo.

echo ============================================
echo Setup Complete! Starting servers...
echo ============================================
echo.

echo Starting Backend (Flask)...
start "Bolt Nexus Backend" cmd /k "cd backend && python main.py"
timeout /t 5 /nobreak >nul

echo.
echo Starting Frontend (Next.js)...
start "Bolt Nexus Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ============================================
echo SERVERS ARE RUNNING!
echo ============================================
echo Backend API: http://localhost:5000
echo Frontend App: http://localhost:3001
echo ============================================
echo.
echo Press any key to close this window...
pause >nul
