@echo off
echo Adding project to GitHub repository...
echo.

cd /d D:\Jairus\Work\test\code

echo Initializing git repository (if not already done)...
git init
echo.

echo Adding remote origin (if not already done)...
git remote add origin https://github.com/1159hz/bolt-nexuses.git
echo.

echo Adding all files...
git add .
echo.

echo Committing changes...
git commit -m "Initial commit: Adding all project files"
echo.

echo Pushing to GitHub...
git push -u origin main
echo.

echo Deployment complete!
pause