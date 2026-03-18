import * as React from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { predictionService } from '../api/predictionService';
import { usePredictionStore } from '../store/usePredictionStore';
import { type Dispatch, type SetStateAction } from 'react';
import type { LogEntry } from './dashboard/Dashboard';

interface PDatePickerProps {
  setShowCharts: Dispatch<SetStateAction<boolean | null>>;
  setLogs: Dispatch<SetStateAction<LogEntry[]>>;
}

const MIN_DATE = dayjs('2018-04-01');
const MAX_DATE = dayjs('2018-12-30');

function nowTs() {
  return new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function PDatePicker({ setShowCharts, setLogs }: PDatePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(null);
  const [loading, setLoading] = React.useState(false);
  const { setPredictionData } = usePredictionStore();

  const addLog = (message: string, level: LogEntry['level'] = 'info') => {
    setLogs((prev) => [...prev, { timestamp: nowTs(), level, message }]);
  };

  const handlePredict = async () => {
    if (!selectedDate) return;

    const dateString = { filter_date: selectedDate.format('YYYY-MM-DD') };
    setLoading(true);
    setShowCharts(false);

    // Clear old logs and start fresh
    setLogs([]);

    addLog(`Starting prediction for ${selectedDate.format('YYYY-MM-DD')}`, 'info');
    addLog('Validating date range (Apr–Dec 2018)…', 'info');
    addLog('Sending request to /model/predict…', 'info');

    const start = performance.now();

    try {
      const response = await predictionService.predict(dateString);
      const elapsed = ((performance.now() - start) / 1000).toFixed(2);

      addLog(`Received response in ${elapsed}s`, 'success');
      addLog(`Forecast date: ${response.PredictedDate}`, 'info');
      addLog(`MAPE: ${Number(response.mape).toFixed(4)}%`, 'info');
      addLog(`DemandDetails rows: ${response.DemandDetails?.length ?? 0}`, 'info');
      addLog('Computing SHAP values (local + global)…', 'info');
      addLog(
        `Global SHAP features: ${response.shap_values?.global?.length ?? 0}`,
        'info'
      );
      addLog(
        `Local SHAP samples: ${response.shap_values?.local?.length ?? 0}`,
        'info'
      );

      setPredictionData({
        localShap: response.shap_values.local,
        globalShap: response.shap_values.global,
        Mape: response.mape,
        DemandDetails: response.DemandDetails,
        PredictedDate: response.PredictedDate,
        Predicted: true,
      });

      addLog('Prediction complete — charts rendered ✔', 'success');
      setShowCharts(true);
    } catch (error: any) {
      const elapsed = ((performance.now() - start) / 1000).toFixed(2);
      addLog(`Request failed after ${elapsed}s`, 'error');
      addLog(
        error?.response?.data?.detail ?? error?.message ?? 'Unknown error',
        'error'
      );
      console.error('Prediction error:', error);
      setShowCharts(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ maxWidth: 300 }}>
        <DatePicker
          label="Select Date"
          format="YYYY/MM/DD"
          value={selectedDate}
          minDate={MIN_DATE}
          maxDate={MAX_DATE}
          onChange={(newValue) => setSelectedDate(newValue)}
          slotProps={{
            textField: {
              fullWidth: true,
              margin: 'normal',
            },
          }}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          disabled={!selectedDate || loading}
          onClick={handlePredict}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          {loading ? 'Predicting…' : 'Predict'}
        </Button>
      </Box>
    </LocalizationProvider>
  );
}
