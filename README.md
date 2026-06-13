# EcoSense AI - Smart Carbon Reduction Assistant

## Problem Statement

People are increasingly aware of climate change but often lack personalized, actionable guidance on which of their daily habits contribute the most to their carbon footprint, and what specific changes can create the highest positive impact.

## Solution

EcoSense AI is a lightweight, privacy-first sustainability assistant that calculates your carbon footprint based on daily habits and provides a rule-based AI recommendation engine to help you build a personalized reduction strategy. It does all this locally on your device without sending any data to external servers.

## Features

- **Smart Carbon Calculator**: Calculates monthly CO₂ emissions across Transport, Energy, and Lifestyle categories using realistic emission factors.
- **EcoScore System**: Rates your sustainability on a 0-100 scale, categorizing you from "Needs Action" to "Climate Champion".
- **EcoSense AI Assistant**: A rule-based engine analyzing your highest emission categories to provide tailored, high-impact recommendations for footprint reduction.
- **Carbon Action Planner**: Set a reduction goal (e.g., 20%) and receive a comprehensive 30-day step-by-step action plan.
- **Impact Simulator**: A "What if?" tool to test how reducing your driving or energy consumption will lower your total footprint.
- **Dashboard UI**: A premium, responsive, glassmorphism-styled dashboard tailored for accessibility and aesthetics.

## Technology Used

- React
- Vite
- JavaScript
- Vanilla CSS
- Browser LocalStorage

## How It Works

1. Users input their daily transport, energy, and lifestyle habits into the calculator.
2. The application computes the total footprint using localized emission factors.
3. The data is fed into the rule-based AI Assistant which detects the highest emission areas and maps them against predetermined logic rules to suggest specific actions.
4. Users can interact with the Impact Simulator to see real-time estimates of their potential reductions, or generate a structured 30-Day Action Plan.
5. All calculations and history are saved persistently using LocalStorage.

## AI Decision Logic

EcoSense AI is powered by an explainable, deterministic rule-based AI recommendation engine. It operates completely locally on the client-side, respecting user privacy.

1. **Lifestyle Data Analysis**: The engine parses sanitized user habits (commute distance, electricity usage, diet preference, recycling consistency).
2. **Highest Emission Identification**: Computes categorical breakdowns to isolate the largest contributors.
3. **Recommendation Mapping**: Maps emission metrics against specific rule thresholds (e.g., transport emissions > 100 kg/mo with car usage, or electricity > 200 kWh/mo).
4. **Personalized Suggestions & Reduction Estimation**: Calculates exact reduction figures if alternatives are adopted (e.g., swapping to bus/metro or cutting utility consumption by 20%) and generates structured actions for the Carbon Action Planner.

## Testing

EcoSense AI features a lightweight, high-performance unit test suite implemented with Node.js's built-in test runner (`node:test` and `node:assert`). This design provides lightning-fast execution speeds with zero external testing dependencies, keeping the repository light and clean.

### Tested Scenarios
- **Carbon Calculations**: Covers transport emissions (car, bike), electricity consumption calculations, lifestyle emissions (vegan, vegetarian, mixed, meat-heavy, recycling options), and total monthly footprint.
- **Input Validation**: Verifies clamping of negative values, type-casting of invalid strings, and default fallbacks for missing/empty fields to ensure the app never crashes under bad inputs.
- **Eco Score Logic**: Validates correctness of the score mapping:
  - `🌱 Climate Champion` (Score: 90–100)
  - `🌿 Eco Conscious` (Score: 70–89)
  - `🌎 Improving` (Score: 40–69)
  - `⚡ Needs Action` (Score: < 40)
- **AI Recommendation Engine**: Validates rule triggering and potential reduction offsets for isolated high transport, high energy, and combined multi-category scenarios.

Run tests with:
```bash
npm run test
```

## Accessibility

The application is engineered to meet modern accessibility standards, ensuring compatibility with screen readers, keyboard-only users, and other assistive technologies without altering the premium UI appearance.

### Accessibility Enhancements
- **Semantic HTML**: Converted generic containers to appropriate semantic tags like `<main>`, `<section>`, `<article>`, `<header>`, and `<footer>` to establish proper visual landmarks.
- **Form Control Bindings**: Every calculator field and range slider is explicitly bound to a `<label>` using `htmlFor` and unique `id` properties.
- **Keyboard Support & Focus States**: All buttons, select fields, and range sliders are fully navigable via standard keyboard focus (`Tab`, arrow keys).
- **Visible Focus Rings**: Added standard `:focus-visible` styling in CSS. Highlighted interactive elements get a distinct green outline only when accessed via keyboard navigation.
- **Screen Reader Announcements**: Integrated `aria-live="polite"` to dynamically notify screen reader users of changes in calculated results, eco score categories, and generated action plans immediately.
- **Accessible Names**: Supplied custom `aria-label` tags for the AI Recommendations section and simulator inputs to provide context.

## Assumptions

- Car emission factor: ~0.21 kg CO₂/km
- Electricity emission factor: ~0.5 kg CO₂/kWh (average mixed grid)
- Monthly calculations assume approximately 4 weeks (28 days) for transport tracking.
- Baseline diet emissions range from 60 kg/month (Vegan) to 250 kg/month (Heavy Meat).

## Security Considerations

- **Privacy-First Design**: The application connects to no external APIs.
- **Local Storage Only**: All user data, including footprint calculations and action plans, are stored purely in the user's browser `localStorage`.
- **Input Validation**: All inputs are sanitized and fallback to safe defaults to prevent NaN injection and calculation errors.
- **Zero Exposed Secrets**: No API keys or authentication layers exist in the app.

## Future Improvements

- IoT Integration for automated energy tracking.
- Real-time regional grid emission data.
- Community challenges and leaderboards.
