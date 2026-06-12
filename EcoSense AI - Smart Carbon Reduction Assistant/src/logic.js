// Emission factors (kg CO2 per unit)
const EMISSION_FACTORS = {
  transport: {
    car: 0.21, // per km
    bike: 0.08, // per km (motorcycle/scooter)
    bus: 0.05, // per km
    train: 0.04, // per km
    walking: 0.0,
    bicycle: 0.0
  },
  energy: {
    electricity: 0.5 // per kWh (average mixed grid)
  },
  lifestyle: {
    diet: {
      vegan: 60, // per month approx base
      vegetarian: 80,
      mixed: 150,
      meat_heavy: 250
    },
    recycling: {
      always: -20, // reduction per month
      sometimes: 0,
      never: 20 // penalty
    }
  }
};

// Validates user input to prevent NaN or errors
export const validateInput = (data) => {
  const sanitized = {
    transportType: data.transportType || 'car',
    distanceDaily: Math.max(0, Number(data.distanceDaily) || 0),
    transportDays: Math.min(7, Math.max(0, Number(data.transportDays) || 0)),
    electricityMonthly: Math.max(0, Number(data.electricityMonthly) || 0),
    diet: data.diet || 'mixed',
    recycling: data.recycling || 'sometimes'
  };
  return sanitized;
};

// Calculate monthly footprint based on sanitized inputs
export const calculateFootprint = (data) => {
  const transportDaily = data.distanceDaily * (EMISSION_FACTORS.transport[data.transportType] || 0);
  const transportMonthly = transportDaily * data.transportDays * 4; // approx 4 weeks/month

  const energyMonthly = data.electricityMonthly * EMISSION_FACTORS.energy.electricity;

  let lifestyleMonthly = EMISSION_FACTORS.lifestyle.diet[data.diet] || 150;
  lifestyleMonthly += EMISSION_FACTORS.lifestyle.recycling[data.recycling] || 0;

  const total = transportMonthly + energyMonthly + lifestyleMonthly;

  return {
    transport: transportMonthly,
    energy: energyMonthly,
    lifestyle: lifestyleMonthly,
    total: total
  };
};

// Generate an Eco Score from 0-100
export const getEcoScore = (totalEmissions) => {
  // Assume a completely carbon-neutral person is 100
  // Average person might be around 400-500 kg per month
  // Above 800 kg is very bad (0 score)
  const maxExpected = 800;
  let score = 100 - ((totalEmissions / maxExpected) * 100);
  score = Math.max(0, Math.min(100, Math.round(score)));

  let category = '';
  if (score >= 90) category = '🌱 Climate Champion';
  else if (score >= 70) category = '🌿 Eco Conscious';
  else if (score >= 40) category = '🌎 Improving';
  else category = '⚡ Needs Action';

  return { score, category };
};

// AI Assistant Rule-Based Logic
export const generateAIRecommendations = (data, breakdown) => {
  const recommendations = [];
  let potentialReduction = 0;

  // Transport rules
  if (breakdown.transport > 100 && (data.transportType === 'car' || data.transportType === 'bike')) {
    const alternateEms = data.distanceDaily * EMISSION_FACTORS.transport.bus * data.transportDays * 4;
    const reduction = breakdown.transport - alternateEms;
    potentialReduction += reduction;
    recommendations.push({
      title: 'Switch to Public Transport',
      text: `Replace driving with bus or train to significantly lower emissions.`,
      reduction: Math.round(reduction)
    });
  }

  // Energy rules
  if (data.electricityMonthly > 200) {
    const targetElectricity = data.electricityMonthly * 0.8; // 20% reduction target
    const reduction = (data.electricityMonthly - targetElectricity) * EMISSION_FACTORS.energy.electricity;
    potentialReduction += reduction;
    recommendations.push({
      title: 'Reduce Electricity Consumption',
      text: `You have high energy usage. Turning off unused appliances and switching to LED can cut usage by 20%.`,
      reduction: Math.round(reduction)
    });
  }

  // Lifestyle rules
  if (data.diet === 'meat_heavy') {
    const reduction = EMISSION_FACTORS.lifestyle.diet.meat_heavy - EMISSION_FACTORS.lifestyle.diet.mixed;
    potentialReduction += reduction;
    recommendations.push({
      title: 'Try a Mixed or Plant-Based Diet',
      text: `Reducing meat consumption a few days a week lowers dietary footprint significantly.`,
      reduction: Math.round(reduction)
    });
  }

  if (data.recycling === 'never' || data.recycling === 'sometimes') {
    const reduction = EMISSION_FACTORS.lifestyle.recycling[data.recycling] - EMISSION_FACTORS.lifestyle.recycling.always;
    potentialReduction += reduction;
    recommendations.push({
      title: 'Improve Recycling Habits',
      text: `Consistently recycling can offset some of your monthly emissions.`,
      reduction: Math.round(reduction)
    });
  }

  // Fallback if doing great
  if (recommendations.length === 0) {
    recommendations.push({
      title: 'Maintain Great Habits',
      text: 'You are doing amazing! Consider planting trees or joining community green events to offset your remaining footprint.',
      reduction: 0
    });
  }

  return { recommendations, potentialReduction: Math.round(potentialReduction) };
};

// Carbon Action Planner Logic
export const generateActionPlan = (goalPercent, data, breakdown) => {
  const targetReduction = breakdown.total * (goalPercent / 100);
  
  const plan = {
    goal: `${goalPercent}% Reduction`,
    targetKg: Math.round(targetReduction),
    weeks: [
      {
        week: 1,
        focus: 'Awareness & Quick Wins',
        actions: ['Track your daily electricity usage', 'Unplug devices when not in use']
      },
      {
        week: 2,
        focus: 'Transport Adjustments',
        actions: data.transportType === 'car' ? ['Carpool or use public transport twice this week', 'Combine errands into one trip'] : ['Maintain your low-emission commute', 'Walk or bike for short trips']
      },
      {
        week: 3,
        focus: 'Diet & Consumption',
        actions: ['Try two meatless days this week', 'Avoid single-use plastics']
      },
      {
        week: 4,
        focus: 'Long-term Sustainability',
        actions: ['Set up a strict recycling routine', 'Review your monthly utility bills for improvements']
      }
    ]
  };

  return plan;
};

// Local Storage Wrappers
export const saveUserData = (data) => {
  try {
    localStorage.setItem('ecosense_user_data', JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to local storage', e);
  }
};

export const loadUserData = () => {
  try {
    const data = localStorage.getItem('ecosense_user_data');
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Failed to load from local storage', e);
    return null;
  }
};
