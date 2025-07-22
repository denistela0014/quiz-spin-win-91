import React, { Suspense } from 'react';
import { VideoPlayer } from './VideoPlayer';

interface VideoPlayerWithSuspenseProps {
  children?: React.ReactNode;
  fallback?: React.ReactNode;
}

// Componente wrapper com React Suspense para carregamento otimizado
export const VideoPlayerWithSuspense = ({ 
  children, 
  fallback = (
    <div className="relative w-full aspect-video bg-gradient-card rounded-lg overflow-hidden shadow-elegant min-h-[200px] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin text-4xl mb-4">⏳</div>
        <p className="text-muted-foreground">Carregando vídeo...</p>
      </div>
    </div>
  ),
  ...props 
}: VideoPlayerWithSuspenseProps & React.ComponentProps<typeof VideoPlayer>) => {
  return (
    <Suspense fallback={fallback}>
      <VideoPlayer {...props} />
      {children}
    </Suspense>
  );
};