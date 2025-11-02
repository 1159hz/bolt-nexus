// Mock API route for diagnostic
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const data = await request.json()
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Return mock response
  return NextResponse.json({
    user_id: 1,
    appliance_id: 1,
    diagnostic_id: 1,
    health_score: 75,
    energy_loss_per_month: 600,
    estimated_savings: 400,
    recommendations: [
      "⚠️ Your appliance is running inefficiently.",
      "Book a service within 2 weeks to restore performance.",
      "💡 Tip: Clean filters monthly for optimal performance."
    ],
    pricing: {
      'AC': { one_time: 799, amc: 999 },
      'Fridge': { one_time: 699, amc: 799 },
      'Washing Machine': { one_time: 649, amc: 749 }
    }
  })
}