
import React from 'react';
import { cn } from '@/lib/utils';

interface MultiStepProgressProps {
  steps: number;
  currentStep: number;
  className?: string;
}

export const MultiStepProgress = ({
  steps,
  currentStep,
  className,
}: MultiStepProgressProps) => {
  return (
    <div className={cn('flex gap-2', className)}>
      {Array.from({ length: steps }).map((_, index) => {
        const stepNumber = index + 1;
        const isActive = currentStep >= stepNumber;
        const isCurrentStep = currentStep === stepNumber;

        return (
          <div
            key={stepNumber}
            className={cn(
              'h-2 rounded-full flex-1 transition-all duration-300',
              isActive
                ? 'bg-primary'
                : 'bg-muted',
              isCurrentStep && 'opacity-80'
            )}
          />
        );
      })}
    </div>
  );
};
