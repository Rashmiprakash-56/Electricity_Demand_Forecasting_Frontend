import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Dataset as DatasetIcon,
  Insights as InsightsIcon,
  TrendingUp as TrendingUpIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  CleaningServices as CleanIcon,
  MergeType as MergeIcon,
  Thermostat as ThermostatIcon,
  BoltOutlined as BoltIcon,
  AccessTime as TimeIcon,
  Psychology as PsychologyIcon,
  Tune as TuneIcon,
  Analytics as AnalyticsIcon,
  AccountTree as TreeIcon,
  Speed as SpeedIcon,
  Storage as StorageIcon,
  Check as CheckIcon,
  Science as ScienceIcon,
  AutoGraph as AutoGraphIcon,
} from '@mui/icons-material';

interface DatasetStats {
  rows: string;
  columns: number;
  timespan: string;
  frequency: string;
  location: string;
  size: string;
}

interface DataColumn {
  name: string;
  type: string;
  description: string;
}

interface EDAStep {
  icon: React.ReactElement;
  title: string;
  description: string;
  details: string[];
  color: string;
}

interface ModelStep {
  icon: React.ReactElement;
  title: string;
  description: string;
  details: string[];
  chipLabel: string;
  chipColor: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
}

const DatasetOverviewPage: React.FC = () => {
  const datasetStats: DatasetStats = {
    rows: '~35,000+',
    columns: 29,
    timespan: '2015 - 2018',
    frequency: 'Hourly',
    location: 'Spain',
    size: '7.9 MB',
  };

  const keyColumns: DataColumn[] = [
    { name: 'time', type: 'datetime', description: 'Timestamp of the observation' },
    { name: 'generation biomass', type: 'float', description: 'Biomass energy generation (MW)' },
    { name: 'generation fossil brown coal/lignite', type: 'float', description: 'Brown coal generation (MW)' },
    { name: 'generation fossil gas', type: 'float', description: 'Natural gas generation (MW)' },
    { name: 'generation hydro pumped storage consumption', type: 'float', description: 'Pumped storage consumption (MW)' },
    { name: 'generation hydro run-of-river and poundage', type: 'float', description: 'Run-of-river hydro (MW)' },
    { name: 'generation hydro water reservoir', type: 'float', description: 'Reservoir hydro (MW)' },
    { name: 'generation nuclear', type: 'float', description: 'Nuclear generation (MW)' },
    { name: 'generation solar', type: 'float', description: 'Solar energy generation (MW)' },
    { name: 'generation wind onshore', type: 'float', description: 'Wind energy generation (MW)' },
    { name: 'forecast solar day ahead', type: 'float', description: 'Next-day solar forecast (MW)' },
    { name: 'forecast wind onshore day ahead', type: 'float', description: 'Next-day wind forecast (MW)' },
    { name: 'total load forecast', type: 'float', description: 'Forecasted energy demand (MW)' },
    { name: 'total load actual', type: 'float', description: 'Actual energy demand (MW)' },
    { name: 'price day ahead', type: 'float', description: 'Day-ahead electricity price (EUR/MWh)' },
    { name: 'price actual', type: 'float', description: 'Actual electricity price (EUR/MWh)' },
    { name: 'temp', type: 'float', description: 'Temperature (°C)' },
    { name: 'pressure', type: 'float', description: 'Atmospheric pressure (hPa)' },
    { name: 'humidity', type: 'float', description: 'Relative humidity (%)' },
    { name: 'wind_speed', type: 'float', description: 'Wind speed (m/s)' },
    { name: 'wind_deg', type: 'float', description: 'Wind direction (degrees)' },
    { name: 'rain_1h', type: 'float', description: 'Rainfall in last hour (mm)' },
    { name: 'weather_main', type: 'string', description: 'Main weather condition' },
  ];

  const edaSteps: EDAStep[] = [
    {
      icon: <CleanIcon />,
      title: 'Data Cleaning & Deduplication',
      description: 'Removing duplicates, sorting by datetime, and resetting indices for both energy and weather datasets.',
      details: [
        'Energy data: Deduplicated on datetime column, keeping last occurrence',
        'Weather data: Deduplicated on (datetime, city_name) pairs',
        'Both datasets sorted chronologically and indices reset',
        'Datetime columns converted to UTC-aware timestamps using pd.to_datetime(utc=True)',
      ],
      color: '#e3f2fd',
    },
    {
      icon: <ThermostatIcon />,
      title: 'Weather Outlier Treatment',
      description: 'Domain-specific clipping applied to weather parameters to remove physically impossible values.',
      details: [
        'Temperature: Clipped to [-40°C, 55°C] for temp, temp_min, temp_max',
        'Pressure: Clipped to [870, 1085] hPa — valid atmospheric range',
        'Humidity: Clipped to [0%, 100%]',
        'Wind speed: Clipped to [1st, 99th] percentile (data-driven bounds)',
        'Wind direction: Clipped to [0°, 360°]',
        'Rain/Snow: Clipped lower bound to 0 (no negatives)',
        'Cloud cover: Clipped to [0%, 100%]',
      ],
      color: '#fff3e0',
    },
    {
      icon: <BoltIcon />,
      title: 'Demand Data Processing',
      description: 'Handling missing energy load values and dropping non-informative columns.',
      details: [
        'Numeric columns coerced to numbers and NaN filled with 0',
        'Zero "total load actual" values are replaced with "total load forecast" as fallback',
        'Columns that are entirely zero (or entirely NaN for non-numeric) are dropped',
        'Ensures the target variable has no missing gaps for model training',
      ],
      color: '#fce4ec',
    },
    {
      icon: <MergeIcon />,
      title: 'City-wise Weather Splitting & Merge',
      description: 'Weather data split by 5 Spanish cities and then merged with energy data on datetime.',
      details: [
        'Weather split for: Valencia, Madrid, Bilbao, Barcelona, Seville',
        'Each city\'s weather columns are prefixed (e.g., madrid_temp, bilbao_humidity)',
        'City-specific DataFrames concatenated along datetime index',
        'Final merge: Energy ⟕ Weather on datetime (inner join)',
        'Non-target columns (generation, price, forecast) are dropped post-merge',
      ],
      color: '#e8f5e9',
    },
    {
      icon: <AnalyticsIcon />,
      title: 'Null & Zero Column Analysis',
      description: 'Systematic identification and removal of non-informative feature columns.',
      details: [
        'Numeric columns that are entirely 0.0 across all rows are identified and dropped',
        'Non-numeric columns that are entirely NaN are identified and dropped',
        'This reduces noise and dimensionality before feature engineering',
        'Applied independently to both energy and weather DataFrames',
      ],
      color: '#f3e5f5',
    },
  ];

  const modelSteps: ModelStep[] = [
    {
      icon: <TimeIcon />,
      title: 'Time-Based Feature Engineering',
      description: 'Extracting temporal signals from datetime to capture daily and seasonal patterns.',
      details: [
        'Basic features: hour, day_of_week, month, day_of_year, day_of_month, week_of_year',
        'Weekend flag: is_weekend (binary: Saturday/Sunday = 1)',
        'Cyclical encoding: hour_sin, hour_cos (period=24) — captures smooth hour transitions',
        'Cyclical encoding: month_sin, month_cos (period=12) — captures seasonal continuity',
        'Formula: sin(2π × value / period) and cos(2π × value / period)',
      ],
      chipLabel: 'Feature Engineering',
      chipColor: 'primary',
    },
    {
      icon: <AutoGraphIcon />,
      title: 'Lag Feature Creation',
      description: 'Adding historical demand values as features to capture temporal autocorrelation.',
      details: [
        'lag1: Total load actual shifted by 24 hours (same hour yesterday)',
        'lag7: Total load actual shifted by 168 hours (same hour last week)',
        'Captures daily and weekly periodicity in electricity demand',
        'NaN values from shifting filled with 0, remaining NaN rows dropped',
      ],
      chipLabel: 'Lag Features',
      chipColor: 'secondary',
    },
    {
      icon: <ScienceIcon />,
      title: 'Time-Based Target Encoding',
      description: 'Bayesian smoothed encoding with temporal cross-validation to prevent data leakage.',
      details: [
        'Categorical columns: weather_id, weather_main, weather_description, weather_icon (per city)',
        'Uses 5-fold time-based splits — only past data encodes future categories',
        'Bayesian smoothing: encoded = (count × mean + smoothing × global_mean) / (count + smoothing)',
        'Smoothing parameter = 10, prevents overfitting for rare categories',
        'First fold uses global mean (no prior data available)',
        'Final encoding map fitted on 80% of the data for production use',
      ],
      chipLabel: 'Encoding',
      chipColor: 'warning',
    },
    {
      icon: <TreeIcon />,
      title: 'XGBoost Regression Model',
      description: 'Gradient-boosted decision trees as the core prediction model.',
      details: [
        'Objective: reg:squarederror — L2 loss for regression',
        'Evaluation metric: MAPE (Mean Absolute Percentage Error)',
        'Booster: gbtree (tree-based ensemble)',
        'Default params: eta=0.3, max_depth=5, subsample=0.4, colsample_bytree=0.7',
        'Regularization: L1 (alpha=1) and L2 (lambda=1) to prevent overfitting',
        'Final model trained with XGBRegressor using best parameters from tuning',
      ],
      chipLabel: 'XGBoost',
      chipColor: 'success',
    },
    {
      icon: <TuneIcon />,
      title: 'Optuna Hyperparameter Tuning',
      description: 'Bayesian optimization to automatically find the best model configuration.',
      details: [
        'Tuned parameters: eta, max_depth, subsample, colsample_bytree, lambda, alpha, n_estimators',
        'User-configurable search ranges passed from frontend for each parameter',
        'Objective: minimize mean MAPE across 5-fold TimeSeriesSplit',
        'Early stopping rounds configurable (default: 30) to prevent overfitting per fold',
        'MedianPruner: Prunes unpromising trials after 10 warmup steps (when n_trials ≥ 10)',
        'Default trials: 50 (configurable) — balances search quality and compute time',
      ],
      chipLabel: 'Optuna',
      chipColor: 'info',
    },
    {
      icon: <SpeedIcon />,
      title: 'TimeSeriesSplit Cross-Validation',
      description: 'Expanding-window validation that respects temporal ordering of data.',
      details: [
        '5-fold TimeSeriesSplit — each fold uses all prior data for training',
        'Prevents future data leakage in validation — critical for time series',
        'Train/test split: 80% train / 20% test (chronological)',
        'Each fold independently encodes categoricals using fold-specific encoder (deepcopy)',
        'Final performance metric: mean MAPE across all folds',
      ],
      chipLabel: 'Validation',
      chipColor: 'primary',
    },
    {
      icon: <PsychologyIcon />,
      title: 'SHAP Explainability',
      description: 'TreeExplainer provides feature-level explanations for every prediction.',
      details: [
        'SHAP (SHapley Additive exPlanations) — game-theory-based feature attribution',
        'TreeExplainer: Exact, efficient computation for tree-based models',
        'Explainer is fitted immediately after training and saved alongside the model',
        'Each prediction returns per-feature SHAP values for interpretability',
        'Enables understanding of why demand is high/low on specific hours',
      ],
      chipLabel: 'SHAP',
      chipColor: 'error',
    },
    {
      icon: <StorageIcon />,
      title: 'Model Persistence & Deployment',
      description: 'Models and artifacts saved to HuggingFace Hub with local fallback.',
      details: [
        'Artifacts saved: trained_model.pkl, encoder.pkl, explainer.pkl',
        'Primary storage: HuggingFace Hub (versioned model repository)',
        'Fallback: Local filesystem (artifacts/ directory)',
        'Encoder persisted separately — required for inference on new data',
        'Explainer uses pickle serialization (required by SHAP)',
        'In-memory caching: processed DataFrame cached to avoid re-reading CSVs',
      ],
      chipLabel: 'Deployment',
      chipColor: 'secondary',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 2,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <DatasetIcon sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Dataset Overview
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, mt: 0.5 }}>
                Hourly Energy Consumption, Generation, Prices & Weather
              </Typography>
            </Box>
          </Stack>
          <Link
            href="https://www.kaggle.com/datasets/nicholasjhana/energy-consumption-generation-prices-and-weather"
            target="_blank"
            rel="noopener"
            sx={{ color: 'white', textDecoration: 'underline' }}
          >
            View on Kaggle
          </Link>
        </Paper>

        {/* Quick Stats */}
        <Grid container spacing={3} mb={4}>
          <Grid size = {{xs :6, sm: 4, md :2}}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Rows
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {datasetStats.rows}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size = {{xs :6, sm: 4, md :2}}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Columns
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {datasetStats.columns}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size = {{xs :6, sm: 4, md :2}}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Timespan
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {datasetStats.timespan}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size = {{xs :6, sm: 4, md :2}}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Frequency
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {datasetStats.frequency}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size = {{xs :6, sm: 4, md :2}}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Location
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {datasetStats.location}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size = {{xs :6, sm: 4, md :2}}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Size
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {datasetStats.size}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Dataset Description */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <InfoIcon color="primary" />
              <Typography variant="h6" fontWeight="600">
                About the Dataset
              </Typography>
            </Stack>
            <Typography variant="body1" paragraph>
              This dataset contains 4 years of electrical consumption, generation, pricing, and weather data 
              for Spain. The data is sampled hourly and includes various energy sources such as solar, wind, 
              hydro, nuclear, and fossil fuels, along with corresponding weather conditions.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              The dataset is particularly valuable for electricity demand forecasting, price prediction, 
              renewable energy analysis, and understanding the relationship between weather patterns and 
              energy consumption.
            </Typography>
          </CardContent>
        </Card>

        {/* Key Features */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Stack direction="row" spacing={1} alignItems="center" mb={3}>
              <DatasetIcon color="secondary" />
              <Typography variant="h6" fontWeight="600">
                Key Features
              </Typography>
            </Stack>

            <Grid container spacing={2}>
              {keyColumns.map((column, index) => (
                <Grid size= {{xs:12}} key={index}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: index % 2 === 0 ? '#f9fafb' : 'white',
                      borderRadius: 1,
                      borderLeft: '3px solid',
                      borderColor: 'primary.main',
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                      <Typography
                        variant="body2"
                        fontWeight="600"
                        sx={{ minWidth: '250px', fontFamily: 'monospace' }}
                      >
                        {column.name}
                      </Typography>
                      <Chip label={column.type} size="small" color="primary" variant="outlined" />
                      <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                        {column.description}
                      </Typography>
                    </Stack>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* EDA Section */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
              <InsightsIcon color="success" />
              <Typography variant="h6" fontWeight="600">
                Exploratory Data Analysis (EDA)
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" mb={3}>
              The preprocessing pipeline cleans, transforms, and merges the raw energy and weather datasets 
              into a model-ready format. Below are the key steps performed in the backend.
            </Typography>

            {edaSteps.map((step, index) => (
              <Accordion
                key={index}
                defaultExpanded={index === 0}
                sx={{
                  mb: 1,
                  '&:before': { display: 'none' },
                  boxShadow: 'none',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: '8px !important',
                  overflow: 'hidden',
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ bgcolor: step.color }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ color: 'text.secondary' }}>{step.icon}</Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="600">
                        {`${index + 1}. ${step.title}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {step.description}
                      </Typography>
                    </Box>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <List dense disablePadding>
                    {step.details.map((detail, i) => (
                      <ListItem key={i} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckIcon fontSize="small" color="success" />
                        </ListItemIcon>
                        <ListItemText
                          primary={detail}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))}
          </CardContent>
        </Card>

        {/* Modeling Approaches Section */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
              <TrendingUpIcon color="error" />
              <Typography variant="h6" fontWeight="600">
                Modeling Approaches
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" mb={3}>
              The forecasting pipeline uses XGBoost with Optuna-driven hyperparameter tuning, 
              time-aware validation, and SHAP-based model interpretability.
            </Typography>

            <Grid container spacing={3}>
              {modelSteps.map((step, index) => (
                <Grid size={{ xs: 12, md: 6 }} key={index}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 3,
                      height: '100%',
                      borderRadius: 2,
                      transition: 'box-shadow 0.2s, transform 0.2s',
                      '&:hover': {
                        boxShadow: 4,
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center" mb={1.5}>
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 1.5,
                          bgcolor: `${step.chipColor}.main`,
                          color: 'white',
                          display: 'flex',
                          '& .MuiSvgIcon-root': { fontSize: 22 },
                        }}
                      >
                        {step.icon}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight="600">
                          {step.title}
                        </Typography>
                      </Box>
                      <Chip
                        label={step.chipLabel}
                        size="small"
                        color={step.chipColor}
                        variant="outlined"
                      />
                    </Stack>

                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {step.description}
                    </Typography>

                    <Divider sx={{ mb: 1.5 }} />

                    <List dense disablePadding>
                      {step.details.map((detail, i) => (
                        <ListItem key={i} sx={{ py: 0.25, px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 28 }}>
                            <CheckIcon fontSize="small" sx={{ color: `${step.chipColor}.main` }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={detail}
                            primaryTypographyProps={{
                              variant: 'body2',
                              sx: { fontSize: '0.8rem' },
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Pipeline Summary */}
            <Paper
              sx={{
                mt: 4,
                p: 3,
                bgcolor: 'linear-gradient(135deg, #667eea08 0%, #764ba208 100%)',
                border: '1px solid',
                borderColor: 'primary.light',
                borderRadius: 2,
              }}
            >
              <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                📋 End-to-End Pipeline Summary
              </Typography>
              <Typography variant="body2" color="text.secondary" component="div">
                <Box component="ol" sx={{ pl: 2, '& li': { mb: 0.5 } }}>
                  <li>Load energy_dataset.csv and weather_features.csv from data directory</li>
                  <li>Clean & preprocess both datasets independently (duplicates, nulls, outliers)</li>
                  <li>Split weather data by city → prefix columns → merge with energy on datetime</li>
                  <li>Drop non-target columns (generation, forecast, price features)</li>
                  <li>Engineer time features (cyclical) and lag features (24h, 168h)</li>
                  <li>80/20 chronological train/test split</li>
                  <li>Time-based target encoding on categorical weather columns (Bayesian smoothed)</li>
                  <li>Optuna hyperparameter optimization with TimeSeriesSplit (5-fold) validation</li>
                  <li>Train final XGBoost model with best parameters</li>
                  <li>Fit SHAP TreeExplainer for prediction interpretation</li>
                  <li>Save model, encoder, and explainer to HuggingFace Hub (local fallback)</li>
                  <li>Predict with MAPE evaluation and per-feature SHAP attributions</li>
                </Box>
              </Typography>
            </Paper>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default DatasetOverviewPage;