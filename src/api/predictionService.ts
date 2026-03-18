import api from './axios';

export const predictionService = {
  // Make predictions
  predict: async (data: any) => {
    const response = await api.post('/model/predict', data);
    return response.data;
  },

  // Start training (returns task_id)
  train: async (data: any) => {
    const response = await api.post('/model/train', data);
    return response.data;
  },

  // Get training status by task ID
  getTrainingStatus: async (taskId: string) => {
    const response = await api.get(`/model/train/status/${taskId}`);
    return response.data;
  },

  // Get all training history
  getTrainingHistory: async () => {
    const response = await api.get('/model/train/history');
    return response.data;
  },
};