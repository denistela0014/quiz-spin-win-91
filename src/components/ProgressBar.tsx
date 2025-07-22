import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export const ProgressBar = ({ currentStep, totalSteps, className = "" }: ProgressBarProps) => {
  const progressPercentage = (currentStep / totalSteps) * 100;
  
  return (
    <div className={`mb-8 ${className}`}>
      <div className="bg-muted rounded-full h-4 overflow-hidden shadow-inner relative">
        <div 
          className="bg-gradient-primary h-full rounded-full transition-all duration-700 ease-out relative"
          style={{ width: `${progressPercentage}%` }}
          role="progressbar"
          aria-valuenow={currentStep}
          aria-valuemin={0}
          aria-valuemax={totalSteps}
          aria-label={`Progresso do quiz: ${currentStep} de ${totalSteps} etapas`}
        >
          <div className="absolute inset-0 bg-white/30 animate-pulse-glow"></div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-3">
        <p className="text-sm text-muted-foreground">
          Etapa {currentStep} de {totalSteps}
        </p>
        <p className="text-sm font-medium text-primary">
          {Math.round(progressPercentage)}% completo
        </p>
      </div>
    </div>
  );
};