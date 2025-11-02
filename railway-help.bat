@echo off
echo ============================================
echo BOLT NEXUS - Railway Deployment Helper
echo ============================================
echo.

echo You're at the right place! Railway will host your Flask backend.
echo.

echo STEP 1: Connect GitHub Repository
echo    - On Railway dashboard, look for:
echo      * "New Project" or "+" button
echo      * "Deploy from GitHub repo" 
echo      * "Connect repo" or "Link repository"
echo.

echo STEP 2: Select Your Repository
echo    - Find and select: bolt-nexus
echo    - Make sure it's the correct one with your code
echo.

echo STEP 3: Configure Project Settings
echo    - Root directory: backend
echo    - Build command: pip install -r requirements.txt
echo    - Start command: python main.py
echo.

echo STEP 4: Add Environment Variables
echo    You MUST add these variables:
echo.
echo    SUPABASE_URL=https://fgbcjlklkochkjpwaupr.supabase.co
echo    SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnYmNqbGtsa29jaGtqcHdhdXByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMDkzNTQsImV4cCI6MjA3NzU4NTM1NH0.CXuzIDdZbiVSneXEqO17PEmnobiU5t_PyK68oIu1i44
echo    RAZORPAY_KEY_ID=rzp_test_dummy
echo    RAZORPAY_KEY_SECRET=dummy_secret
echo.

echo STEP 5: Deploy
echo    - Click "Deploy" or "Create Project"
echo    - Wait 2-5 minutes for deployment to complete
echo    - Copy the deployed URL when finished
echo.

echo STEP 6: Update Netlify Environment Variable
echo    - Go to your Netlify site settings
echo    - Find "Environment variables"
echo    - Change NEXT_PUBLIC_API_URL to:
echo      [YOUR_RAILWAY_URL]/api
echo      (Example: https://bolt-nexus-production.up.railway.app/api)
echo.

pause
