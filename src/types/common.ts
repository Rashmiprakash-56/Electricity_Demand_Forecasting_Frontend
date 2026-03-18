import type { ReactNode } from 'react';

export type LayoutProps = {
  children: ReactNode;
};

export type DataCardProps = {
  title: string;
  value: number | string;
  unit?: string;
  loading?: boolean;
};

export type DemandRow = {
  hour: number;
  actual_demand: number;
  predicted_demand: number;
  diff: number; 
  hourly_mape: number;
};

export type DemandTableProps = {
  rows: DemandRow[];
};

export type Contribution = {
  feature: string;
  value: number;
};

export type SHAPProps = {
  hourData: {
    hour: number;
    base_value: number;
    prediction: number;
    contributions: Contribution[];
  };
};

export type GlobalShap = {
  feature: string;
  mean_abs_shap: number;
};

export type ShapGlobal = Record<string, any>;
export type ShapLocal = Record<string, any>;