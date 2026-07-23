import { create } from 'zustand';

export const WORKSPACE_STEPS = {
  UPLOAD: 'upload',
  STRATEGY: 'strategy',
  WRITING: 'writing',
  EVALUATING: 'evaluating',
  FEEDBACK: 'feedback',
};

const initialState = {
  step: WORKSPACE_STEPS.UPLOAD,

  // Upload
  imageFile: null,
  imageUrl: null,
  isUploading: false,

  // Strategy (Claude vision pre-computation)
  hints: null,
  sampleAnswer: null,
  isGeneratingStrategy: false,
  hintsVisible: false,

  // Essay editor
  essayText: '',
  sessionStartedAt: null,

  // Evaluation
  evaluation: null, // { overallBand, criteria: { taskAchievement, coherenceCohesion, lexicalResource, grammaticalRange }, feedback }
  isEvaluating: false,

  // Notes / save
  notes: '',
  error: null,
};

export const useWorkspaceStore = create((set) => ({
  ...initialState,

  setStep: (step) => set({ step }),

  setImage: (imageFile, imageUrl) => set({ imageFile, imageUrl }),
  setIsUploading: (isUploading) => set({ isUploading }),

  setStrategy: ({ hints, sampleAnswer }) =>
    set({ hints, sampleAnswer, isGeneratingStrategy: false, step: WORKSPACE_STEPS.STRATEGY }),
  setIsGeneratingStrategy: (isGeneratingStrategy) => set({ isGeneratingStrategy }),
  toggleHintsVisible: () => set((state) => ({ hintsVisible: !state.hintsVisible })),

  setEssayText: (essayText) => set({ essayText }),
  startSession: () => set({ sessionStartedAt: Date.now(), step: WORKSPACE_STEPS.WRITING }),

  setIsEvaluating: (isEvaluating) => set({ isEvaluating }),
  setEvaluation: (evaluation) =>
    set({ evaluation, isEvaluating: false, step: WORKSPACE_STEPS.FEEDBACK }),

  setNotes: (notes) => set({ notes }),
  setError: (error) => set({ error }),

  resetWorkspace: () => set(initialState),
}));
