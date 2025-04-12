
export interface Prediction {
  label: string;
  score: number;
}

export interface ImageRecognitionResult {
  predictions: Prediction[];
  processingTime?: number;
}
