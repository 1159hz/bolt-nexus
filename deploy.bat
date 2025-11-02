@echo off
echo Adding project to GitHub repository...
echo.

cd /d D:\Jairus\Work\test\code

echo Initializing git repository (if not already done)...
git init
echo.

echo Setting remote origin...
git remote remove origin 2>nul
git remote add origin https://github.com/1159hz/bolt-nexus.git
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