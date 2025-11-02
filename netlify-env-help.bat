@echo off
echo ============================================
echo BOLT NEXUS - Netlify Environment Variables Setup
echo ============================================
echo.

echo This script will help you set up environment variables on Netlify
echo.

echo STEP 1: Go to your Netlify site settings
echo    - Log into Netlify
echo    - Click on your site
echo    - Click "Site configuration" or "Settings"
echo    - Look for "Environment" or "Build & deploy" section
echo.

echo STEP 2: Add environment variables
echo    - Look for "Environment variables" section
echo    - You might see:
echo      * "Add variable" button
echo      * "New variable" button  
echo      * "+ Add variable" link
echo      * Or just a form to add key/value pairs
echo.

echo STEP 3: Add this variable:
echo    - Key (name): NEXT_PUBLIC_API_URL
echo    - Value: http://localhost:5000/api (change after backend deployment)
echo.

echo STEP 4: Save changes
echo    - Click "Save" or "Save changes"
echo    - You might need to redeploy your site
echo.

echo When you deploy your backend to Railway:
echo    - Change the value to your Railway URL + /api
echo    - Example: https://your-app.railway.app/api
echo.

pause
