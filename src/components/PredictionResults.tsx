
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { Prediction } from '@/lib/types';

interface PredictionResultsProps {
  predictions: Prediction[];
  processingTime?: number;
}

const PredictionResults: React.FC<PredictionResultsProps> = ({ 
  predictions, 
  processingTime 
}) => {
  if (!predictions || predictions.length === 0) {
    return null;
  }

  // Format label by removing any text after a comma and title-case it
  const formatLabel = (label: string) => {
    const baseName = label.split(',')[0];
    return baseName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <Card className="w-full animate-fade-in">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Recognition Results</h3>
          {processingTime !== undefined && (
            <span className="text-sm text-muted-foreground">
              Processed in {processingTime.toFixed(0)}ms
            </span>
          )}
        </div>

        <div className="space-y-4">
          {predictions.slice(0, 5).map((prediction, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-medium">{formatLabel(prediction.label)}</span>
                <span className="text-sm font-medium">
                  {(prediction.score * 100).toFixed(1)}%
                </span>
              </div>
              <Progress 
                value={prediction.score * 100} 
                className={`h-2 ${index === 0 ? 'bg-muted' : 'bg-muted'}`}
              />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default PredictionResults;
