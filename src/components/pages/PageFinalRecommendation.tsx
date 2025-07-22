import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { GameSoundButton } from '@/components/ui/GameSoundButton';
import { PersonalizedRecommendation } from '@/components/ui/PersonalizedRecommendation';
import { SocialProofWidget } from '@/components/ui/SocialProofWidget';
import { useQuiz } from '@/contexts/QuizContext';
import { useAdvancedGameSounds } from '@/hooks/useAdvancedGameSounds';
import { 
  Trophy, 
  Share2, 
  Download, 
  Sparkles, 
  RotateCcw,
  Star
} from 'lucide-react';

export const PageFinalRecommendation = () => {
  const { answers, correctAnswers, progress, resetQuiz } = useQuiz();
  const { playProgressSound, playGameSound } = useAdvancedGameSounds();
  const [showShareModal, setShowShareModal] = useState(false);

  React.useEffect(() => {
    // Som de finalização épico
    setTimeout(() => {
      playProgressSound('completion');
    }, 500);

    // Som de conquista após 1 segundo
    setTimeout(() => {
      playGameSound('achievement', 1.5);
    }, 1500);
  }, []);

  const handleShare = (platform: string) => {
    playGameSound('button-click', 1.0);
    
    const shareText = `Acabei de descobrir meu chá perfeito! 🍃 Fiz um quiz incrível e ganhei ${correctAnswers >= 3 ? '25%' : '20%'} de desconto! Faça o seu também:`;
    const shareUrl = window.location.href;
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    };

    if (shareUrls[platform as keyof typeof shareUrls]) {
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
    }
  };

  const getPerformanceMessage = () => {
    const percentage = (correctAnswers / 4) * 100;
    
    if (percentage === 100) {
      return {
        title: "🏆 PERFEITO! 100% de Acerto!",
        message: "Você conhece muito bem seus gostos! Está no top 5% dos participantes!",
        badge: "Especialista em Chás",
        color: "from-yellow-400 to-amber-500"
      };
    } else if (percentage >= 75) {
      return {
        title: "⭐ Excelente! Muito Bem!",
        message: "Ótimo conhecimento! Você está no top 15% dos participantes!",
        badge: "Expert em Bem-estar",
        color: "from-green-400 to-emerald-500"
      };
    } else if (percentage >= 50) {
      return {
        title: "👍 Bom Trabalho!",
        message: "Você tem bom senso para escolhas saudáveis!",
        badge: "Entusiasta do Bem-estar",
        color: "from-blue-400 to-cyan-500"
      };
    } else {
      return {
        title: "🌱 Ótimo Início!",
        message: "Todo expert começou como iniciante. Você está no caminho certo!",
        badge: "Futuro Expert",
        color: "from-purple-400 to-violet-500"
      };
    }
  };

  const performance = getPerformanceMessage();

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header de Conquista */}
          <Card className={`p-8 text-center bg-gradient-to-r ${performance.color} text-white shadow-2xl animate-fade-in`}>
            <div className="space-y-4">
              <Trophy className="h-16 w-16 mx-auto animate-bounce-in" />
              <h1 className="text-4xl md:text-5xl font-bold">{performance.title}</h1>
              <p className="text-xl text-white/90">{performance.message}</p>
              
              <div className="flex items-center justify-center gap-4 mt-6">
                <div className="bg-white/20 px-4 py-2 rounded-full">
                  <span className="text-lg font-bold">{correctAnswers}/4 Acertos</span>
                </div>
                <div className="bg-white/20 px-4 py-2 rounded-full">
                  <span className="text-lg font-bold">{performance.badge}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Recomendação Personalizada */}
          <PersonalizedRecommendation />

          {/* Resumo das Respostas */}
          <Card className="p-6 bg-gradient-card">
            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Seu Perfil Personalizado
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {answers.map((answer, index) => (
                <div key={index} className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    {answer.question}
                  </p>
                  <p className="text-foreground font-medium">{answer.answer}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Compartilhamento Social */}
          <Card className="p-6 bg-gradient-card">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-bold text-foreground flex items-center justify-center gap-2">
                <Share2 className="h-5 w-5" />
                Compartilhe seu Resultado!
              </h3>
              
              <p className="text-muted-foreground">
                Mostre para seus amigos que você descobriu seu chá ideal!
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <GameSoundButton
                  onClick={() => handleShare('facebook')}
                  variant="outline"
                  className="flex items-center gap-2 hover:bg-blue-500/10 hover:border-blue-500"
                  soundType="button-click"
                >
                  📘 Facebook
                </GameSoundButton>
                
                <GameSoundButton
                  onClick={() => handleShare('twitter')}
                  variant="outline"
                  className="flex items-center gap-2 hover:bg-sky-500/10 hover:border-sky-500"
                  soundType="button-click"
                >
                  🐦 Twitter
                </GameSoundButton>
                
                <GameSoundButton
                  onClick={() => handleShare('whatsapp')}
                  variant="outline"
                  className="flex items-center gap-2 hover:bg-green-500/10 hover:border-green-500"
                  soundType="button-click"
                >
                  💬 WhatsApp
                </GameSoundButton>
                
                <GameSoundButton
                  onClick={() => handleShare('linkedin')}
                  variant="outline"
                  className="flex items-center gap-2 hover:bg-blue-600/10 hover:border-blue-600"
                  soundType="button-click"
                >
                  💼 LinkedIn
                </GameSoundButton>
              </div>
            </div>
          </Card>

          {/* Prova Social Completa */}
          <SocialProofWidget variant="full" />

          {/* Ações Finais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GameSoundButton
              onClick={() => {
                playGameSound('button-click', 1.0);
                // Aqui seria o download do PDF com o resultado
                console.log('Download do resultado');
              }}
              variant="outline"
              size="lg"
              className="flex items-center justify-center gap-2 h-14"
              soundType="button-click"
            >
              <Download className="h-5 w-5" />
              Baixar Resultado em PDF
            </GameSoundButton>

            <GameSoundButton
              onClick={() => {
                playGameSound('page-transition', 1.0);
                resetQuiz();
              }}
              variant="outline"
              size="lg"
              className="flex items-center justify-center gap-2 h-14"
              soundType="page-transition"
            >
              <RotateCcw className="h-5 w-5" />
              Fazer Quiz Novamente
            </GameSoundButton>
          </div>

          {/* Garantias e Confiança Final */}
          <Card className="p-6 bg-gradient-card text-center">
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>4.9/5 estrelas</span>
              </div>
              <div>🚚 Frete grátis</div>
              <div>✅ 30 dias de garantia</div>
              <div>🔒 Compra segura</div>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
};