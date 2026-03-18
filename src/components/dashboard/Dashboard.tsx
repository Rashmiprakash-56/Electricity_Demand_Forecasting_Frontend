import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Stack,
  Typography,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ElectricBolt as BoltIcon,
  Insights as InsightsIcon,
  DeleteSweep as ClearIcon,
  Terminal as TerminalIcon,
  CloseFullscreen as CollapseIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import PDatePicker from '../DatePicker';
import DataCard from '../Card';
import DemandLineChart from '../DemandLineChart';
import ErrorBarChart from '../ErrorBarChart';
import DemandTable from '../DataTable';
import { usePredictionStore } from '../../store/usePredictionStore';

export type LogEntry = {
  timestamp: string;
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
};

const logLevelColor: Record<LogEntry['level'], string> = {
  info:    '#64b5f6',
  success: '#81c784',
  warning: '#ffb74d',
  error:   '#e57373',
};

const logLevelPrefix: Record<LogEntry['level'], string> = {
  info:    '●',
  success: '✔',
  warning: '▲',
  error:   '✖',
};

const Dashboard: React.FC = () => {
  const [showCharts, setShowCharts] = useState<boolean | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [showLogs, setShowLogs] = useState(true);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const { DemandDetails, Mape, PredictedDate, Predicted, clearPredictionData } =
    usePredictionStore();
  const navigate = useNavigate();

  const hasPrediction = Predicted && DemandDetails.length > 0;
  const hasLogs = logs.length > 0;

  // Auto-scroll logs to bottom
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const handleClear = () => {
    clearPredictionData();
    setShowCharts(null);
    setLogs([]);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Page Header */}
      <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
        <BoltIcon sx={{ color: 'primary.main', fontSize: 28 }} />
        <Box>
          <Typography variant="h5" fontWeight={700} color="text.primary">
            Electricity Demand Forecast
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Select a date (Apr–Dec 2018) to see hourly prediction vs. actual demand
          </Typography>
        </Box>
      </Stack>

      {/* Top section: controls + logs side by side */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: hasLogs && showLogs ? { xs: '1fr', md: 'auto 1fr' } : '1fr',
          gap: 3,
          alignItems: 'start',
          mb: 3,
        }}
      >
        {/* Left: date picker + action buttons */}
        <Stack spacing={2} alignItems="flex-start">
          <PDatePicker setShowCharts={setShowCharts} setLogs={setLogs} />

          <Stack direction="row" spacing={1.5} flexWrap="wrap">
            {hasPrediction && (
              <Button
                variant="outlined"
                startIcon={<InsightsIcon />}
                onClick={() => navigate('/shap')}
                sx={{ height: 38, textTransform: 'none', whiteSpace: 'nowrap' }}
              >
                View SHAP Analysis
              </Button>
            )}

            {hasPrediction && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<ClearIcon />}
                onClick={handleClear}
                sx={{ height: 38, textTransform: 'none', whiteSpace: 'nowrap' }}
              >
                Clear Prediction
              </Button>
            )}

            {hasLogs && !showLogs && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<TerminalIcon />}
                onClick={() => setShowLogs(true)}
                sx={{ height: 38, textTransform: 'none', fontSize: 12 }}
              >
                Show Logs ({logs.length})
              </Button>
            )}
          </Stack>
        </Stack>

        {/* Right: Logs panel (only when there are logs and panel is visible) */}
        {hasLogs && showLogs && (
          <Paper
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              overflow: 'hidden',
              bgcolor: '#0d1117',
              maxHeight: 220,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Panel Header */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              px={2}
              py={1}
              sx={{ borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}
            >
              <TerminalIcon sx={{ fontSize: 14, color: '#64b5f6' }} />
              <Typography
                variant="caption"
                fontWeight={600}
                sx={{ color: '#c9d1d9', letterSpacing: 0.5, flex: 1, fontSize: 11 }}
              >
                PREDICTION LOGS
              </Typography>
              <Chip
                label={`${logs.length} entries`}
                size="small"
                sx={{
                  height: 16,
                  fontSize: 9,
                  bgcolor: 'rgba(100,181,246,0.15)',
                  color: '#64b5f6',
                  border: '1px solid rgba(100,181,246,0.3)',
                }}
              />
              <Tooltip title="Hide logs">
                <IconButton
                  size="small"
                  onClick={() => setShowLogs(false)}
                  sx={{ color: 'rgba(255,255,255,0.4)', '&:hover': { color: '#fff' }, p: 0.4 }}
                >
                  <CollapseIcon sx={{ fontSize: 13 }} />
                </IconButton>
              </Tooltip>
            </Stack>

            {/* Log Entries */}
            <Box
              sx={{
                overflowY: 'auto',
                flex: 1,
                px: 1.5,
                py: 0.5,
                fontFamily: '"Fira Code", "Cascadia Code", "Consolas", monospace',
                fontSize: 11,
                '&::-webkit-scrollbar': { width: 4 },
                '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
                '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.15)', borderRadius: 2 },
              }}
            >
              {logs.map((log, i) => (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    gap: 1,
                    py: 0.3,
                    alignItems: 'flex-start',
                  }}
                >
                  <Typography
                    component="span"
                    sx={{
                      color: 'rgba(139,148,158,0.7)',
                      fontSize: 10,
                      fontFamily: 'inherit',
                      minWidth: 65,
                      flexShrink: 0,
                      lineHeight: 1.6,
                    }}
                  >
                    {log.timestamp}
                  </Typography>
                  <Typography
                    component="span"
                    sx={{
                      color: logLevelColor[log.level],
                      fontSize: 11,
                      fontFamily: 'inherit',
                      flexShrink: 0,
                      lineHeight: 1.6,
                    }}
                  >
                    {logLevelPrefix[log.level]}
                  </Typography>
                  <Typography
                    component="span"
                    sx={{
                      color:
                        log.level === 'error'
                          ? '#e57373'
                          : log.level === 'success'
                          ? '#a8d5a2'
                          : '#c9d1d9',
                      fontSize: 11,
                      fontFamily: 'inherit',
                      lineHeight: 1.6,
                      wordBreak: 'break-word',
                    }}
                  >
                    {log.message}
                  </Typography>
                </Box>
              ))}
              <div ref={logsEndRef} />
            </Box>

            {/* Footer */}
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
            <Stack direction="row" justifyContent="flex-end" px={1.5} py={0.5} sx={{ flexShrink: 0 }}>
              <Button
                size="small"
                onClick={() => setLogs([])}
                sx={{
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.35)',
                  textTransform: 'none',
                  '&:hover': { color: '#e57373' },
                  minWidth: 0,
                  px: 1,
                }}
              >
                Clear logs
              </Button>
            </Stack>
          </Paper>
        )}
      </Box>

      {/* Main content area (full width) */}
      <Box>
        {/* Empty state */}
        {showCharts === null && !hasPrediction && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Pick a date and click <strong>Predict</strong> to generate a 24-hour forecast.
          </Alert>
        )}

        {/* Loading */}
        {showCharts === false && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 4 }}>
            <CircularProgress size={24} />
            <Typography variant="body2" color="text.secondary">
              Running prediction…
            </Typography>
          </Box>
        )}

        {/* Results */}
        {hasPrediction && (
          <Stack spacing={3}>
            {/* KPI Row */}
            <Grid container spacing={2}>
              <Grid size = {{xs :12, sm: 6, md :3}}>
                <DataCard title="Overall MAPE" value={`${Mape.toFixed(2)}`} unit="%" />
              </Grid>
               <Grid size = {{xs :12, sm: 6, md :3}}>
                <DataCard title="Hours Predicted" value={DemandDetails.length} unit="hrs" />
              </Grid>
              <Grid size = {{xs :12, sm: 6, md :3}}>
                <DataCard
                  title="Avg Actual Demand"
                  value={Math.round(
                    DemandDetails.reduce((s, r) => s + r.actual_demand, 0) / DemandDetails.length
                  ).toLocaleString()}
                  unit="MW"
                />
              </Grid>
               <Grid size = {{xs :12, sm: 6, md :3}}>
                <DataCard
                  title="Avg Predicted Demand"
                  value={Math.round(
                    DemandDetails.reduce((s, r) => s + r.predicted_demand, 0) / DemandDetails.length
                  ).toLocaleString()}
                  unit="MW"
                />
              </Grid>
            </Grid>

            {/* Prediction Date Badge */}
            {PredictedDate && (
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="body2" color="text.secondary">
                  Showing results for:
                </Typography>
                <Chip label={PredictedDate} color="primary" size="small" />
              </Stack>
            )}

            {/* Line Chart */}
            <DemandLineChart rows={DemandDetails} />

            {/* Bar Chart */}
            <ErrorBarChart rows={DemandDetails} />

            {/* Data Table */}
            <Box>
              <Typography variant="subtitle1" fontWeight={600} mb={1}>
                Hourly Detail
              </Typography>
              <DemandTable rows={DemandDetails} />
            </Box>

            {/* SHAP Link */}
            <Stack direction="row" justifyContent="flex-end">
              <Button
                variant="contained"
                startIcon={<InsightsIcon />}
                onClick={() => navigate('/shap')}
                sx={{ textTransform: 'none' }}
              >
                Explore SHAP Feature Explanations
              </Button>
            </Stack>
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;