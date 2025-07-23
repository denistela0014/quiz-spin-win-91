import React from 'react';
import { SoundButton } from '@/components/ui/SoundButton';
import { Card } from '@/components/ui/card';
import { useQuiz } from '@/contexts/QuizContext';
import { AlertCircle, RotateCcw } from 'lucide-react';

export const PageError = () => {
  const { resetQuiz } = useQuiz();

  const handleRetry = () => {
    resetQuiz();
  };

  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto p-8 bg-gradient-card backdrop-blur-sm shadow-elegant text-center">
          <div className="space-y-6">
            {/* Ícone de erro */}
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-destructive" />
              </div>
            </div>

            {/* Título */}
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Ops! Algo deu errado na geração da sua receita 😓
            </h1>

            {/* Descrição */}
            <p className="text-lg text-muted-foreground leading-relaxed">
              Não se preocupe! Isso pode acontecer às vezes por instabilidade na conexão. Você pode refazer o quiz rapidinho e garantir sua receita personalizada agora mesmo.
            </p>

            {/* Botão de retry */}
            <div className="pt-4">
              <SoundButton
                onClick={handleRetry}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-4 text-lg shadow-glow animate-pulse-glow"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                🔄 Refazer meu quiz agora
              </SoundButton>
            </div>

            {/* Informações adicionais */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                💡 Dica: Verifique sua conexão com a internet e tente novamente
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};