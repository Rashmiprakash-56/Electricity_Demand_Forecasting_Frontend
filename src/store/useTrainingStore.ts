import { create } from 'zustand';
import { predictionService } from '../api/predictionService';

interface TrainingStatus {
  status: 'queued' | 'training' | 'completed' | 'failed';
  progress: number;
  message: string;
  started_at?: string;
  completed_at?: string;
  failed_at?: string;
  error?: string;
}

interface TrainingStore {
  isTraining: boolean;
  currentTaskId: string | null;
  trainingStatus: TrainingStatus | null;
  pollingIntervalId: ReturnType<typeof setInterval> | null;

  startTraining: (taskId: string) => void;
  setTrainingStatus: (status: TrainingStatus | null) => void;
  clearTraining: () => void;
  startPolling: (taskId: string) => void;
  stopPolling: () => void;
}

export const useTrainingStore = create<TrainingStore>((set, get) => ({
  isTraining: false,
  currentTaskId: null,
  trainingStatus: null,
  pollingIntervalId: null,

  startTraining: (taskId: string) => {
    set({
      isTraining: true,
      currentTaskId: taskId,
      trainingStatus: null,
    });
    get().startPolling(taskId);
  },

  setTrainingStatus: (status: TrainingStatus | null) => {
    set({ trainingStatus: status });
  },

  clearTraining: () => {
    get().stopPolling();
    set({
      isTraining: false,
      currentTaskId: null,
      trainingStatus: null,
    });
  },

  startPolling: (taskId: string) => {
    // Stop any existing polling
    get().stopPolling();

    const poll = async () => {
      try {
        const status = await predictionService.getTrainingStatus(taskId);
        set({ trainingStatus: status });

        if (status.status === 'completed' || status.status === 'failed') {
          set({ isTraining: false });
          get().stopPolling();
        }
      } catch (error) {
        console.error('Error fetching training status:', error);
      }
    };

    // Initial poll
    poll();

    // Set up polling interval
    const intervalId = setInterval(poll, 1000); // Poll every 1 second
    set({ pollingIntervalId: intervalId });
  },

  stopPolling: () => {
    const { pollingIntervalId } = get();
    if (pollingIntervalId) {
      clearInterval(pollingIntervalId);
      set({ pollingIntervalId: null });
    }
  },
}));
