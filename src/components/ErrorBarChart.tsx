import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from 'recharts';
import { Paper, Typography,Box } from '@mui/material';
import type { DemandTableProps } from '../types/common';


const CustomLegend = () => (
  <Box sx={{ display: 'flex', gap: 3 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box sx={{ width: 12, height: 12, bgcolor: '#dc2626' }} />
      <Typography variant="caption">
        (Predicted &gt; Actual)
      </Typography>
    </Box>

    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box sx={{ width: 12, height: 12, bgcolor: '#2563eb' }} />
      <Typography variant="caption">
        (Predicted &lt; Actual)
      </Typography>
    </Box>
  </Box>
);

const ErrorBarChart: React.FC<DemandTableProps> = ({ rows }) => {
  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 2,
        border: '1px solid #e2e8f0',
      }}
    >
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
        MAPE by Hour
      </Typography>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={rows}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="hour"
            label={{ value: 'Hour', position: 'insideBottom', offset: -5 }}
          />

          <YAxis
            label={{
              value: 'MAPE (%)',
              angle: -90,
              position: 'insideLeft',
            }}
          />

          <Tooltip
                    formatter={(value: number) => `${value.toFixed(2)} %`}
                    labelFormatter={(label) => `Hour: ${label}`}
                    />

          <Legend verticalAlign="top" align="right" content={<CustomLegend />} />
          <Bar dataKey="hourly_mape" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={800}>

            {rows.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.diff >= 0 ? '#a15959' : '#484cbd'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default ErrorBarChart;
