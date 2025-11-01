@echo off
echo ============================================
echo BOLT NEXUS - GitHub Setup
echo ============================================
echo.

echo Step 1: Installing Git (if not installed)
echo.
echo Checking if Git is installed...
git --version 2>nul
if %errorlevel% neq 0 (
    echo Git is NOT installed!
    echo.
    echo Please install Git from: https://git-scm.com/download/win
    echo.
    echo After installing, run this script again.
    pause
    exit /b
) else (
    echo Git is installed!
)

echo.
echo Step 2: Configuring Git (first time only)
echo.
set /p USERNAME="Enter your name (e.g., John Doe): "
set /p EMAIL="Enter your email (same as GitHub): "

git config --global user.name "%USERNAME%"
git config --global user.email "%EMAIL%"

echo.
echo Git configured successfully!
echo.

echo Step 3: Initializing Git repository
echo.
if exist .git (
    echo Repository already initialized!
) else (
    git init
    echo Repository initialized!
)

echo.
echo Step 4: Adding files to Git
echo.
git add .
echo All files added!

echo.
echo Step 5: Creating first commit
echo.
git commit -m "Initial commit - Bolt Nexus Smart Appliance Platform"
echo First commit created!

echo.
echo ============================================
echo SETUP COMPLETE!
echo ============================================
echo.
echo Next steps:
echo 1. Go to https://github.com
echo 2. Click the + icon (top right) > New repository
echo 3. Name it: bolt-nexus
echo 4. Do NOT initialize with README
echo 5. Click "Create repository"
echo 6. Copy the repository URL
echo 7. Run: push-to-github.bat
echo.
echo ============================================
pause
