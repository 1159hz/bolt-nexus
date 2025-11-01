-- Bolt Nexus - Smart Appliance Health Platform Database Schema
-- Run this in your Supabase SQL Editor

-- Drop existing tables if they exist (for fresh start)
DROP TABLE IF EXISTS service_notes CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS diagnostics CASCADE;
DROP TABLE IF EXISTS appliances CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS technicians CASCADE;

-- Users table
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  city TEXT,
  password_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appliances table (user's appliances)
CREATE TABLE appliances (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  appliance_type TEXT NOT NULL, -- 'AC', 'Fridge', 'Washing Machine'
  brand_model TEXT,
  year_of_purchase INTEGER,
  usage_hours_per_day DECIMAL(5,2),
  months_since_service INTEGER,
  health_score INTEGER DEFAULT 0, -- 0-100
  energy_loss_per_month DECIMAL(10,2) DEFAULT 0, -- ₹ amount
  status TEXT DEFAULT 'active', -- 'active', 'needs_service', 'serviced'
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Diagnostics table (stores diagnostic reports)
CREATE TABLE diagnostics (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  appliance_id BIGINT REFERENCES appliances(id) ON DELETE CASCADE,
  health_score INTEGER,
  energy_loss_per_month DECIMAL(10,2),
  estimated_savings DECIMAL(10,2),
  recommendations TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Technicians table
CREATE TABLE technicians (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  specialization TEXT, -- 'AC', 'Fridge', 'Washing Machine', 'All'
  city TEXT,
  status TEXT DEFAULT 'available', -- 'available', 'busy', 'offline'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  appliance_id BIGINT REFERENCES appliances(id) ON DELETE CASCADE,
  technician_id BIGINT REFERENCES technicians(id),
  service_type TEXT NOT NULL, -- 'one_time', 'amc'
  appliance_type TEXT NOT NULL,
  scheduled_date TIMESTAMPTZ,
  status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'
  payment_status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'failed'
  service_amount DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id BIGSERIAL PRIMARY KEY,
  booking_id BIGINT REFERENCES bookings(id) ON DELETE CASCADE,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'pending', -- 'pending', 'success', 'failed'
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service notes table
CREATE TABLE service_notes (
  id BIGSERIAL PRIMARY KEY,
  booking_id BIGINT REFERENCES bookings(id) ON DELETE CASCADE,
  technician_id BIGINT REFERENCES technicians(id),
  notes TEXT,
  before_images TEXT[], -- Array of image URLs
  after_images TEXT[], -- Array of image URLs
  parts_replaced TEXT,
  verified_savings DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE appliances ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnostics ENABLE ROW LEVEL SECURITY;
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_notes ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for MVP - add proper auth later)
CREATE POLICY "Allow all on users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on appliances" ON appliances FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on diagnostics" ON diagnostics FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on technicians" ON technicians FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on bookings" ON bookings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on payments" ON payments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on service_notes" ON service_notes FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_appliances_user_id ON appliances(user_id);
CREATE INDEX idx_diagnostics_user_id ON diagnostics(user_id);
CREATE INDEX idx_diagnostics_appliance_id ON diagnostics(appliance_id);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_technician_id ON bookings(technician_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_service_notes_booking_id ON service_notes(booking_id);

-- Insert sample technicians
INSERT INTO technicians (name, phone, email, specialization, city) VALUES
  ('Rajesh Kumar', '+919876543210', 'rajesh@boltnexus.com', 'AC', 'Mumbai'),
  ('Priya Sharma', '+919876543211', 'priya@boltnexus.com', 'Fridge', 'Delhi'),
  ('Amit Patel', '+919876543212', 'amit@boltnexus.com', 'Washing Machine', 'Bangalore'),
  ('Sanjay Singh', '+919876543213', 'sanjay@boltnexus.com', 'All', 'Mumbai');

-- Pricing reference (for backend logic)
-- AC: One-time ₹799 / AMC ₹999
-- Fridge: One-time ₹699 / AMC ₹799  
-- Washing Machine: One-time ₹649 / AMC ₹749
