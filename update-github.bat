@echo off
echo ============================================
echo BOLT NEXUS - Update GitHub
echo ============================================
echo.

echo Checking for changes...
git status --short
echo.

echo Adding all changes...
git add .

echo.
echo Checking what will be committed...
git status --short
echo.

set /p COMMIT_MSG="Enter commit message (describe what you changed): "

if "%COMMIT_MSG%"=="" (
    echo.
    echo ERROR: Commit message cannot be empty!
    echo Please run this script again and enter a meaningful commit message.
    pause
    exit /b
)

echo.
echo Creating commit...
git commit -m "%COMMIT_MSG%"

if %errorlevel% neq 0 (
    echo.
    echo No changes to commit or commit failed.
    echo This might be because:
    echo 1. No files have been changed
    echo 2. All changes have already been committed
    echo.
    pause
    exit /b
)

echo.
echo Pushing to GitHub...
git push

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Push failed. This might be because:
    echo 1. You're not connected to the internet
    echo 2. You don't have permission to push to this repository
    echo 3. There are conflicts with the remote repository
    echo.
    echo Please check the error message above and try again.
    pause
    exit /b
)

echo.
echo ============================================
echo SUCCESS! GitHub updated!
echo ============================================
echo.
echo Your changes have been pushed to GitHub.
echo.
pause