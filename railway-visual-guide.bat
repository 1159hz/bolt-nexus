@echo off
cls
echo =================================================================================
echo                           RAILWAY DEPLOYMENT - STEP BY STEP
echo =================================================================================
echo.
echo You're at the RIGHT PLACE! Railway is where your Flask backend will live.
echo.
echo CURRENT STEP: Configure your Railway service
echo.

echo 1. RAILWAY DASHBOARD LAYOUT:
echo    ┌─────────────────────────────────────────────────────────────────────────┐
echo    │  [New Project]    [Templates]    [Documentation]    [Profile]          │
echo    │                                                                         │
echo    │  ┌─────────────────────────────────────────────────────────────────────┐ │
echo    │  │ DEPLOY FROM GITHUB REPO                                             │ │
echo    │  │                                                                     │ │
echo    │  │  [Connect Repo]  or  [Select Repository]                            │ │
echo    │  └─────────────────────────────────────────────────────────────────────┘ │
echo    └─────────────────────────────────────────────────────────────────────────┘
echo.

echo 2. SELECT YOUR REPOSITORY:
echo    - Look for: bolt-nexus
echo    - Click on it
echo.

echo 3. SERVICE CONFIGURATION (IMPORTANT!):
echo    ┌─────────────────────────────────────────────────────────────────────────┐
echo    │ SERVICE NAME:     bolt-nexus-backend                                    │
echo    │ ROOT DIRECTORY:   backend                                               │
echo    │ BUILD COMMAND:    pip install -r requirements.txt                       │
echo    │ START COMMAND:    python main.py                                        │
echo    └─────────────────────────────────────────────────────────────────────────┘
echo.

echo 4. ENVIRONMENT VARIABLES (COPY EXACTLY):
echo    ┌─────────────────────────────────────────────────────────────────────────┐
echo    │ SUPABASE_URL         https://fgbcjlklkochkjpwaupr.supabase.co          │
echo    │ SUPABASE_KEY         eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3Mi...  │
echo    │ RAZORPAY_KEY_ID      rzp_test_dummy                                     │
echo    │ RAZORPAY_KEY_SECRET  dummy_secret                                       │
echo    └─────────────────────────────────────────────────────────────────────────┘
echo.

echo 5. DEPLOY BUTTONS YOU MIGHT SEE:
echo    - [Deploy]           - [Create Service]     - [Deploy Project]
echo    - [Build and Deploy] - [Launch]            - [Create Project]  
echo.

echo 6. AFTER DEPLOYMENT:
echo    - Wait for green checkmarks
echo    - Look for your URL: https://[something].up.railway.app
echo    - Copy this URL for Netlify!
echo.

echo PRESS ANY KEY TO CONTINUE TO NETLIFY SETUP...
pause >nul

cls
echo =================================================================================
echo                           NEXT: UPDATE NETLIFY
echo =================================================================================
echo.
echo 1. Go back to Netlify dashboard
echo 2. Click on your site
echo 3. Go to Site settings → Build & deploy → Environment
echo 4. Find NEXT_PUBLIC_API_URL variable
echo 5. Change value to: [YOUR_RAILWAY_URL]/api
echo    Example: https://bolt-nexus-production.up.railway.app/api
echo 6. Save changes
echo 7. Click "Trigger deploy" or "Deploy site"
echo.
echo Your site will now connect to your live backend!
echo.
pause
