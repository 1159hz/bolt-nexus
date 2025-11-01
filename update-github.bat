@echo off
echo ============================================
echo BOLT NEXUS - Update GitHub
echo ============================================
echo.

echo Checking for changes...
git status

echo.
echo Adding all changes...
git add .

echo.
set /p COMMIT_MSG="Enter commit message (what did you change?): "

echo.
echo Creating commit...
git commit -m "%COMMIT_MSG%"

echo.
echo Pushing to GitHub...
git push

echo.
echo ============================================
echo SUCCESS! GitHub updated!
echo ============================================
echo.
pause
