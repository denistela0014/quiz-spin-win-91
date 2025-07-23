import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useQuiz } from '@/contexts/QuizContext';
import { useAdvancedSpatialSounds } from '@/hooks/useAdvancedSpatialSounds';

export const PageLoading = () => {
  const { setCurrentPage } = useQuiz();
  const { playPageTransition } = useAdvancedSpatialSounds();

  useEffect(() => {
    // Simula o carregamento por 3-4 segundos
    const timer = setTimeout(() => {
      playPageTransition();
      setCurrentPage(11); // Vai para a página de recomendação
    }, 3500);

    return () => clearTimeout(timer);
  }, [setCurrentPage, playPageTransition]);

  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto p-8 bg-gradient-card backdrop-blur-sm shadow-elegant text-center">
          <div className="space-y-6">
            {/* Ícone animado */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-primary/30 rounded-full animate-spin">
                  <div className="absolute top-0 left-0 w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl animate-pulse">🌿</span>
                </div>
              </div>
            </div>

            {/* Texto principal */}
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground animate-fade-in">
                🌿 Estamos analisando suas respostas com carinho...
              </h1>
              
              <div className="text-lg text-muted-foreground leading-relaxed animate-slide-up">
                <p className="mb-4">
                  💡 Em alguns segundos você verá a receita de chá ideal para acelerar o seu metabolismo, reduzir o inchaço e transformar sua saúde com ingredientes naturais e personalizados.
                </p>
              </div>
            </div>

            {/* Barra de progresso animada */}
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div className="h-full bg-gradient-primary rounded-full animate-loading-bar"></div>
            </div>

            {/* Dicas durante o carregamento */}
            <div className="bg-primary/10 p-4 rounded-lg animate-bounce-in">
              <p className="text-sm text-muted-foreground">
                ✨ Preparando uma receita única baseada no seu perfil...
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};