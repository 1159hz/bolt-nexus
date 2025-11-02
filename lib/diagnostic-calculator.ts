interface DiagnosticInput {
  applianceType: string
  brand: string
  yearOfPurchase: number
  usageHoursPerDay: number
  monthsSinceLastService: number
}

interface DiagnosticResult {
  energyLossPerMonth: number
  healthScore: number
  efficiency: string
  recommendation: string
  estimatedSavings: number
}

const APPLIANCE_BASE_CONSUMPTION: Record<string, number> = {
  AC: 1.5, // kW
  Refrigerator: 0.6, // kW
  "Washing Machine": 2.0,
  Microwave: 1.2,
  Dishwasher: 1.8,
  "Water Heater": 4.5,
}

const APPLIANCE_PRICES: Record<string, { onetime: number; amc: number }> = {
  AC: { onetime: 799, amc: 999 },
  Refrigerator: { onetime: 699, amc: 799 },
  "Washing Machine": { onetime: 649, amc: 749 },
  Microwave: { onetime: 499, amc: 599 },
  Dishwasher: { onetime: 799, amc: 899 },
  "Water Heater": { onetime: 549, amc: 699 },
}

export function calculateDiagnostic(input: DiagnosticInput): DiagnosticResult {
  // Base consumption in kW
  const baseConsumption = APPLIANCE_BASE_CONSUMPTION[input.applianceType] || 1.0

  // Age factor (older appliances lose efficiency)
  const ageInYears = new Date().getFullYear() - input.yearOfPurchase
  const ageFactor = 1 + ageInYears * 0.05 // 5% efficiency loss per year

  // Service factor (lack of service increases inefficiency)
  const serviceFactor = 1 + input.monthsSinceLastService * 0.02 // 2% inefficiency per month without service

  // Adjusted consumption
  const adjustedConsumption = baseConsumption * ageFactor * serviceFactor

  // Monthly usage in kWh (30 days)
  const monthlyUsageKwh = adjustedConsumption * input.usageHoursPerDay * 30

  // Electricity rate in India (₹ per kWh) - approximate
  const electricityRate = 7 // Average rate across India

  // Energy loss is inefficiency relative to baseline
  const inefficiencyPercent = ((adjustedConsumption - baseConsumption) / baseConsumption) * 100
  const energyLossPerMonth = (inefficiencyPercent / 100) * monthlyUsageKwh * electricityRate

  // Health Score calculation
  let healthScore = 100
  healthScore -= Math.min(ageInYears * 3, 30) // Age reduces score (max -30)
  healthScore -= Math.min(input.monthsSinceLastService * 0.5, 20) // Lack of service (max -20)
  healthScore = Math.max(10, healthScore) // Minimum score of 10

  // Efficiency category
  let efficiency = "Excellent"
  if (healthScore < 70) efficiency = "Poor"
  else if (healthScore < 80) efficiency = "Fair"
  else if (healthScore < 90) efficiency = "Good"
  else efficiency = "Excellent"

  // Recommendation based on health score
  let recommendation = "Your appliance is in great condition!"
  if (healthScore < 50) {
    recommendation = "Urgent: Schedule immediate maintenance to prevent breakdown"
  } else if (healthScore < 70) {
    recommendation = "Recommended: Schedule maintenance within 2 weeks"
  } else if (healthScore < 85) {
    recommendation = "Suggested: Schedule routine maintenance"
  }

  // Estimated annual savings with proper maintenance
  const estimatedSavings = energyLossPerMonth * 12 * 0.6 // Assume 60% recovery with maintenance

  return {
    energyLossPerMonth: Math.round(energyLossPerMonth),
    healthScore: Math.round(healthScore),
    efficiency,
    recommendation,
    estimatedSavings: Math.round(estimatedSavings),
  }
}
