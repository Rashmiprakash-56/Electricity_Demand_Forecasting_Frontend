import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DemandRow, ShapGlobal, ShapLocal } from '../types/common';


type PredictionStore = {
  globalShap: ShapGlobal[];
  localShap: ShapLocal[];
  Mape: number;
  DemandDetails: DemandRow[];
  Predicted : boolean;
  PredictedDate : string;
  
  // Actions
  setGlobalShap: (data: ShapGlobal[]) => void;
  setLocalShap: (data: ShapLocal[]) => void;
  setMape: (value: number) => void;
  setDemandDetails: (data:  DemandRow[]) => void;
  setPredictionData: (data: {
    globalShap?: ShapGlobal[];
    localShap?: ShapLocal[];
    Mape?: number;
    DemandDetails?: DemandRow[];
    Predicted : true
    PredictedDate?: string
  }) => void;
  setPredictedDate : (value : string) => void;
  clearPredictionData: () => void;
};

export const usePredictionStore = create<PredictionStore>()(
  persist(
    (set) => ({
      // Initial state
      globalShap: [],
      localShap: [],
      Mape: 0,
      DemandDetails:  [] ,
      Predicted : false,
      PredictedDate : "",

      setGlobalShap: (globalShap) => set({ globalShap }),
      setLocalShap: (localShap) => set({ localShap }),
      setMape: (value) => set({ Mape: value }),
      setDemandDetails: (data) => set({ DemandDetails: data }),
      setPredictedDate : (value) => set({PredictedDate : value}),

      // Batch setter - update multiple values at once
      setPredictionData: (data) =>
        set((state) => ({
          globalShap: data.globalShap ?? state.globalShap,
          localShap: data.localShap ?? state.localShap,
          Mape: data.Mape ?? state.Mape,
          DemandDetails: data.DemandDetails ?? state.DemandDetails,
          PredictedDate: data.PredictedDate ?? state.PredictedDate,
          Predicted : true
        })),
      // Clear all data
      clearPredictionData: () => set({
        globalShap: [],
        localShap: [],
        Mape: 0,
        DemandDetails: [],
        Predicted : false,
        PredictedDate : ""
      }),
    }),
    {
      name: 'prediction-storage',
    }
  )
);