@echo off
echo Adding project to GitHub repository...
echo.

cd /d D:\Jairus\Work\test\code

echo Checking current branch...
git branch
echo.

echo Adding all files...
git add .
echo.

echo Committing changes...
git commit -m "Initial commit: Adding all project files"
echo.

echo Pushing to GitHub...
git push -u origin master
echo.

echo Deployment complete!
pause