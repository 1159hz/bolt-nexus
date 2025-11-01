@echo off
echo ============================================
echo Bolt Nexus - Complete Startup
echo ============================================
echo.
echo Step 1: Starting Backend (Flask)...
echo.
start "Bolt Nexus Backend" cmd /k "cd backend && python main.py"
timeout /t 5 /nobreak >nul
echo.
echo Step 2: Starting Frontend (Next.js)...
echo.
start "Bolt Nexus Frontend" cmd /k "cd frontend && npm run dev"
echo.
echo ============================================
echo Both servers are starting!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3001
echo ============================================
echo.
echo Press any key to exit this window...
pause >nul
