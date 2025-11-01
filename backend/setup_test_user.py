"""
Setup script to create a test user in the database
Run this after setting up the database tables
"""

from supabase.client import create_client, Client
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing Supabase credentials. Check your .env file")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def setup_test_user():
    """Create a test user with default settings"""
    
    # Check if user already exists
    try:
        existing = supabase.table("users").select("*").eq("email", "test@energy.com").execute()
        if existing.data:
            print("✓ Test user already exists!")
            print(f"  User ID: {existing.data[0]['id']}")
            print(f"  Name: {existing.data[0]['name']}")
            print(f"  Email: {existing.data[0]['email']}")
            return existing.data[0]['id']
    except Exception as e:
        print(f"Error checking existing user: {e}")
    
    # Create new user
    try:
        print("Creating test user...")
        user_data = {
            "name": "Test User",
            "email": "test@energy.com",
            "city": "Mumbai",
            "electricity_rate": 8.0,  # ₹8 per kWh (Mumbai average)
            "daily_budget": 100.0  # ₹100 per day budget
        }
        
        response = supabase.table("users").insert(user_data).execute()
        user_id = response.data[0]['id']
        
        print("✓ Test user created successfully!")
        print(f"  User ID: {user_id}")
        print(f"  Name: {user_data['name']}")
        print(f"  Email: {user_data['email']}")
        print(f"  City: {user_data['city']}")
        print(f"  Electricity Rate: ₹{user_data['electricity_rate']}/kWh")
        print(f"  Daily Budget: ₹{user_data['daily_budget']}")
        
        return user_id
        
    except Exception as e:
        print(f"✗ Error creating user: {e}")
        return None

def add_sample_appliances(user_id):
    """Add some common appliances to the test user"""
    
    try:
        # Get available appliances
        appliances = supabase.table("appliances").select("*").execute()
        
        if not appliances.data:
            print("✗ No appliances found in database. Please run the SQL setup first.")
            return
        
        # Add common household appliances (AC, Refrigerator, TV, Fan)
        common_appliances = ["Air Conditioner", "Refrigerator", "LED TV", "Ceiling Fan", "LED Bulb"]
        added_count = 0
        
        for appliance in appliances.data:
            if any(common in appliance['name'] for common in common_appliances):
                try:
                    # Check if already added
                    existing = supabase.table("user_appliances").select("*").eq(
                        "user_id", user_id
                    ).eq("appliance_id", appliance['id']).execute()
                    
                    if existing.data:
                        continue
                    
                    # Add to user's appliances
                    supabase.table("user_appliances").insert({
                        "user_id": user_id,
                        "appliance_id": appliance['id'],
                        "actual_wattage": appliance['typical_wattage']
                    }).execute()
                    
                    print(f"  ✓ Added: {appliance['icon']} {appliance['name']}")
                    added_count += 1
                    
                except Exception as e:
                    print(f"  ✗ Failed to add {appliance['name']}: {e}")
        
        if added_count > 0:
            print(f"\n✓ Added {added_count} appliances to test user!")
        else:
            print("\n✓ User appliances already set up!")
            
    except Exception as e:
        print(f"✗ Error adding appliances: {e}")

def main():
    print("=" * 50)
    print("Energy Visualizer - Test User Setup")
    print("=" * 50)
    print()
    
    # Create test user
    user_id = setup_test_user()
    
    if user_id:
        print()
        # Add sample appliances
        print("Adding common appliances...")
        add_sample_appliances(user_id)
        
        print()
        print("=" * 50)
        print("Setup Complete!")
        print("=" * 50)
        print()
        print("Next steps:")
        print("1. Start the backend: python main.py")
        print("2. Start the frontend: cd ../frontend && npm run dev")
        print("3. Open http://localhost:3000 in your browser")
        print()
        print(f"Your test user ID is: {user_id}")
        print("(The app is configured to use user ID 1 by default)")
        print()

if __name__ == "__main__":
    main()
