
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Alert,
  AlertTitle,
  Chip,
  CircularProgress,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  IconButton,
  LinearProgress,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  FlashOn as FlashOnIcon,
  Settings as SettingsIcon,
  TuneRounded as TuneIcon,
  PlayArrow as PlayArrowIcon,
  RestartAlt as RestartAltIcon,
  InfoOutlined as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  HourglassEmpty as HourglassEmptyIcon,
} from '@mui/icons-material';
import { predictionService } from '../api/predictionService';
import { useTrainingStore } from '../store/useTrainingStore';

interface ModelParams {
  objective: string;
  eval_metric: string;
  booster: string;
  seed: number;
  verbosity: number;
  eta_min: number;
  eta_max: number;
  max_depth_min: number;
  max_depth_max: number;
  subsample_min: number;
  subsample_max: number;
  colsample_bytree_min: number;
  colsample_bytree_max: number;
  lambda_min: number;
  lambda_max: number;
  alpha_min: number;
  alpha_max: number;
  n_estimators_min: number;
  n_estimators_max: number;
  early_stopping_rounds: number;
  n_trials: number;
}

const ModelTrainingPage: React.FC = () => {
  const [custom_params, setCustomParams] = useState<ModelParams>({
    objective: 'reg:squarederror',
    eval_metric: 'mape',
    booster: 'gbtree',
    seed: 42,
    verbosity: 0,
    eta_min: 0.01,
    eta_max: 0.3,
    max_depth_min: 3,
    max_depth_max: 10,
    subsample_min: 0.6,
    subsample_max: 1.0,
    colsample_bytree_min: 0.6,
    colsample_bytree_max: 1.0,
    lambda_min: 0.001,
    lambda_max: 10.0,
    alpha_min: 0.001,
    alpha_max: 10.0,
    n_estimators_min: 100,
    n_estimators_max: 1000,
    early_stopping_rounds: 30,
    n_trials: 2,
  });

  const { isTraining, currentTaskId, trainingStatus, startTraining } = useTrainingStore();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' as 'success' | 'error' | 'info' });
  const [showStatusDialog, setShowStatusDialog] = useState(false);

  // Watch for training completion to show snackbar
  useEffect(() => {
    if (trainingStatus?.status === 'completed') {
      setSnackbar({
        open: true,
        message: 'Model training completed successfully!',
        severity: 'success',
      });
    } else if (trainingStatus?.status === 'failed') {
      setSnackbar({
        open: true,
        message: 'Model training failed. Check the status for details.',
        severity: 'error',
      });
    }
  }, [trainingStatus?.status]);

  const handleInputChange = (field: keyof ModelParams, value: string | number) => {
    setCustomParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log('Training parameters:', custom_params);
      const response = await predictionService.train({ custom_params });

      startTraining(response.task_id);
      setShowStatusDialog(true);
      setSnackbar({
        open: true,
        message: 'Model training started successfully!',
        severity: 'info',
      });
    } catch (error) {
      console.error('Error starting training:', error);
      setSnackbar({
        open: true,
        message: 'Failed to start training. Please try again.',
        severity: 'error',
      });
    }
  };

  const resetToDefaults = () => {
    setCustomParams({
      objective: 'reg:squarederror',
      eval_metric: 'mape',
      booster: 'gbtree',
      seed: 42,
      verbosity: 0,
      eta_min: 0.01,
      eta_max: 0.3,
      max_depth_min: 3,
      max_depth_max: 10,
      subsample_min: 0.6,
      subsample_max: 1.0,
      colsample_bytree_min: 0.6,
      colsample_bytree_max: 1.0,
      lambda_min: 0.001,
      lambda_max: 10.0,
      alpha_min: 0.001,
      alpha_max: 10.0,
      n_estimators_min: 100,
      n_estimators_max: 1000,
      early_stopping_rounds: 30,
      n_trials: 2,
    });
  };

  const getStatusIcon = () => {
    if (!trainingStatus) return null;

    switch (trainingStatus.status) {
      case 'queued':
        return <HourglassEmptyIcon color="info" />;
      case 'training':
        return <CircularProgress size={24} />;
      case 'completed':
        return <CheckCircleIcon color="success" />;
      case 'failed':
        return <ErrorIcon color="error" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    if (!trainingStatus) return 'info';

    switch (trainingStatus.status) {
      case 'queued':
        return 'info';
      case 'training':
        return 'warning';
      case 'completed':
        return 'success';
      case 'failed':
        return 'error';
      default:
        return 'info';
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: { xs: 2, md: 4 },
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 4 },
            mb: 3,
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            color: 'white',
            borderRadius: 3,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={{ xs: 1.5, md: 2 }} mb={1}>
            <FlashOnIcon sx={{ fontSize: { xs: 32, md: 48 } }} />
            <Box>
              <Typography variant="h5" sx={{ fontSize: { xs: '1.2rem', md: '1.8rem' } }} fontWeight="bold">
                Electricity Demand Forecasting
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                Configure XGBoost hyperparameters and start model training with Optuna optimization
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Training Status Banner */}
        {isTraining && trainingStatus && (
          <Paper
            elevation={3}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 2,
              bgcolor: trainingStatus.status === 'completed' ? '#e8f5e9' : '#fff3e0',
            }}
          >
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={2}>
                {getStatusIcon()}
                <Box flex={1}>
                  <Typography variant="h6" fontWeight="600">
                    {trainingStatus.message}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Task ID: {currentTaskId}
                  </Typography>
                </Box>
                <Chip
                  label={trainingStatus.status.toUpperCase()}
                  color={getStatusColor()}
                  size="small"
                />
              </Stack>
              {trainingStatus.status === 'training' && (
                <LinearProgress
                  variant="indeterminate"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              )}
            </Stack>
          </Paper>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Fixed Parameters */}
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  backgroundColor: '#f5f5f5',
                  '&:hover': { backgroundColor: '#eeeeee' },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <SettingsIcon color="primary" />
                  <Typography variant="h6" fontWeight="600">
                    Fixed Parameters
                  </Typography>
                  <Chip label="Core Configuration" size="small" color="primary" />
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <Card variant="outlined">
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid size = {{xs : 12, sm :6}}>
                        <FormControl fullWidth>
                          <InputLabel>Objective</InputLabel>
                          <Select
                            value={custom_params.objective}
                            label="Objective"
                            onChange={(e) => handleInputChange('objective', e.target.value)}
                          >
                            <MenuItem value="reg:squarederror">Squared Error</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid size = {{xs : 12, sm :6}}>
                        <FormControl fullWidth>
                          <InputLabel>Evaluation Metric</InputLabel>
                          <Select
                            value={custom_params.eval_metric}
                            label="Evaluation Metric"
                            onChange={(e) => handleInputChange('eval_metric', e.target.value)}
                          >
                            <MenuItem value="mape">MAPE (Mean Absolute Percentage Error)</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid size = {{xs : 12, sm :6}}>
                        <FormControl fullWidth>
                          <InputLabel>Booster</InputLabel>
                          <Select
                            value={custom_params.booster}
                            label="Booster"
                            onChange={(e) => handleInputChange('booster', e.target.value)}
                          >
                            <MenuItem value="gbtree">GBTree (Gradient Boosted Tree)</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </AccordionDetails>
            </Accordion>

            {/* Hyperparameter Tuning Ranges */}
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  backgroundColor: '#f5f5f5',
                  '&:hover': { backgroundColor: '#eeeeee' },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <TuneIcon color="secondary" />
                  <Typography variant="h6" fontWeight="600">
                    Hyperparameter Tuning Ranges
                  </Typography>
                  <Chip label="Optuna Optimization" size="small" color="secondary" />
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={3}>
                  {/* Learning Rate (eta) */}
                  <Paper elevation={2} sx={{ p: 3, bgcolor: '#e3f2fd' }}>
                    <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                      <Typography variant="subtitle1" fontWeight="600">
                        Learning Rate (eta)
                      </Typography>
                      <Chip label="Log Scale" size="small" color="info" />
                      <Tooltip title="Controls the step size at each boosting iteration">
                        <IconButton size="small">
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                    <Grid container spacing={2}>
                      <Grid size = {{xs : 12, sm :6}}>
                        <TextField
                          fullWidth
                          label="Minimum"
                          type="number"
                          inputProps={{ step: 0.001 }}
                          value={custom_params.eta_min}
                          onChange={(e) => handleInputChange('eta_min', parseFloat(e.target.value))}
                        />
                      </Grid>
                      <Grid size = {{xs : 12, sm :6}}>
                        <TextField
                          fullWidth
                          label="Maximum"
                          type="number"
                          inputProps={{ step: 0.001 }}
                          value={custom_params.eta_max}
                          onChange={(e) => handleInputChange('eta_max', parseFloat(e.target.value))}
                        />
                      </Grid>
                    </Grid>
                  </Paper>

                  {/* Max Depth */}
                  <Paper elevation={2} sx={{ p: 3, bgcolor: '#f3e5f5' }}>
                    <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                      <Typography variant="subtitle1" fontWeight="600">
                        Max Depth
                      </Typography>
                      <Tooltip title="Maximum depth of a tree">
                        <IconButton size="small">
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                    <Grid container spacing={2}>
                      <Grid size = {{xs : 12, sm :6}}>
                        <TextField
                          fullWidth
                          label="Minimum"
                          type="number"
                          value={custom_params.max_depth_min}
                          onChange={(e) => handleInputChange('max_depth_min', parseInt(e.target.value))}
                        />
                      </Grid>
                      <Grid size = {{xs : 12, sm :6}}>
                        <TextField
                          fullWidth
                          label="Maximum"
                          type="number"
                          value={custom_params.max_depth_max}
                          onChange={(e) => handleInputChange('max_depth_max', parseInt(e.target.value))}
                        />
                      </Grid>
                    </Grid>
                  </Paper>

                  {/* Subsample */}
                  <Paper elevation={2} sx={{ p: 3, bgcolor: '#e8f5e9' }}>
                    <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                      <Typography variant="subtitle1" fontWeight="600">
                        Subsample
                      </Typography>
                      <Tooltip title="Fraction of samples used for fitting individual trees">
                        <IconButton size="small">
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                    <Grid container spacing={2}>
                      <Grid size = {{xs : 12, sm :6}}>
                        <TextField
                          fullWidth
                          label="Minimum"
                          type="number"
                          inputProps={{ step: 0.01, min: 0, max: 1 }}
                          value={custom_params.subsample_min}
                          onChange={(e) => handleInputChange('subsample_min', parseFloat(e.target.value))}
                        />
                      </Grid>
                      <Grid size = {{xs : 12, sm :6}}>
                        <TextField
                          fullWidth
                          label="Maximum"
                          type="number"
                          inputProps={{ step: 0.01, min: 0, max: 1 }}
                          value={custom_params.subsample_max}
                          onChange={(e) => handleInputChange('subsample_max', parseFloat(e.target.value))}
                        />
                      </Grid>
                    </Grid>
                  </Paper>

                  {/* Column Sample by Tree */}
                  <Paper elevation={2} sx={{ p: 3, bgcolor: '#fff3e0' }}>
                    <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                      <Typography variant="subtitle1" fontWeight="600">
                        Column Sample by Tree
                      </Typography>
                      <Tooltip title="Fraction of features used when constructing each tree">
                        <IconButton size="small">
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                    <Grid container spacing={2}>
                      <Grid size = {{xs : 12, sm :6}}>
                        <TextField
                          fullWidth
                          label="Minimum"
                          type="number"
                          inputProps={{ step: 0.01, min: 0, max: 1 }}
                          value={custom_params.colsample_bytree_min}
                          onChange={(e) => handleInputChange('colsample_bytree_min', parseFloat(e.target.value))}
                        />
                      </Grid>
                      <Grid size = {{xs : 12, sm :6}}>
                        <TextField
                          fullWidth
                          label="Maximum"
                          type="number"
                          inputProps={{ step: 0.01, min: 0, max: 1 }}
                          value={custom_params.colsample_bytree_max}
                          onChange={(e) => handleInputChange('colsample_bytree_max', parseFloat(e.target.value))}
                        />
                      </Grid>
                    </Grid>
                  </Paper>

                  {/* Lambda (L2 Regularization) */}
                  <Paper elevation={2} sx={{ p: 3, bgcolor: '#fce4ec' }}>
                    <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                      <Typography variant="subtitle1" fontWeight="600">
                        Lambda (L2 Regularization)
                      </Typography>
                      <Chip label="Log Scale" size="small" color="error" />
                      <Tooltip title="L2 regularization term on weights">
                        <IconButton size="small">
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                    <Grid container spacing={2}>
                      <Grid size = {{xs : 12, sm :6}}>
                        <TextField
                          fullWidth
                          label="Minimum"
                          type="number"
                          inputProps={{ step: 0.001 }}
                          value={custom_params.lambda_min}
                          onChange={(e) => handleInputChange('lambda_min', parseFloat(e.target.value))}
                        />
                      </Grid>
                      <Grid size = {{xs : 12, sm :6}}>
                        <TextField
                          fullWidth
                          label="Maximum"
                          type="number"
                          inputProps={{ step: 0.001 }}
                          value={custom_params.lambda_max}
                          onChange={(e) => handleInputChange('lambda_max', parseFloat(e.target.value))}
                        />
                      </Grid>
                    </Grid>
                  </Paper>

                  {/* Alpha (L1 Regularization) */}
                  <Paper elevation={2} sx={{ p: 3, bgcolor: '#e0f2f1' }}>
                    <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                      <Typography variant="subtitle1" fontWeight="600">
                        Alpha (L1 Regularization)
                      </Typography>
                      <Chip label="Log Scale" size="small" color="success" />
                      <Tooltip title="L1 regularization term on weights">
                        <IconButton size="small">
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                    <Grid container spacing={2}>
                      <Grid size = {{xs : 12, sm :6}}>
                        <TextField
                          fullWidth
                          label="Minimum"
                          type="number"
                          inputProps={{ step: 0.001 }}
                          value={custom_params.alpha_min}
                          onChange={(e) => handleInputChange('alpha_min', parseFloat(e.target.value))}
                        />
                      </Grid>
                      <Grid size = {{xs : 12, sm :6}}>
                        <TextField
                          fullWidth
                          label="Maximum"
                          type="number"
                          inputProps={{ step: 0.001 }}
                          value={custom_params.alpha_max}
                          onChange={(e) => handleInputChange('alpha_max', parseFloat(e.target.value))}
                        />
                      </Grid>
                    </Grid>
                  </Paper>

                  {/* Number of Estimators */}
                  <Paper elevation={2} sx={{ p: 3, bgcolor: '#ede7f6' }}>
                    <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                      <Typography variant="subtitle1" fontWeight="600">
                        Number of Estimators
                      </Typography>
                      <Tooltip title="Number of boosting rounds">
                        <IconButton size="small">
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                    <Grid container spacing={2}>
                      <Grid size = {{xs : 12, sm :6}}>
                        <TextField
                          fullWidth
                          label="Minimum"
                          type="number"
                          value={custom_params.n_estimators_min}
                          onChange={(e) => handleInputChange('n_estimators_min', parseInt(e.target.value))}
                        />
                      </Grid>
                      <Grid size = {{xs : 12, sm :6}}>
                        <TextField
                          fullWidth
                          label="Maximum"
                          type="number"
                          value={custom_params.n_estimators_max}
                          onChange={(e) => handleInputChange('n_estimators_max', parseInt(e.target.value))}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Stack>
              </AccordionDetails>
            </Accordion>

            {/* Training Configuration */}
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  backgroundColor: '#f5f5f5',
                  '&:hover': { backgroundColor: '#eeeeee' },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <PlayArrowIcon color="success" />
                  <Typography variant="h6" fontWeight="600">
                    Training Configuration
                  </Typography>
                  <Chip label="Execution Settings" size="small" color="success" />
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <Card variant="outlined">
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid size = {{xs : 12, sm :6}}>
                        <TextField
                          fullWidth
                          label="Early Stopping Rounds"
                          type="number"
                          value={custom_params.early_stopping_rounds}
                          onChange={(e) => handleInputChange('early_stopping_rounds', parseInt(e.target.value))}
                          helperText="Stop training if no improvement after N rounds"
                        />
                      </Grid>
                      <Grid size = {{xs : 12, sm :6}}>
                        <TextField
                          fullWidth
                          label="Number of Optuna Trials"
                          type="number"
                          value={custom_params.n_trials}
                          onChange={(e) => handleInputChange('n_trials', parseInt(e.target.value))}
                          helperText="Number of hyperparameter optimization trials"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </AccordionDetails>
            </Accordion>

            {/* Info Alert */}
            <Alert severity="info" icon={<InfoIcon />}>
              <AlertTitle>Optuna Hyperparameter Optimization</AlertTitle>
              Optuna will intelligently search within the specified ranges to find the optimal hyperparameters.
              Parameters marked with "Log Scale" will be sampled logarithmically for better exploration of the search space.
            </Alert>

            {/* Action Buttons */}
            <Paper elevation={3} sx={{ p: { xs: 2, md: 3 } }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  size="large"
                  fullWidth
                  startIcon={<RestartAltIcon />}
                  onClick={resetToDefaults}
                  disabled={isTraining}
                  sx={{ minWidth: 0 }}
                >
                  Reset to Defaults
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={isTraining ? <CircularProgress size={20} color="inherit" /> : <PlayArrowIcon />}
                  disabled={isTraining}
                  sx={{
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    px: { xs: 2, md: 4 },
                    minWidth: 0,
                  }}
                >
                  {isTraining ? 'Training...' : 'Start Training'}
                </Button>
              </Stack>
            </Paper>
          </Stack>
        </form>

        {/* Status Dialog */}
        <Dialog
          open={showStatusDialog}
          onClose={() => setShowStatusDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Stack direction="row" alignItems="center" spacing={2}>
              {getStatusIcon()}
              <Typography variant="h6">Training Status</Typography>
            </Stack>
          </DialogTitle>
          <DialogContent>
            {trainingStatus && (
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Status
                  </Typography>
                  <Chip
                    label={trainingStatus.status.toUpperCase()}
                    color={getStatusColor()}
                  />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Message
                  </Typography>
                  <Typography>{trainingStatus.message}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Task ID
                  </Typography>
                  <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                    {currentTaskId}
                  </Typography>
                </Box>
                {trainingStatus.error && (
                  <Alert severity="error">
                    <AlertTitle>Error Details</AlertTitle>
                    <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                      {trainingStatus.error}
                    </Typography>
                  </Alert>
                )}
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowStatusDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default ModelTrainingPage;
