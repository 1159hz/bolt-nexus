"""
Test Supabase Connection
Run this to verify your database is accessible
"""

from dotenv import load_dotenv
import os
from supabase.client import create_client

# Load environment variables
load_dotenv()

print("\n" + "="*60)
print("SUPABASE CONNECTION TEST")
print("="*60)

# Get credentials
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

print(f"\n1. Checking environment variables...")
print(f"   SUPABASE_URL: {SUPABASE_URL[:30]}..." if SUPABASE_URL else "   ❌ SUPABASE_URL not found")
print(f"   SUPABASE_KEY: {SUPABASE_KEY[:20]}..." if SUPABASE_KEY else "   ❌ SUPABASE_KEY not found")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("\n❌ ERROR: Missing Supabase credentials in .env file")
    print("   Please check backend/.env file")
    exit(1)

print("\n2. Initializing Supabase client...")
try:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("   ✓ Client initialized")
except Exception as e:
    print(f"   ❌ Failed to initialize: {e}")
    exit(1)

print("\n3. Testing database connection...")
try:
    response = supabase.table("users").select("*").limit(1).execute()
    print(f"   ✓ Connection successful!")
    print(f"   ✓ Found {len(response.data)} users in database")
except Exception as e:
    print(f"   ❌ Connection failed: {e}")
    print("\n   Possible issues:")
    print("   - Tables not created (run setup.sql in Supabase)")
    print("   - Wrong credentials in .env file")
    print("   - RLS policies blocking access")
    exit(1)

print("\n4. Testing table structure...")
tables_to_check = ["users", "appliances", "diagnostics", "bookings", "technicians"]
for table in tables_to_check:
    try:
        response = supabase.table(table).select("*").limit(1).execute()
        print(f"   ✓ Table '{table}' is accessible")
    except Exception as e:
        print(f"   ❌ Table '{table}' ERROR: {e}")

print("\n5. Testing INSERT operation...")
try:
    test_user = {
        'name': 'Test User',
        'phone': '+919999999999',
        'email': f'test_{os.urandom(4).hex()}@test.com',
        'city': 'Mumbai'
    }
    
    response = supabase.table("users").insert(test_user).execute()
    
    if response.data:
        user_id = response.data[0]['id']
        print(f"   ✓ INSERT successful! Created user ID: {user_id}")
        
        # Clean up test data
        supabase.table("users").delete().eq('id', user_id).execute()
        print(f"   ✓ Test data cleaned up")
    else:
        print(f"   ❌ INSERT failed - no data returned")
        
except Exception as e:
    print(f"   ❌ INSERT failed: {e}")
    print("\n   This is likely the issue preventing registration!")

print("\n" + "="*60)
print("TEST COMPLETE")
print("="*60 + "\n")
