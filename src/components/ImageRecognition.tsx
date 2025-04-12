
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import ImageUploader from './ImageUploader';
import PredictionResults from './PredictionResults';
import { recognizeImage } from '@/lib/imageRecognition';
import type { ImageRecognitionResult } from '@/lib/types';

const ImageRecognition = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<ImageRecognitionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { toast } = useToast();

  const handleImageSelected = async (imageFile: File) => {
    try {
      // Reset previous results
      setResult(null);
      setSelectedImage(imageFile);
      
      // Create and display image preview
      const previewUrl = URL.createObjectURL(imageFile);
      setImagePreview(previewUrl);
      
      // Process the image
      setIsProcessing(true);
      const recognitionResult = await recognizeImage(previewUrl);
      setResult(recognitionResult);
      
      toast({
        title: "Image processed successfully",
        description: `Found ${recognitionResult.predictions.length} objects in the image`,
      });
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "Error processing image",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <ImageUploader 
            onImageSelected={handleImageSelected}
            isProcessing={isProcessing}
          />
          
          {imagePreview && (
            <Card className="mt-6">
              <div className="relative p-2">
                <img 
                  src={imagePreview} 
                  alt="Selected" 
                  className="w-full h-auto rounded-md object-contain max-h-[400px]" 
                />
                {isProcessing && (
                  <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                    <div className="animate-pulse-scale bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm font-medium">
                      Processing...
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
        
        <div>
          {result && (
            <PredictionResults 
              predictions={result.predictions}
              processingTime={result.processingTime}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageRecognition;
