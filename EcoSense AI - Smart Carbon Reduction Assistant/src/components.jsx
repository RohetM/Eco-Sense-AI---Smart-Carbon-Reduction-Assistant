import React, { useState } from 'react';

// Reusable Card Component with Semantic HTML and accessible label linking
export const Card = ({ title, children, className = '', tag = 'section', ...props }) => {
  const Tag = tag;
  const headingId = title ? `card-title-${title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}` : undefined;

  return (
    <Tag 
      className={`card ${className}`} 
      aria-labelledby={props['aria-labelledby'] || headingId}
      aria-label={props['aria-label']}
      {...props}
    >
      {title && <h2 id={headingId} className="card-title">{title}</h2>}
      <div className="card-content">{children}</div>
    </Tag>
  );
};

// Form Input Component with complete accessibility (htmlFor/id bindings, aria-labels, placeholders)
export const FormInput = ({ label, type = 'number', value, onChange, min, max, options, placeholder, id }) => {
  const inputId = id || `input-${label.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}`;
  return (
    <div className="form-group">
      <label htmlFor={inputId}>{label}</label>
      {type === 'select' ? (
        <select 
          id={inputId}
          value={value} 
          onChange={onChange} 
          className="form-input"
          aria-label={label}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : (
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          className="form-input"
          placeholder={placeholder || `Enter your ${label.toLowerCase()}`}
          aria-label={label}
        />
      )}
    </div>
  );
};

// Eco Score Display with aria-live updates
export const EcoScoreDisplay = ({ score, category }) => {
  let colorClass = 'score-red';
  if (score >= 90) colorClass = 'score-green';
  else if (score >= 70) colorClass = 'score-light-green';
  else if (score >= 40) colorClass = 'score-yellow';

  return (
    <div className="eco-score-container" aria-live="polite" aria-atomic="true">
      <div className={`eco-score-circle ${colorClass}`} aria-label={`Sustainability Score: ${score} out of 100`}>
        <span className="score-value">{score}</span>
        <span className="score-max">/100</span>
      </div>
      <h3 className={`score-category ${colorClass}-text`}>{category}</h3>
    </div>
  );
};

// AI Recommendations List with polite aria-live alerts and semantic articles
export const RecommendationsList = ({ recommendations, totalReduction }) => (
  <div className="recommendations" aria-live="polite">
    {recommendations.map((rec, idx) => (
      <article key={idx} className="rec-item" aria-label={`Recommendation: ${rec.title}`}>
        <h4>{rec.title}</h4>
        <p>{rec.text}</p>
        {rec.reduction > 0 && (
          <div className="rec-reduction">
            ↓ {rec.reduction} kg CO₂/month
          </div>
        )}
      </article>
    ))}
    {totalReduction > 0 && (
      <div className="total-reduction">
        Total possible improvement: <strong>{totalReduction} kg CO₂/month</strong>
      </div>
    )}
  </div>
);

// Action Planner Component with slider labels and semantic structures
export const ActionPlanner = ({ plan, onGenerate }) => {
  const [goal, setGoal] = useState(20);

  return (
    <div className="action-planner">
      {!plan ? (
        <div className="planner-setup">
          <p>Set a reduction goal to get a personalized 30-day action plan.</p>
          <div className="goal-slider">
            <label htmlFor="goal-slider-input" className="sr-only">Set your reduction goal</label>
            <input 
              id="goal-slider-input"
              type="range" 
              min="5" 
              max="50" 
              step="5" 
              value={goal} 
              onChange={(e) => setGoal(e.target.value)} 
              aria-label="Target carbon footprint reduction percentage"
            />
            <span>{goal}% Reduction</span>
          </div>
          <button className="btn-primary" onClick={() => onGenerate(goal)}>Generate Plan</button>
        </div>
      ) : (
        <div className="planner-result" aria-live="polite">
          <h3>Your {plan.goal} Action Plan</h3>
          <p className="target-text">Target Reduction: <strong>{plan.targetKg} kg CO₂/mo</strong></p>
          <div className="weeks-container">
            {plan.weeks.map((week) => (
              <article key={week.week} className="week-card">
                <h4>Week {week.week}: {week.focus}</h4>
                <ul>
                  {week.actions.map((action, i) => (
                    <li key={i}>{action}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <button className="btn-secondary" onClick={() => onGenerate(null)}>Reset Plan</button>
        </div>
      )}
    </div>
  );
};

// Impact Simulator Component with range slider label linking
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
          <label htmlFor="sim-transport-input">Reduce Driving (- kg CO₂)</label>
          <input 
            id="sim-transport-input"
            type="range" 
            min="0" 
            max="100" 
            value={simTransport} 
            onChange={(e) => setSimTransport(Number(e.target.value))} 
            aria-label="Simulate reducing driving emissions in kilograms"
          />
          <span>-{simTransport} kg</span>
        </div>
        
        <div className="sim-control">
          <label htmlFor="sim-energy-input">Reduce Energy (- kg CO₂)</label>
          <input 
            id="sim-energy-input"
            type="range" 
            min="0" 
            max="100" 
            value={simEnergy} 
            onChange={(e) => setSimEnergy(Number(e.target.value))} 
            aria-label="Simulate reducing energy emissions in kilograms"
          />
          <span>-{simEnergy} kg</span>
        </div>
      </div>

      <div className="sim-results" aria-live="polite">
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

