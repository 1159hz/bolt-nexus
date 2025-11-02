@echo off
echo ============================================
echo BOLT NEXUS - Connect to GitHub
echo ============================================
echo.
echo This script will:
echo 1. Set up Git (if not already done)
echo 2. Create a commit with all your files
echo 3. Guide you through creating a GitHub repository
echo 4. Push your code to GitHub
echo.

echo Press any key to continue...
pause >nul
echo.

echo Step 1: Setting up Git...
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
echo Configuring Git...
set /p USERNAME="Enter your name (e.g., John Doe): "
set /p EMAIL="Enter your email (same as GitHub): "

git config --global user.name "%USERNAME%"
git config --global user.email "%EMAIL%"
echo Git configured successfully!

echo.
echo Initializing repository...
if not exist .git (
    git init
)
echo Repository initialized!

echo.
echo Adding files...
git add .
echo Files added!

echo.
echo Creating commit...
git commit -m "Initial commit - Bolt Nexus Smart Appliance Platform"
echo Commit created!

echo.
echo ============================================
echo Step 2: Create GitHub Repository
echo ============================================
echo.
echo Please follow these steps:
echo.
echo 1. Go to https://github.com and log in
echo 2. Click the + icon (top right) ^> New repository
echo 3. Repository name: bolt-nexus
echo 4. Description: Smart Appliance Health Platform
echo 5. Keep it PUBLIC (or choose Private)
echo 6. DO NOT initialize with README
echo 7. DO NOT choose a license
echo 8. Click "Create repository"
echo.
echo After creating the repository, copy the URL and continue.
echo.
pause

echo.
echo ============================================
echo Step 3: Push to GitHub
echo ============================================
echo.
set /p REPO_URL="Paste your GitHub repository URL: "

echo.
echo Validating repository URL...
echo %REPO_URL% | findstr /C:"github.com" >nul
if %errorlevel% neq 0 (
    echo.
    echo ERROR: This doesn't look like a valid GitHub URL
    echo Please make sure it contains "github.com"
    echo.
    pause
    exit /b
)

echo.
echo Adding remote repository...
git remote add origin %REPO_URL% 2>nul
if %errorlevel% neq 0 (
    echo Remote already exists, updating...
    git remote set-url origin %REPO_URL%
)

echo.
echo Setting main branch...
git branch -M main

echo.
echo Pushing to GitHub...
echo This may take a few minutes...
git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Push failed. Please check the error message above.
    pause
    exit /b
)

echo.
echo ============================================
echo SUCCESS! Your code is now on GitHub!
echo ============================================
echo.
echo Repository URL: %REPO_URL%
echo.
echo Next steps:
echo 1. Deploy to Netlify (see DEPLOY.txt)
echo 2. For future updates, use update-github.bat
echo.
pause