import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Paper, Typography } from '@mui/material';
import {  type DemandTableProps } from '../types/common';


const DemandLineChart: React.FC<DemandTableProps> = ({ rows }) => {
  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 2,
        border: '1px solid #e2e8f0',
      }}
    >
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
        Actual vs Predicted Demand (24 Hours)
      </Typography>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={rows}>
          {/* GRID */}
          <CartesianGrid strokeDasharray="3 3" />

          {/* X & Y AXIS */}
          <XAxis
            dataKey="hour"
            domain={[1,24]}
            label={{ value: 'Hour', position: 'insideBottom', offset: -5 }}
          />
          <YAxis
            label={{
              value: 'Demand',
              angle: -90,
              position: 'insideLeft',
            }}
          />

          {/* TOOLTIP + LEGEND */}
          <Tooltip />
          <Legend />

          {/* ACTUAL DEMAND */}
          <Line
            type="monotone"
            dataKey="actual_demand"
            stroke="#2563eb" // 🔵 blue
            strokeWidth={2}
            dot={{r : 2}}
            name="Actual Demand"
            isAnimationActive={true}
          />

          {/* PREDICTED DEMAND */}
          <Line
            type="monotone"
            dataKey="predicted_demand"
            stroke="#dc2626" // 🔴 red
            strokeWidth={2}
            dot={{r : 2}}
            name="Predicted Demand"
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default DemandLineChart;
