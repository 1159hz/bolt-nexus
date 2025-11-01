"""
Flask Backend for Bolt Nexus - Smart Appliance Health Platform

Handles diagnostics, booking, payments (Razorpay), and technician management.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase.client import create_client, Client
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta
from decimal import Decimal
import hashlib
import hmac
import json

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Initialize Supabase client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "rzp_test_dummy")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "dummy_secret")

print("\n" + "="*50)
print("Bolt Nexus Backend Initialization")
print("="*50)
print(f"SUPABASE_URL: {SUPABASE_URL[:30]}..." if SUPABASE_URL else "SUPABASE_URL: NOT SET")
print(f"SUPABASE_KEY: {SUPABASE_KEY[:20]}..." if SUPABASE_KEY else "SUPABASE_KEY: NOT SET")
print("="*50 + "\n")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing Supabase credentials. Check your .env file")

try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("✓ Supabase client initialized successfully")
    
    # Test connection
    test_response = supabase.table("users").select("id").limit(1).execute()
    print(f"✓ Database connection test successful")
    print("\n" + "="*50 + "\n")
except Exception as e:
    print(f"✗ Failed to initialize Supabase: {str(e)}")
    raise

# Pricing configuration (in INR)
PRICING = {
    'AC': {'one_time': 799, 'amc': 999},
    'Fridge': {'one_time': 699, 'amc': 799},
    'Washing Machine': {'one_time': 649, 'amc': 749}
}

# Diagnostic calculation formulas
def calculate_health_score(appliance_type, months_since_service, usage_hours, year_of_purchase):
    """
    Calculate appliance health score (0-100)
    Lower score = needs service urgently
    """
    current_year = datetime.now().year
    age = current_year - year_of_purchase if year_of_purchase else 5
    
    # Base score starts at 100
    score = 100
    
    # Deduct points for months since last service
    if months_since_service:
        score -= min(months_since_service * 3, 40)  # Max 40 points
    
    # Deduct points for age
    score -= min(age * 2, 20)  # Max 20 points
    
    # Deduct points for high usage
    if usage_hours:
        if usage_hours > 12:
            score -= 20
        elif usage_hours > 8:
            score -= 10
    
    # Appliance-specific adjustments
    if appliance_type == 'AC':
        if months_since_service and months_since_service > 12:
            score -= 15  # ACs need yearly service
    elif appliance_type == 'Fridge':
        if months_since_service and months_since_service > 18:
            score -= 10
    
    return max(0, min(100, int(score)))

def calculate_energy_loss(appliance_type, health_score, usage_hours):
    """
    Estimate monthly energy loss in INR due to inefficiency
    Based on health score and usage patterns
    """
    # Base inefficiency rates (INR per month)
    base_rates = {
        'AC': 1500,
        'Fridge': 400,
        'Washing Machine': 300
    }
    
    base = base_rates.get(appliance_type, 500)
    
    # Inefficiency factor based on health score
    # Lower health = higher inefficiency
    inefficiency_factor = (100 - health_score) / 100
    
    # Usage multiplier
    usage_multiplier = (usage_hours or 8) / 8  # Normalize to 8 hours
    
    energy_loss = base * inefficiency_factor * usage_multiplier
    
    return round(energy_loss, 2)

def generate_recommendations(appliance_type, health_score, months_since_service):
    """
    Generate personalized recommendations
    """
    recommendations = []
    
    if health_score < 40:
        recommendations.append(f"🚨 Urgent: Your {appliance_type} needs immediate servicing to avoid breakdown.")
        recommendations.append(f"Schedule a technician visit within 3 days.")
    elif health_score < 60:
        recommendations.append(f"⚠️ Your {appliance_type} is running inefficiently.")
        recommendations.append(f"Book a service within 2 weeks to restore performance.")
    else:
        recommendations.append(f"✅ Your {appliance_type} is in good condition.")
        
    if appliance_type == 'AC':
        recommendations.append("💡 Tip: Clean filters monthly and service annually for optimal cooling.")
    elif appliance_type == 'Fridge':
        recommendations.append("💡 Tip: Defrost regularly and check door seals to save energy.")
    elif appliance_type == 'Washing Machine':
        recommendations.append("💡 Tip: Clean drum filter monthly to prevent clogging.")
    
    if months_since_service and months_since_service > 12:
        recommendations.append("Consider our Annual Maintenance Contract (AMC) for worry-free upkeep.")
    
    return recommendations

# API Endpoints

@app.route('/')
def root():
    return jsonify({"message": "Bolt Nexus API is running! ⚡"})

# Registration endpoint with probability calculation
@app.route('/api/register', methods=['POST'])
def register_appliance():
    """Register appliance with probability-based maintenance analysis"""
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    try:
        print(f"\n=== Registration Request ===")
        print(f"Data received: {data}")
        
        # Extract data
        name = data.get('name')
        phone = data.get('phone')
        email = data.get('email')
        city = data.get('city')
        appliance_type = data.get('appliance_type')
        brand_model = data.get('brand_model')
        appliance_age_years = data.get('appliance_age_years', 2)
        usage_hours = data.get('usage_hours_per_day')
        months_since_service = data.get('months_since_service')
        current_bill = data.get('current_bill', 3000)
        maintenance_probability = data.get('maintenance_probability', 0)
        estimated_savings = data.get('estimated_savings', 0)
        
        # Calculate year of purchase from age
        current_year = datetime.now().year
        year_of_purchase = current_year - appliance_age_years
        
        print(f"Creating/finding user for email: {email}")
        
        # Create or get user
        user_response = supabase.table("users").select("*").eq("email", email).execute()
        
        if user_response.data:
            user = user_response.data[0]
            print(f"Found existing user: {user['id']}")
        else:
            user_data = {
                'name': name,
                'phone': phone,
                'email': email,
                'city': city
            }
            print(f"Creating new user: {user_data}")
            user_response = supabase.table("users").insert(user_data).execute()
            
            if not user_response.data:
                print(f"ERROR: Failed to create user. Response: {user_response}")
                return jsonify({"error": "Failed to create user in database"}), 500
                
            user = user_response.data[0]
            print(f"Created new user: {user['id']}")
        
        # Calculate health metrics
        health_score = calculate_health_score(
            appliance_type, 
            months_since_service, 
            usage_hours, 
            year_of_purchase
        )
        
        energy_loss = calculate_energy_loss(
            appliance_type, 
            health_score, 
            usage_hours
        )
        
        recommendations = generate_recommendations(
            appliance_type, 
            health_score, 
            months_since_service
        )
        
        # Create appliance record
        appliance_data = {
            'user_id': user['id'],
            'appliance_type': appliance_type,
            'brand_model': brand_model,
            'year_of_purchase': year_of_purchase,
            'usage_hours_per_day': usage_hours,
            'months_since_service': months_since_service,
            'health_score': health_score,
            'energy_loss_per_month': energy_loss,
            'status': 'active'
        }
        
        print(f"Creating appliance: {appliance_data}")
        appliance_response = supabase.table("appliances").insert(appliance_data).execute()
        
        if not appliance_response.data:
            print(f"ERROR: Failed to create appliance. Response: {appliance_response}")
            return jsonify({"error": "Failed to create appliance in database"}), 500
            
        appliance = appliance_response.data[0]
        print(f"Created appliance: {appliance['id']}")
        
        # Return response with probability and savings
        response_data = {
            'user_id': user['id'],
            'appliance_id': appliance['id'],
            'health_score': health_score,
            'maintenance_probability': maintenance_probability,
            'energy_loss_per_month': energy_loss,
            'estimated_savings': estimated_savings,
            'current_bill': current_bill,
            'recommendations': recommendations,
            'pricing': PRICING.get(appliance_type, PRICING['AC']),
            'message': 'Registration successful! Your appliance has been analyzed.'
        }
        
        print(f"Registration successful for user {user['id']}")
        print(f"=== End Registration ===")
        return jsonify(response_data), 200
        
    except Exception as e:
        print(f"\n!!! REGISTRATION ERROR !!!")
        print(f"Error type: {type(e).__name__}")
        print(f"Error message: {str(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        return jsonify({"error": f"Registration failed: {str(e)}"}), 500

# Diagnostic endpoints
@app.route('/api/diagnostic', methods=['POST'])
def run_diagnostic():
    """Run free diagnostic for an appliance"""
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    try:
        # Extract data
        name = data.get('name')
        phone = data.get('phone')
        email = data.get('email')
        city = data.get('city')
        appliance_type = data.get('appliance_type')
        brand_model = data.get('brand_model')
        year_of_purchase = data.get('year_of_purchase')
        usage_hours = data.get('usage_hours_per_day')
        months_since_service = data.get('months_since_service')
        
        # Create or get user
        user_response = supabase.table("users").select("*").eq("email", email).execute()
        
        if user_response.data:
            user = user_response.data[0]
        else:
            user_data = {
                'name': name,
                'phone': phone,
                'email': email,
                'city': city
            }
            user_response = supabase.table("users").insert(user_data).execute()
            user = user_response.data[0]
        
        # Calculate health metrics
        health_score = calculate_health_score(
            appliance_type, 
            months_since_service, 
            usage_hours, 
            year_of_purchase
        )
        
        energy_loss = calculate_energy_loss(
            appliance_type, 
            health_score, 
            usage_hours
        )
        
        estimated_savings = energy_loss * 0.7  # Potential 70% reduction
        
        recommendations = generate_recommendations(
            appliance_type, 
            health_score, 
            months_since_service
        )
        
        # Create appliance record
        appliance_data = {
            'user_id': user['id'],
            'appliance_type': appliance_type,
            'brand_model': brand_model,
            'year_of_purchase': year_of_purchase,
            'usage_hours_per_day': usage_hours,
            'months_since_service': months_since_service,
            'health_score': health_score,
            'energy_loss_per_month': energy_loss,
            'status': 'needs_service' if health_score < 60 else 'active'
        }
        appliance_response = supabase.table("appliances").insert(appliance_data).execute()
        appliance = appliance_response.data[0]
        
        # Store diagnostic report
        diagnostic_data = {
            'user_id': user['id'],
            'appliance_id': appliance['id'],
            'health_score': health_score,
            'energy_loss_per_month': energy_loss,
            'estimated_savings': estimated_savings,
            'recommendations': '\n'.join(recommendations)
        }
        diagnostic_response = supabase.table("diagnostics").insert(diagnostic_data).execute()
        diagnostic = diagnostic_response.data[0]
        
        return jsonify({
            'user_id': user['id'],
            'appliance_id': appliance['id'],
            'diagnostic_id': diagnostic['id'],
            'health_score': health_score,
            'energy_loss_per_month': energy_loss,
            'estimated_savings': round(estimated_savings, 2),
            'recommendations': recommendations,
            'pricing': PRICING.get(appliance_type, PRICING['AC'])
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# User endpoints
@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    try:
        response = supabase.table("users").select("*").eq("id", user_id).execute()
        if not response.data:
            return jsonify({"error": "User not found"}), 404
        return jsonify(response.data[0])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Appliance endpoints
@app.route('/api/appliances/<int:user_id>', methods=['GET'])
def get_user_appliances(user_id):
    """Get all appliances for a user"""
    try:
        response = supabase.table("appliances").select("*").eq("user_id", user_id).order(
            "created_at", desc=True
        ).execute()
        return jsonify(response.data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Dashboard endpoint
@app.route('/api/dashboard/<int:user_id>', methods=['GET'])
def get_dashboard(user_id):
    """Get dashboard data for user"""
    try:
        # Get user appliances with diagnostics
        appliances = supabase.table("appliances").select("*").eq("user_id", user_id).execute()
        
        # Get recent bookings
        bookings = supabase.table("bookings").select(
            "*, appliances(appliance_type)"
        ).eq("user_id", user_id).order("created_at", desc=True).limit(5).execute()
        
        # Calculate total potential savings
        total_savings = sum(float(a.get('energy_loss_per_month', 0)) * 0.7 for a in appliances.data)
        
        # Count appliances by status
        needs_service = sum(1 for a in appliances.data if a.get('health_score', 100) < 60)
        
        return jsonify({
            'appliances': appliances.data,
            'bookings': bookings.data,
            'total_potential_savings': round(total_savings, 2),
            'appliances_needing_service': needs_service
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Booking endpoints
@app.route('/api/bookings', methods=['POST'])
def create_booking():
    """Create a service booking"""
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    try:
        user_id = data.get('user_id')
        appliance_id = data.get('appliance_id')
        service_type = data.get('service_type')  # 'one_time' or 'amc'
        scheduled_date = data.get('scheduled_date')
        
        # Get appliance details
        appliance = supabase.table("appliances").select("*").eq("id", appliance_id).execute()
        if not appliance.data:
            return jsonify({"error": "Appliance not found"}), 404
        
        appliance_type = appliance.data[0]['appliance_type']
        
        # Calculate service amount
        service_amount = PRICING.get(appliance_type, {}).get(service_type, 799)
        
        # Find available technician
        technician = supabase.table("technicians").select("*").eq(
            "status", "available"
        ).limit(1).execute()
        
        technician_id = technician.data[0]['id'] if technician.data else None
        
        # Create booking
        booking_data = {
            'user_id': user_id,
            'appliance_id': appliance_id,
            'technician_id': technician_id,
            'service_type': service_type,
            'appliance_type': appliance_type,
            'scheduled_date': scheduled_date,
            'status': 'pending',
            'payment_status': 'pending',
            'service_amount': service_amount
        }
        
        response = supabase.table("bookings").insert(booking_data).execute()
        booking = response.data[0]
        
        return jsonify({
            'booking': booking,
            'payment_required': True,
            'amount': service_amount
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/bookings/<int:user_id>', methods=['GET'])
def get_user_bookings(user_id):
    """Get all bookings for a user"""
    try:
        response = supabase.table("bookings").select(
            "*, appliances(appliance_type, brand_model), technicians(name, phone)"
        ).eq("user_id", user_id).order("created_at", desc=True).execute()
        return jsonify(response.data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Payment endpoints
@app.route('/api/payments/create-order', methods=['POST'])
def create_payment_order():
    """Create Razorpay order"""
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    try:
        booking_id = data.get('booking_id')
        amount = data.get('amount')  # in INR
        
        # In production, you'd use Razorpay SDK here
        # For MVP, we'll simulate order creation
        order_id = f"order_{booking_id}_{datetime.now().timestamp()}"
        
        # Create payment record
        payment_data = {
            'booking_id': booking_id,
            'user_id': data.get('user_id'),
            'razorpay_order_id': order_id,
            'amount': amount,
            'currency': 'INR',
            'status': 'pending'
        }
        
        response = supabase.table("payments").insert(payment_data).execute()
        
        return jsonify({
            'order_id': order_id,
            'amount': amount,
            'currency': 'INR',
            'key': RAZORPAY_KEY_ID,
            'payment_id': response.data[0]['id']
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/payments/verify', methods=['POST'])
def verify_payment():
    """Verify Razorpay payment signature"""
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    try:
        payment_id = data.get('payment_id')
        order_id = data.get('razorpay_order_id')
        signature = data.get('razorpay_signature')
        razorpay_payment_id = data.get('razorpay_payment_id')
        booking_id = data.get('booking_id')
        
        # In production, verify signature with Razorpay
        # For MVP, we'll simulate successful payment
        
        # Update payment record
        supabase.table("payments").update({
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': signature,
            'status': 'success',
            'updated_at': datetime.now().isoformat()
        }).eq('id', payment_id).execute()
        
        # Update booking status
        supabase.table("bookings").update({
            'payment_status': 'paid',
            'status': 'confirmed',
            'updated_at': datetime.now().isoformat()
        }).eq('id', booking_id).execute()
        
        # Update appliance status
        booking = supabase.table("bookings").select("appliance_id").eq("id", booking_id).execute()
        if booking.data:
            supabase.table("appliances").update({
                'status': 'service_scheduled'
            }).eq('id', booking.data[0]['appliance_id']).execute()
        
        return jsonify({
            'success': True,
            'message': 'Payment verified and booking confirmed!'
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Technician dashboard
@app.route('/api/technician/<int:technician_id>/jobs', methods=['GET'])
def get_technician_jobs(technician_id):
    """Get all jobs for a technician"""
    try:
        status_filter = request.args.get('status', 'all')
        
        query = supabase.table("bookings").select(
            "*, users(name, phone, email, city), appliances(appliance_type, brand_model)"
        ).eq("technician_id", technician_id)
        
        if status_filter != 'all':
            query = query.eq("status", status_filter)
        
        response = query.order("scheduled_date", desc=False).execute()
        
        return jsonify(response.data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/technician/jobs/<int:job_id>/complete', methods=['POST'])
def complete_job(job_id):
    """Mark job as completed and add service notes"""
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    try:
        # Update booking status
        supabase.table("bookings").update({
            'status': 'completed',
            'updated_at': datetime.now().isoformat()
        }).eq('id', job_id).execute()
        
        # Add service notes
        notes_data = {
            'booking_id': job_id,
            'technician_id': data.get('technician_id'),
            'notes': data.get('notes'),
            'parts_replaced': data.get('parts_replaced'),
            'verified_savings': data.get('verified_savings')
        }
        
        supabase.table("service_notes").insert(notes_data).execute()
        
        # Update appliance status and health score
        booking = supabase.table("bookings").select("appliance_id").eq("id", job_id).execute()
        if booking.data:
            supabase.table("appliances").update({
                'status': 'serviced',
                'health_score': 95,  # Post-service health
                'months_since_service': 0,
                'updated_at': datetime.now().isoformat()
            }).eq('id', booking.data[0]['appliance_id']).execute()
        
        return jsonify({
            'success': True,
            'message': 'Job marked as completed!'
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
