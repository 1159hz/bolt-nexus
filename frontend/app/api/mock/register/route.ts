// Mock API route for registration
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const data = await request.json()
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Return mock response
  return NextResponse.json({
    user_id: 1,
    appliance_id: 1,
    health_score: 85,
    maintenance_probability: 30,
    energy_loss_per_month: 500,
    estimated_savings: 300,
    current_bill: data.current_bill || 3000,
    recommendations: [
      "✅ Your appliance is in good condition.",
      "💡 Tip: Clean filters monthly for optimal performance."
    ],
    pricing: {
      'AC': { one_time: 799, amc: 999 },
      'Fridge': { one_time: 699, amc: 799 },
      'Washing Machine': { one_time: 649, amc: 749 }
    },
    message: 'Registration successful! Your appliance has been analyzed.'
  })
}