# Electricity Demand Forecasting - Frontend

This is the frontend application for the **Electricity Demand Forecasting** project, a sophisticated machine learning web application. It is designed to provide an interactive dashboard for visualizing energy datasets, commanding predictive model training, predicting hourly electricity demand, and explaining AI decisions using SHAP.

## Key Features
- **Secure Dashboard:** JWT-based authentication to restrict access to authorized personnel.
- **Dataset Exploration:** View dataset statistics, data dictionary, and underlying feature characteristics for the Spanish Energy dataset.
- **Interactive Model Training:** Control XGBoost hyperparameters (`eta`, `max_depth`, `subsample`, etc.) and launch Optuna background training tasks directly from the UI. Training progress is fetched and displayed via real-time polling.
- **Demand Prediction:** Predict the upcoming 24 hours of electricity load based on target weather and generation features, calculating MAPE against actuals when available.
- **AI Interpretability (SHAP):** Interactive Local Waterfall charts let users select a specific hour and see exactly how temperature, wind speed, etc. impacted the final megawatt prediction.

## Technology Stack
- **Framework:** React 19, TypeScript, Vite
- **UI Library:** Material UI (MUI) v7
- **State Management:** Zustand (`useAuthStore`, `usePredictionStore`, `useTrainingStore`)
- **Routing:** React Router DOM v7
- **Visualization:** Plotly.js, React-Plotly, Recharts

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

This application integrates seamlessly with the FastAPI backend. Ensure the backend server is running and the `.env` variables (such as `VITE_API_URL`) are configured correctly.
