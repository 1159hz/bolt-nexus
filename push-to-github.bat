@echo off
echo ============================================
echo BOLT NEXUS - Push to GitHub
echo ============================================
echo.

echo Enter your GitHub repository URL
echo Example: https://github.com/yourusername/bolt-nexus.git
echo.
echo You can find this URL by:
echo 1. Going to your GitHub repository page
echo 2. Clicking the green "Code" button
echo 3. Copying the HTTPS URL
echo.
set /p REPO_URL="Repository URL: "

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
echo This may take a few minutes depending on your internet connection...
git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Push failed. This might be because:
    echo 1. The repository URL is incorrect
    echo 2. You don't have permission to push to this repository
    echo 3. Your internet connection is unstable
    echo.
    echo Please check the error message above and try again.
    pause
    exit /b
)

echo.
echo ============================================
echo SUCCESS! Your code is now on GitHub!
echo ============================================
echo.
echo You can view it at:
echo %REPO_URL%
echo.
echo Next steps:
echo 1. Deploy to Netlify (see DEPLOY.txt)
echo 2. For future updates, use update-github.bat
echo.
pause