
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
      // Use wasm instead of webgpu based on the error message
      device: 'wasm'
    });
  }
  return classifierPromise;
};

// Convert any image to a canvas element to normalize the format
const imageToCanvas = async (imageSource: string | HTMLImageElement | HTMLCanvasElement | Blob): Promise<HTMLCanvasElement> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Failed to create canvas context');
  }

  let img: HTMLImageElement;

  if (imageSource instanceof HTMLImageElement) {
    img = imageSource;
  } else if (imageSource instanceof HTMLCanvasElement) {
    return imageSource;
  } else if (imageSource instanceof Blob) {
    img = await loadImage(imageSource);
  } else if (typeof imageSource === 'string') {
    img = await new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Failed to load image from URL'));
      image.src = imageSource;
    });
  } else {
    throw new Error('Unsupported image source type');
  }

  // Set canvas dimensions to match the image
  canvas.width = img.width;
  canvas.height = img.height;
  
  // Draw the image onto the canvas
  ctx.drawImage(img, 0, 0);
  
  return canvas;
};

export const recognizeImage = async (
  imageSource: string | HTMLImageElement | HTMLCanvasElement | Blob
): Promise<ImageRecognitionResult> => {
  try {
    console.log("Starting image recognition...");
    const startTime = performance.now();
    
    // Convert image to canvas format
    const canvas = await imageToCanvas(imageSource);
    
    // Initialize classifier if needed
    const classifier = await initializeClassifier();
    
    // Process the image
    const result = await classifier(canvas);
    
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

export const loadImage = (file: File | Blob): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};
