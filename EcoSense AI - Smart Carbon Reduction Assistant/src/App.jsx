import React, { useState, useEffect } from 'react';
import { 
  Card, 
  FormInput, 
  EcoScoreDisplay, 
  RecommendationsList, 
  ActionPlanner, 
  ImpactSimulator 
} from './components.jsx';
import { 
  validateInput, 
  calculateFootprint, 
  getEcoScore, 
  generateAIRecommendations,
  generateActionPlan,
  saveUserData,
  loadUserData
} from './logic.js';

function App() {
  const [formData, setFormData] = useState({
    transportType: 'car',
    distanceDaily: 15,
    transportDays: 5,
    electricityMonthly: 150,
    diet: 'mixed',
    recycling: 'sometimes'
  });

  const [results, setResults] = useState(null);
  const [actionPlan, setActionPlan] = useState(null);

  // Load saved data on mount
  useEffect(() => {
    const saved = loadUserData();
    if (saved && saved.formData) {
      setFormData(saved.formData);
      if (saved.actionPlan) setActionPlan(saved.actionPlan);
    }
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCalculate = () => {
    const validData = validateInput(formData);
    setFormData(validData); // update with sanitized
    const breakdown = calculateFootprint(validData);
    const scoreData = getEcoScore(breakdown.total);
    const aiRecs = generateAIRecommendations(validData, breakdown);

    const newResults = {
      breakdown,
      ...scoreData,
      ...aiRecs
    };

    setResults(newResults);
    saveUserData({ formData: validData, actionPlan });
  };

  const handleGeneratePlan = (goal) => {
    if (!goal) {
      setActionPlan(null);
      saveUserData({ formData, actionPlan: null });
      return;
    }
    const validData = validateInput(formData);
    const breakdown = calculateFootprint(validData);
    const plan = generateActionPlan(goal, validData, breakdown);
    setActionPlan(plan);
    saveUserData({ formData: validData, actionPlan: plan });
  };

  // Auto-calculate on initial load if data exists
  useEffect(() => {
    if (formData.distanceDaily > 0 && !results) {
      handleCalculate();
    }
  }, []);

  return (
    <div className="app-container">
      <header className="hero">
        <div className="hero-content">
          <h1>EcoSense AI</h1>
          <p>Smart Carbon Reduction Assistant</p>
        </div>
      </header>

      <main className="dashboard">
        <div className="left-panel">
          <Card title="Smart Carbon Calculator" className="calculator-card glass">
            <div className="calc-section">
              <h3>🚗 Transportation</h3>
              <FormInput 
                label="Vehicle Type" 
                type="select" 
                value={formData.transportType} 
                onChange={(e) => handleChange('transportType', e.target.value)}
                options={[
                  { label: 'Car (Petrol/Diesel)', value: 'car' },
                  { label: 'Motorcycle / Scooter', value: 'bike' },
                  { label: 'Public Bus', value: 'bus' },
                  { label: 'Train / Metro', value: 'train' },
                  { label: 'Walking / Bicycle', value: 'bicycle' }
                ]}
              />
              <FormInput 
                label="Daily Distance (km)" 
                value={formData.distanceDaily} 
                onChange={(e) => handleChange('distanceDaily', e.target.value)}
              />
              <FormInput 
                label="Days per week" 
                value={formData.transportDays} 
                max="7"
                onChange={(e) => handleChange('transportDays', e.target.value)}
              />
            </div>

            <div className="calc-section">
              <h3>⚡ Energy</h3>
              <FormInput 
                label="Monthly Electricity (kWh)" 
                value={formData.electricityMonthly} 
                onChange={(e) => handleChange('electricityMonthly', e.target.value)}
              />
            </div>

            <div className="calc-section">
              <h3>🥗 Lifestyle</h3>
              <FormInput 
                label="Diet Preference" 
                type="select" 
                value={formData.diet} 
                onChange={(e) => handleChange('diet', e.target.value)}
                options={[
                  { label: 'Heavy Meat', value: 'meat_heavy' },
                  { label: 'Mixed', value: 'mixed' },
                  { label: 'Vegetarian', value: 'vegetarian' },
                  { label: 'Vegan / Plant-based', value: 'vegan' }
                ]}
              />
              <FormInput 
                label="Recycling Habits" 
                type="select" 
                value={formData.recycling} 
                onChange={(e) => handleChange('recycling', e.target.value)}
                options={[
                  { label: 'Never', value: 'never' },
                  { label: 'Sometimes', value: 'sometimes' },
                  { label: 'Always', value: 'always' }
                ]}
              />
            </div>

            <button className="btn-primary calculate-btn" onClick={handleCalculate}>
              Calculate My Impact
            </button>
          </Card>
        </div>

        <div className="right-panel">
          {results ? (
            <>
              <div className="top-results">
                <Card title="Carbon Footprint" className="glass footprint-card">
                  <div className="total-footprint">
                    <span className="big-number">{Math.round(results.breakdown.total)}</span>
                    <span className="unit">kg CO₂/mo</span>
                  </div>
                  <div className="breakdown-bars">
                    <div className="bar-group">
                      <label>Transport</label>
                      <div className="bar-wrap">
                        <div className="bar transport" style={{ width: `${Math.min(100, (results.breakdown.transport / results.breakdown.total) * 100)}%` }}></div>
                      </div>
                    </div>
                    <div className="bar-group">
                      <label>Energy</label>
                      <div className="bar-wrap">
                        <div className="bar energy" style={{ width: `${Math.min(100, (results.breakdown.energy / results.breakdown.total) * 100)}%` }}></div>
                      </div>
                    </div>
                    <div className="bar-group">
                      <label>Lifestyle</label>
                      <div className="bar-wrap">
                        <div className="bar lifestyle" style={{ width: `${Math.min(100, (results.breakdown.lifestyle / results.breakdown.total) * 100)}%` }}></div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card title="Sustainability Score" className="glass score-card">
                  <EcoScoreDisplay score={results.score} category={results.category} />
                </Card>
              </div>

              <Card title="EcoSense AI Assistant" className="glass ai-card">
                <RecommendationsList 
                  recommendations={results.recommendations} 
                  totalReduction={results.potentialReduction} 
                />
              </Card>

              <div className="bottom-widgets">
                <Card title="Carbon Action Planner" className="glass planner-card">
                  <ActionPlanner plan={actionPlan} onGenerate={handleGeneratePlan} />
                </Card>

                <Card title="Impact Simulator" className="glass simulator-card">
                  <ImpactSimulator currentTotal={results.breakdown.total} />
                </Card>
              </div>
            </>
          ) : (
            <div className="empty-state glass">
              <div className="empty-icon">🌍</div>
              <h2>Welcome to EcoSense AI</h2>
              <p>Enter your daily habits on the left to calculate your carbon footprint and get personalized AI recommendations.</p>
            </div>
          )}
        </div>
      </main>
      <footer>
        <p>EcoSense AI © 2026 | Built for Hack2Skill Challenge 3</p>
      </footer>
    </div>
  );
}

export default App;
