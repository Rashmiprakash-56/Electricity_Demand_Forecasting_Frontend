import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Paper, Typography } from "@mui/material";
import { type ShapGlobal, type ShapLocal } from "../types/common";
import type { Key } from "react";

export const ShapWaterfallChart = ({ hourData }: ShapLocal) => {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle1" fontWeight={600}>
        SHAP Waterfall - Hour {hourData.hour}
      </Typography>

      <Typography variant="caption" color="text.secondary">
        Base value → feature contributions → prediction
      </Typography>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={hourData.contributions}
          layout="vertical"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="feature" type="category" width={180} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(v: number) => v.toFixed(2)} />

          <Bar dataKey="value">
            {hourData.contributions.map((c: { value: number; }, i: Key | null | undefined) => (
              <Cell
                key={i}
                fill={c.value >= 0 ? "#dc2626" : "#2563eb"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <Typography variant="body2" sx={{ mt: 1 }}>
        Base: {hourData.base_value.toFixed(0)} → Prediction:{" "}
        {hourData.prediction.toFixed(0)}
      </Typography>
    </Paper>
  );
};


export const ShapGlobalChart = ({ data }: { data: ShapGlobal[] }) => {
  const topFeatures = data.slice(0, 15); // important!

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle1" fontWeight={600}>
        Global SHAP Feature Importance
      </Typography>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={topFeatures}
          layout="vertical"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis
            dataKey="feature"
            type="category"
            width={180}
            tick={{ fontSize: 12 }}
          />
          <Tooltip formatter={(v: number) => v.toFixed(2)} />
          <Bar dataKey="mean_abs_shap" fill="#0ea5e9" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};




