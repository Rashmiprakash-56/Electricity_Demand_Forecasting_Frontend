import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
  Link,
} from '@mui/material';
import {
  Dataset as DatasetIcon,
  Insights as InsightsIcon,
  TrendingUp as TrendingUpIcon,
  Info as InfoIcon,
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

        {/* EDA & Modeling Approaches - Placeholder */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Stack direction="row" spacing={1} alignItems="center" mb={3}>
              <InsightsIcon color="success" />
              <Typography variant="h6" fontWeight="600">
                Exploratory Data Analysis (EDA)
              </Typography>
            </Stack>

            <Box
              sx={{
                p: 4,
                bgcolor: '#f9fafb',
                borderRadius: 2,
                border: '2px dashed',
                borderColor: 'divider',
                textAlign: 'center',
              }}
            >
              <Typography variant="body1" color="text.secondary">
                Your EDA insights and visualizations will be displayed here
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Include data distributions, correlations, time series patterns, seasonality analysis, etc.
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Modeling Approaches - Placeholder */}
        <Card>
          <CardContent>
            <Stack direction="row" spacing={1} alignItems="center" mb={3}>
              <TrendingUpIcon color="error" />
              <Typography variant="h6" fontWeight="600">
                Modeling Approaches
              </Typography>
            </Stack>

            <Box
              sx={{
                p: 4,
                bgcolor: '#f9fafb',
                borderRadius: 2,
                border: '2px dashed',
                borderColor: 'divider',
                textAlign: 'center',
              }}
            >
              <Typography variant="body1" color="text.secondary">
                Your modeling methodology and approaches will be documented here
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Include feature engineering, model selection, hyperparameter tuning, validation strategy, 
                performance metrics, etc.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default DatasetOverviewPage;