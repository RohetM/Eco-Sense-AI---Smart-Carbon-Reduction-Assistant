import React, { useState } from 'react';

// Reusable Card Component
export const Card = ({ title, children, className = '' }) => (
  <div className={`card ${className}`}>
    {title && <h2 className="card-title">{title}</h2>}
    <div className="card-content">{children}</div>
  </div>
);

// Form Input Component
export const FormInput = ({ label, type = 'number', value, onChange, min, max, options }) => (
  <div className="form-group">
    <label>{label}</label>
    {type === 'select' ? (
      <select value={value} onChange={onChange} className="form-input">
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        className="form-input"
      />
    )}
  </div>
);

// Eco Score Display
export const EcoScoreDisplay = ({ score, category }) => {
  let colorClass = 'score-red';
  if (score >= 90) colorClass = 'score-green';
  else if (score >= 70) colorClass = 'score-light-green';
  else if (score >= 40) colorClass = 'score-yellow';

  return (
    <div className="eco-score-container">
      <div className={`eco-score-circle ${colorClass}`}>
        <span className="score-value">{score}</span>
        <span className="score-max">/100</span>
      </div>
      <h3 className={`score-category ${colorClass}-text`}>{category}</h3>
    </div>
  );
};

// AI Recommendations List
export const RecommendationsList = ({ recommendations, totalReduction }) => (
  <div className="recommendations">
    {recommendations.map((rec, idx) => (
      <div key={idx} className="rec-item">
        <h4>{rec.title}</h4>
        <p>{rec.text}</p>
        {rec.reduction > 0 && (
          <div className="rec-reduction">
            ↓ {rec.reduction} kg CO₂/month
          </div>
        )}
      </div>
    ))}
    {totalReduction > 0 && (
      <div className="total-reduction">
        Total possible improvement: <strong>{totalReduction} kg CO₂/month</strong>
      </div>
    )}
  </div>
);

// Action Planner Component
export const ActionPlanner = ({ plan, onGenerate }) => {
  const [goal, setGoal] = useState(20);

  return (
    <div className="action-planner">
      {!plan ? (
        <div className="planner-setup">
          <p>Set a reduction goal to get a personalized 30-day action plan.</p>
          <div className="goal-slider">
            <input 
              type="range" 
              min="5" 
              max="50" 
              step="5" 
              value={goal} 
              onChange={(e) => setGoal(e.target.value)} 
            />
            <span>{goal}% Reduction</span>
          </div>
          <button className="btn-primary" onClick={() => onGenerate(goal)}>Generate Plan</button>
        </div>
      ) : (
        <div className="planner-result">
          <h3>Your {plan.goal} Action Plan</h3>
          <p className="target-text">Target Reduction: <strong>{plan.targetKg} kg CO₂/mo</strong></p>
          <div className="weeks-container">
            {plan.weeks.map((week) => (
              <div key={week.week} className="week-card">
                <h4>Week {week.week}: {week.focus}</h4>
                <ul>
                  {week.actions.map((action, i) => (
                    <li key={i}>{action}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <button className="btn-secondary" onClick={() => onGenerate(null)}>Reset Plan</button>
        </div>
      )}
    </div>
  );
};

// Impact Simulator Component
export const ImpactSimulator = ({ currentTotal, onSimulate }) => {
  const [simTransport, setSimTransport] = useState(0);
  const [simEnergy, setSimEnergy] = useState(0);

  const newTotal = currentTotal - (simTransport + simEnergy);
  const reductionPercent = currentTotal > 0 ? ((currentTotal - newTotal) / currentTotal) * 100 : 0;

  return (
    <div className="simulator">
      <p>Test scenarios to see your potential impact.</p>
      
      <div className="sim-controls">
        <div className="sim-control">
          <label>Reduce Driving (- kg CO₂)</label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={simTransport} 
            onChange={(e) => setSimTransport(Number(e.target.value))} 
          />
          <span>-{simTransport} kg</span>
        </div>
        
        <div className="sim-control">
          <label>Reduce Energy (- kg CO₂)</label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={simEnergy} 
            onChange={(e) => setSimEnergy(Number(e.target.value))} 
          />
          <span>-{simEnergy} kg</span>
        </div>
      </div>

      <div className="sim-results">
        <div className="sim-stat">
          <span>Current</span>
          <strong>{Math.round(currentTotal)} kg</strong>
        </div>
        <div className="sim-stat">
          <span>After Changes</span>
          <strong>{Math.round(newTotal)} kg</strong>
        </div>
        <div className="sim-stat highlight">
          <span>Reduction</span>
          <strong>{reductionPercent.toFixed(1)}%</strong>
        </div>
      </div>
    </div>
  );
};
