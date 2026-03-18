export interface PredictionRequest {
  model_id: string;
  input_data: any;
  forecast_horizon: number;
}

export interface PredictionResponse {
  predictions: number[];
  timestamps: string[];
  model_id: string;
  confidence_intervals?: {
    lower: number[];
    upper: number[];
  };
}

export interface Model {
  id: string;
  name: string;
  type: string;
  created_at: string;
  metrics?: {
    mae: number;
    rmse: number;
    r2: number;
    mape: number;
  };
}

export interface ExplainabilityRequest {
  model_id: string;
  input_data: any;
  reference_data?: any;
  current_data?: any;
}