// Mock API service for frontend-only deployment
export const mockApi = {
  register: async (data: any) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock response with calculated values
    const maintenanceProbability = calculateMaintenanceProbability(data);
    const estimatedSavings = calculateEstimatedSavings(data, maintenanceProbability);
    
    return {
      user_id: 1,
      appliance_id: 1,
      health_score: 100 - maintenanceProbability,
      maintenance_probability: maintenanceProbability,
      energy_loss_per_month: estimatedSavings * 0.8,
      estimated_savings: estimatedSavings,
      current_bill: data.current_bill,
      recommendations: generateRecommendations(data.appliance_type, maintenanceProbability),
      pricing: {
        'AC': { one_time: 799, amc: 999 },
        'Fridge': { one_time: 699, amc: 799 },
        'Washing Machine': { one_time: 649, amc: 749 }
      },
      message: 'Registration successful! Your appliance has been analyzed.'
    };
  },
  
  runDiagnostic: async (data: any) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock response
    const maintenanceProbability = calculateMaintenanceProbability(data);
    const estimatedSavings = calculateEstimatedSavings(data, maintenanceProbability);
    
    return {
      user_id: 1,
      appliance_id: 1,
      diagnostic_id: 1,
      health_score: 100 - maintenanceProbability,
      energy_loss_per_month: estimatedSavings * 0.8,
      estimated_savings: estimatedSavings,
      recommendations: generateRecommendations(data.appliance_type, maintenanceProbability),
      pricing: {
        'AC': { one_time: 799, amc: 999 },
        'Fridge': { one_time: 699, amc: 799 },
        'Washing Machine': { one_time: 649, amc: 749 }
      }
    };
  }
};

// Helper functions (copied from backend logic)
const calculateMaintenanceProbability = (data: any) => {
  const { appliance_type, usage_hours_per_day, months_since_service, appliance_age_years } = data;

  // Base probability factors
  let probability = 0;

  // Age factor (0-40 points): Older appliances need more maintenance
  const ageFactor = Math.min((appliance_age_years / 10) * 40, 40);
  probability += ageFactor;

  // Usage factor (0-30 points): Higher usage increases probability
  const usageFactor = Math.min((usage_hours_per_day / 24) * 30, 30);
  probability += usageFactor;

  // Service delay factor (0-30 points): Time since last service
  const serviceFactor = Math.min((months_since_service / 24) * 30, 30);
  probability += serviceFactor;

  // Appliance type multiplier
  const typeMultipliers: { [key: string]: number } = {
    'AC': 1.2,        // ACs need more frequent maintenance
    'Fridge': 1.0,
    'Washing Machine': 0.9
  };
  probability *= typeMultipliers[appliance_type] || 1.0;

  // Cap at 100%
  return Math.min(Math.round(probability), 100);
};

const calculateEstimatedSavings = (data: any, probability: number) => {
  const { current_bill } = data;
  // Calculate potential savings (10-20% of current bill for well-maintained appliances)
  const baselineSavings = current_bill * 0.15; // 15% average savings
  const efficiencyLoss = (probability / 100) * 0.3; // Up to 30% efficiency loss
  return Math.round(current_bill * efficiencyLoss);
};

const generateRecommendations = (appliance_type: string, probability: number) => {
  const recommendations = [];
  
  if (probability >= 70) {
    recommendations.push(`🚨 Urgent: Your ${appliance_type} needs immediate servicing to avoid breakdown.`);
    recommendations.push(`Schedule a technician visit within 3 days.`);
  } else if (probability >= 40) {
    recommendations.push(`⚠️ Your ${appliance_type} is running inefficiently.`);
    recommendations.push(`Book a service within 2 weeks to restore performance.`);
  } else {
    recommendations.push(`✅ Your ${appliance_type} is in good condition.`);
  }
  
  if (appliance_type === 'AC') {
    recommendations.push("💡 Tip: Clean filters monthly and service annually for optimal cooling.");
  } else if (appliance_type === 'Fridge') {
    recommendations.push("💡 Tip: Defrost regularly and check door seals to save energy.");
  } else if (appliance_type === 'Washing Machine') {
    recommendations.push("💡 Tip: Clean drum filter monthly to prevent clogging.");
  }
  
  if (probability >= 40) {
    recommendations.push("Consider our Annual Maintenance Contract (AMC) for worry-free upkeep.");
  }
  
  return recommendations;
};