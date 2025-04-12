
import { pipeline, env } from '@huggingface/transformers';
import type { ImageRecognitionResult } from './types';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

// Define models we support
export const AVAILABLE_MODELS = {
  mobilenet: {
    id: "onnx-community/mobilenetv4_conv_small.e2400_r224_in1k",
    name: "MobileNetV4",
    description: "Lightweight model for general image classification"
  },
  resnet: {
    id: "microsoft/resnet-50",
    name: "ResNet-50",
    description: "Powerful model for detailed image classification"
  }
};

// Default model
export const DEFAULT_MODEL = AVAILABLE_MODELS.mobilenet.id;

// Initialize the classifier lazily
let classifierPromise: Promise<any> | null = null;

const initializeClassifier = async (modelId: string = DEFAULT_MODEL) => {
  if (!classifierPromise) {
    console.log(`Initializing image classifier with model: ${modelId}`);
    classifierPromise = pipeline('image-classification', modelId, {
      quantized: true, 
      device: 'webgpu'
    });
  }
  return classifierPromise;
};

export const recognizeImage = async (
  imageSource: string | HTMLImageElement | HTMLCanvasElement | Blob
): Promise<ImageRecognitionResult> => {
  try {
    console.log("Starting image recognition...");
    const startTime = performance.now();
    
    // Initialize classifier if needed
    const classifier = await initializeClassifier();
    
    // Process the image
    const result = await classifier(imageSource);
    
    const processingTime = performance.now() - startTime;
    console.log(`Recognition completed in ${processingTime.toFixed(0)}ms`);
    
    return {
      predictions: result.map((item: any) => ({
        label: item.label,
        score: item.score
      })),
      processingTime
    };
  } catch (error) {
    console.error("Error during image recognition:", error);
    throw new Error(`Image recognition failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const loadImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};
