import { test } from 'node:test';
import assert from 'node:assert';
import { 
  validateInput, 
  calculateFootprint, 
  getEcoScore, 
  generateAIRecommendations,
  calculateTransportEmissions,
  calculateEnergyEmissions,
  calculateLifestyleEmissions
} from './logic.js';

test('Carbon Calculation - Transport emissions', () => {
  // Car: 15 km daily, 5 days/week -> 15 * 0.21 * 5 * 4 = 63
  const carEms = calculateTransportEmissions('car', 15, 5);
  assert.strictEqual(carEms, 63);

  // Bike: 20 km daily, 3 days/week -> 20 * 0.08 * 3 * 4 = 19.2
  const bikeEms = calculateTransportEmissions('bike', 20, 3);
  assert.strictEqual(Number(bikeEms.toFixed(2)), 19.2);

  // Zero values
  const zeroEms = calculateTransportEmissions('car', 0, 0);
  assert.strictEqual(zeroEms, 0);

  // Invalid values (fallback validation handles this before calculation)
  const invalidEms = calculateTransportEmissions('invalid', 10, 5);
  assert.strictEqual(invalidEms, 0);
});

test('Carbon Calculation - Energy emissions', () => {
  // Electricity: 150 kWh -> 150 * 0.5 = 75
  const energyEms = calculateEnergyEmissions(150);
  assert.strictEqual(energyEms, 75);

  // Zero values
  const zeroEnergy = calculateEnergyEmissions(0);
  assert.strictEqual(zeroEnergy, 0);
});

test('Carbon Calculation - Lifestyle emissions', () => {
  // Vegetarian with mixed recycling -> 80 + 0 = 80
  const lifestyleEms = calculateLifestyleEmissions('vegetarian', 'sometimes');
  assert.strictEqual(lifestyleEms, 80);

  // Vegan with always recycling -> 60 - 20 = 40
  const alwaysRecycleEms = calculateLifestyleEmissions('vegan', 'always');
  assert.strictEqual(alwaysRecycleEms, 40);

  // Meat heavy with never recycling -> 250 + 20 = 270
  const heavyMeatEms = calculateLifestyleEmissions('meat_heavy', 'never');
  assert.strictEqual(heavyMeatEms, 270);
});

test('Carbon Calculation - Total Footprint and Input Validation', () => {
  // Normal / Valid inputs
  const normalInput = {
    transportType: 'car',
    distanceDaily: 15,
    transportDays: 5,
    electricityMonthly: 150,
    diet: 'mixed',
    recycling: 'sometimes'
  };
  const sanitized = validateInput(normalInput);
  assert.strictEqual(sanitized.distanceDaily, 15);
  assert.strictEqual(sanitized.transportDays, 5);
  assert.strictEqual(sanitized.electricityMonthly, 150);

  const footprint = calculateFootprint(sanitized);
  // transport = 15 * 0.21 * 5 * 4 = 63
  // energy = 150 * 0.5 = 75
  // lifestyle = mixed (150) + sometimes (0) = 150
  // total = 63 + 75 + 150 = 288
  assert.strictEqual(footprint.transport, 63);
  assert.strictEqual(footprint.energy, 75);
  assert.strictEqual(footprint.lifestyle, 150);
  assert.strictEqual(footprint.total, 288);

  // Zero values
  const zeroInput = {
    transportType: 'car',
    distanceDaily: 0,
    transportDays: 0,
    electricityMonthly: 0,
    diet: 'vegan',
    recycling: 'always'
  };
  const zeroSanitized = validateInput(zeroInput);
  const zeroFootprint = calculateFootprint(zeroSanitized);
  // transport = 0, energy = 0, lifestyle = 60 (vegan) - 20 (always) = 40
  assert.strictEqual(zeroFootprint.transport, 0);
  assert.strictEqual(zeroFootprint.energy, 0);
  assert.strictEqual(zeroFootprint.lifestyle, 40);
  assert.strictEqual(zeroFootprint.total, 40);

  // Empty values / Missing fields
  const emptySanitized = validateInput({});
  assert.strictEqual(emptySanitized.transportType, 'car');
  assert.strictEqual(emptySanitized.distanceDaily, 0);
  assert.strictEqual(emptySanitized.transportDays, 0);
  assert.strictEqual(emptySanitized.electricityMonthly, 0);
  assert.strictEqual(emptySanitized.diet, 'mixed');
  assert.strictEqual(emptySanitized.recycling, 'sometimes');

  // Invalid values (negative numbers, invalid types, invalid strings)
  const invalidInput = {
    transportType: 'spaceship', // invalid transport type
    distanceDaily: -50, // negative number
    transportDays: 'nine', // invalid string
    electricityMonthly: -100, // negative number
    diet: 'pizza_diet', // invalid diet
    recycling: null // null value
  };
  const invalidSanitized = validateInput(invalidInput);
  assert.strictEqual(invalidSanitized.transportType, 'car'); // fallback to car
  assert.strictEqual(invalidSanitized.distanceDaily, 0); // negative clamped to 0
  assert.strictEqual(invalidSanitized.transportDays, 0); // invalid string parsed to 0
  assert.strictEqual(invalidSanitized.electricityMonthly, 0); // negative clamped to 0
  assert.strictEqual(invalidSanitized.diet, 'mixed'); // fallback to mixed
  assert.strictEqual(invalidSanitized.recycling, 'sometimes'); // fallback to sometimes
});

test('Eco Score Logic - Score and Category classification', () => {
  // 90-100 = Climate Champion (e.g. emissions = 0 -> score 100)
  const champion = getEcoScore(0);
  assert.strictEqual(champion.score, 100);
  assert.strictEqual(champion.category, '🌱 Climate Champion');

  // 70-89 = Eco Conscious (e.g. emissions = 160 -> score 80)
  const conscious = getEcoScore(160);
  assert.strictEqual(conscious.score, 80);
  assert.strictEqual(conscious.category, '🌿 Eco Conscious');

  // 40-69 = Improving (e.g. emissions = 400 -> score 50)
  const improving = getEcoScore(400);
  assert.strictEqual(improving.score, 50);
  assert.strictEqual(improving.category, '🌎 Improving');

  // Below 40 = Needs Action (e.g. emissions = 640 -> score 20)
  const needsAction = getEcoScore(640);
  assert.strictEqual(needsAction.score, 20);
  assert.strictEqual(needsAction.category, '⚡ Needs Action');
});

test('AI Recommendation Engine - Personalized Suggestions', () => {
  // High transport usage (transport > 100 kg and car/bike type)
  // 25 km daily * 0.21 * 5 days * 4 weeks = 105 kg
  const highTransportData = {
    transportType: 'car',
    distanceDaily: 25,
    transportDays: 5,
    electricityMonthly: 50,
    diet: 'vegan',
    recycling: 'always'
  };
  const breakdown1 = calculateFootprint(highTransportData);
  const recs1 = generateAIRecommendations(highTransportData, breakdown1);
  assert.ok(recs1.recommendations.some(r => r.title === 'Switch to Public Transport'));

  // High electricity (> 200 kWh)
  const highEnergyData = {
    transportType: 'bicycle',
    distanceDaily: 0,
    transportDays: 0,
    electricityMonthly: 300,
    diet: 'vegan',
    recycling: 'always'
  };
  const breakdown2 = calculateFootprint(highEnergyData);
  const recs2 = generateAIRecommendations(highEnergyData, breakdown2);
  assert.ok(recs2.recommendations.some(r => r.title === 'Reduce Electricity Consumption'));

  // Multiple problems (high transport, high energy, meat heavy, never recycles)
  const multipleData = {
    transportType: 'car',
    distanceDaily: 30,
    transportDays: 5,
    electricityMonthly: 400,
    diet: 'meat_heavy',
    recycling: 'never'
  };
  const breakdown3 = calculateFootprint(multipleData);
  const recs3 = generateAIRecommendations(multipleData, breakdown3);
  assert.ok(recs3.recommendations.some(r => r.title === 'Switch to Public Transport'));
  assert.ok(recs3.recommendations.some(r => r.title === 'Reduce Electricity Consumption'));
  assert.ok(recs3.recommendations.some(r => r.title === 'Try a Mixed or Plant-Based Diet'));
  assert.ok(recs3.recommendations.some(r => r.title === 'Improve Recycling Habits'));
});
