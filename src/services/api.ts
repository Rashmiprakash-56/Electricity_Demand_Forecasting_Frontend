import axios, {type AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Handle 401 errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await this.api.post('/api/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  }

  async register(data: { email: string; password: string; name?: string }) {
    const response = await this.api.post('/api/auth/register', data);
    return response.data;
  }

  async getCurrentUser() {
    const response = await this.api.get('/api/auth/me');
    return response.data;
  }

  // Prediction endpoints
  async predict(data: any) {
    const response = await this.api.post('/api/predict/', data);
    return response.data;
  }

  async getAvailableModels() {
    const response = await this.api.get('/api/predict/models');
    return response.data;
  }

  async batchPredict(requests: any[]) {
    const response = await this.api.post('/api/predict/batch', requests);
    return response.data;
  }

  // Training endpoints
  async trainModel(data: any) {
    const response = await this.api.post('/api/training/train', data);
    return response.data;
  }

  async getTrainingStatus(jobId: number) {
    const response = await this.api.get(`/api/training/status/${jobId}`);
    return response.data;
  }

  async listTrainingJobs() {
    const response = await this.api.get('/api/training/jobs');
    return response.data;
  }

  // Explainability endpoints
  async getShapValues(data: any) {
    const response = await this.api.post('/api/explain/shap', data);
    return response.data;
  }

  async getFeatureImportance(data: any) {
    const response = await this.api.post('/api/explain/feature-importance', data);
    return response.data;
  }

  async getEvidentlyReport(data: any) {
    const response = await this.api.post('/api/explain/evidently-report', data);
    return response.data;
  }
}

export const apiService = new ApiService();
export const explainabilityService = apiService;
export const predictionService = apiService;