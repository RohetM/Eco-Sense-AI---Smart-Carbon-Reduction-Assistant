# EcoSense AI - Smart Carbon Reduction Assistant

## 🚀 Live Demo
[View on Vercel](https://eco-sense-ai-smart-carbon-reduction-one.vercel.app/)


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

EcoSense AI relies on a deterministic, rule-based recommendation engine. It operates without external APIs:
- If a user has transport emissions > 100 kg/month and primarily uses a car/bike, the AI calculates the exact emission difference if they switched to public transit and suggests this reduction.
- If electricity > 200 kWh/month, the AI suggests a 20% target reduction using energy-saving habits.
- Dietary and recycling habits trigger specific rules based on the user's selected lifestyle choices.
- The system is completely autonomous and operates with O(1) complexity on the client side.

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
