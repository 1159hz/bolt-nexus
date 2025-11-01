@echo off
echo ============================================
echo BOLT NEXUS - Push to GitHub
echo ============================================
echo.

echo Enter your GitHub repository URL
echo Example: https://github.com/yourusername/bolt-nexus.git
echo.
set /p REPO_URL="Repository URL: "

echo.
echo Adding remote repository...
git remote add origin %REPO_URL% 2>nul
if %errorlevel% neq 0 (
    echo Remote already exists, updating...
    git remote set-url origin %REPO_URL%
)

echo.
echo Pushing to GitHub...
git branch -M main
git push -u origin main

echo.
echo ============================================
echo SUCCESS! Your code is now on GitHub!
echo ============================================
echo.
echo You can view it at:
echo %REPO_URL%
echo.
echo Next: Deploy to Netlify (see DEPLOY.txt)
echo.
pause
