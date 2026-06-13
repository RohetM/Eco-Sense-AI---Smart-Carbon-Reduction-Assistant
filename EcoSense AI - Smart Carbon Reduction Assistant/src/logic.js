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

// Reusable Helper: Calculate monthly transport emissions
export const calculateTransportEmissions = (type, distanceDaily, transportDays) => {
  const factor = EMISSION_FACTORS.transport[type] ?? 0;
  return distanceDaily * factor * transportDays * 4; // approx 4 weeks/month
};

// Reusable Helper: Calculate monthly energy emissions
export const calculateEnergyEmissions = (electricityMonthly) => {
  return electricityMonthly * EMISSION_FACTORS.energy.electricity;
};

// Reusable Helper: Calculate monthly lifestyle emissions
export const calculateLifestyleEmissions = (diet, recycling) => {
  const dietEmissions = EMISSION_FACTORS.lifestyle.diet[diet] ?? 150;
  const recyclingEmissions = EMISSION_FACTORS.lifestyle.recycling[recycling] ?? 0;
  return dietEmissions + recyclingEmissions;
};

// Validates user input to prevent NaN, negative numbers, or invalid fields
export const validateInput = (data) => {
  const safeData = data || {};
  const sanitized = {
    transportType: (safeData.transportType && typeof safeData.transportType === 'string' && EMISSION_FACTORS.transport[safeData.transportType] !== undefined)
      ? safeData.transportType
      : 'car',
    distanceDaily: Math.max(0, Number(safeData.distanceDaily) || 0),
    transportDays: Math.min(7, Math.max(0, Number(safeData.transportDays) || 0)),
    electricityMonthly: Math.max(0, Number(safeData.electricityMonthly) || 0),
    diet: (safeData.diet && typeof safeData.diet === 'string' && EMISSION_FACTORS.lifestyle.diet[safeData.diet] !== undefined)
      ? safeData.diet
      : 'mixed',
    recycling: (safeData.recycling && typeof safeData.recycling === 'string' && EMISSION_FACTORS.lifestyle.recycling[safeData.recycling] !== undefined)
      ? safeData.recycling
      : 'sometimes'
  };
  return sanitized;
};

// Calculate monthly footprint based on sanitized inputs
export const calculateFootprint = (data) => {
  const sanitized = validateInput(data);
  const transport = calculateTransportEmissions(sanitized.transportType, sanitized.distanceDaily, sanitized.transportDays);
  const energy = calculateEnergyEmissions(sanitized.electricityMonthly);
  const lifestyle = calculateLifestyleEmissions(sanitized.diet, sanitized.recycling);
  const total = transport + energy + lifestyle;

  return {
    transport,
    energy,
    lifestyle,
    total
  };
};

// Generate an Eco Score from 0-100
export const getEcoScore = (totalEmissions) => {
  const emissions = Math.max(0, Number(totalEmissions) || 0);
  const maxExpected = 800;
  let score = 100 - ((emissions / maxExpected) * 100);
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
  const sanitizedData = validateInput(data);
  const sanitizedBreakdown = breakdown || calculateFootprint(sanitizedData);

  const recommendations = [];
  let potentialReduction = 0;

  // Transport rules
  if (sanitizedBreakdown.transport > 100 && (sanitizedData.transportType === 'car' || sanitizedData.transportType === 'bike')) {
    const alternateEms = calculateTransportEmissions('bus', sanitizedData.distanceDaily, sanitizedData.transportDays);
    const reduction = sanitizedBreakdown.transport - alternateEms;
    potentialReduction += reduction;
    recommendations.push({
      title: 'Switch to Public Transport',
      text: `Replace driving with bus or train to significantly lower emissions.`,
      reduction: Math.round(reduction)
    });
  }

  // Energy rules
  if (sanitizedData.electricityMonthly > 200) {
    const targetElectricity = sanitizedData.electricityMonthly * 0.8; // 20% reduction target
    const reduction = calculateEnergyEmissions(sanitizedData.electricityMonthly - targetElectricity);
    potentialReduction += reduction;
    recommendations.push({
      title: 'Reduce Electricity Consumption',
      text: `You have high energy usage. Turning off unused appliances and switching to LED can cut usage by 20%.`,
      reduction: Math.round(reduction)
    });
  }

  // Lifestyle rules
  if (sanitizedData.diet === 'meat_heavy') {
    const reduction = EMISSION_FACTORS.lifestyle.diet.meat_heavy - EMISSION_FACTORS.lifestyle.diet.mixed;
    potentialReduction += reduction;
    recommendations.push({
      title: 'Try a Mixed or Plant-Based Diet',
      text: `Reducing meat consumption a few days a week lowers dietary footprint significantly.`,
      reduction: Math.round(reduction)
    });
  }

  if (sanitizedData.recycling === 'never' || sanitizedData.recycling === 'sometimes') {
    const reduction = EMISSION_FACTORS.lifestyle.recycling[sanitizedData.recycling] - EMISSION_FACTORS.lifestyle.recycling.always;
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
  const sanitizedData = validateInput(data);
  const sanitizedBreakdown = breakdown || calculateFootprint(sanitizedData);
  const targetReduction = sanitizedBreakdown.total * (Number(goalPercent) || 0) / 100;
  
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
        actions: sanitizedData.transportType === 'car' ? ['Carpool or use public transport twice this week', 'Combine errands into one trip'] : ['Maintain your low-emission commute', 'Walk or bike for short trips']
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

// Loads saved data
export const loadUserData = () => {
  try {
    const data = localStorage.getItem('ecosense_user_data');
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Failed to load from local storage', e);
    return null;
  }
};

