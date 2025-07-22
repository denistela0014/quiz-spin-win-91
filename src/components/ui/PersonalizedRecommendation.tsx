import React, { useEffect, useState } from 'react';
import { Card } from './card';
import { Badge } from './badge';
import { GameSoundButton } from './GameSoundButton';
import { useQuiz } from '@/contexts/QuizContext';
import { Sparkles, Gift, Star, Heart, Zap, Coffee } from 'lucide-react';

interface PersonalizedRecommendationProps {
  className?: string;
}

interface Recommendation {
  product: string;
  reason: string;
  benefits: string[];
  discount: number;
  perfectMatch: boolean;
  icon: React.ReactNode;
  color: string;
}

export const PersonalizedRecommendation: React.FC<PersonalizedRecommendationProps> = ({
  className = ''
}) => {
  const { answers, correctAnswers } = useQuiz();
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [couponCode, setCouponCode] = useState('');

  // Gerar recomendação personalizada baseada nas respostas
  useEffect(() => {
    if (answers.length === 0) return;

    // Analisar respostas para gerar recomendação personalizada
    const analysisMap: Record<string, Recommendation> = {
      'energia': {
        product: 'Chá Verde Premium Energizante',
        reason: 'Perfeito para aumentar sua energia e disposição naturalmente',
        benefits: ['Rica em antioxidantes', 'Acelera o metabolismo', 'Melhora a concentração', 'Energia sustentada'],
        discount: correctAnswers >= 3 ? 25 : 20,
        perfectMatch: true,
        icon: <Zap className="h-6 w-6" />,
        color: 'from-green-500 to-emerald-600'
      },
      'relaxar': {
        product: 'Chá de Camomila Relaxante',
        reason: 'Ideal para relaxar e reduzir o stress do dia a dia',
        benefits: ['Efeito calmante natural', 'Melhora a qualidade do sono', 'Reduz ansiedade', 'Anti-inflamatório'],
        discount: correctAnswers >= 3 ? 25 : 20,
        perfectMatch: true,
        icon: <Heart className="h-6 w-6" />,
        color: 'from-purple-500 to-violet-600'
      },
      'emagrecimento': {
        product: 'Chá Termogênico Fat Burner',
        reason: 'Desenvolvido especialmente para acelerar seu metabolismo',
        benefits: ['Queima gordura 24h', 'Acelera metabolismo', 'Controla apetite', 'Detox natural'],
        discount: correctAnswers >= 3 ? 30 : 25,
        perfectMatch: true,
        icon: <Sparkles className="h-6 w-6" />,
        color: 'from-orange-500 to-red-600'
      },
      'saude': {
        product: 'Mix Detox Antioxidante',
        reason: 'Combinação perfeita para melhorar sua saúde geral',
        benefits: ['Rico em vitaminas', 'Fortalece imunidade', 'Purifica o organismo', 'Anti-aging natural'],
        discount: correctAnswers >= 3 ? 25 : 20,
        perfectMatch: true,
        icon: <Coffee className="h-6 w-6" />,
        color: 'from-blue-500 to-cyan-600'
      }
    };

    // Encontrar a recomendação baseada na primeira resposta (objetivo principal)
    const firstAnswerKey = Object.keys(analysisMap).find(key => 
      answers[0]?.answer.toLowerCase().includes(key)
    );

    if (firstAnswerKey) {
      setRecommendation(analysisMap[firstAnswerKey]);
      // Gerar cupom personalizado
      const perfectScore = correctAnswers >= 3;
      setCouponCode(perfectScore ? `PERFECT${correctAnswers}` : `QUIZ${correctAnswers}`);
    }
  }, [answers, correctAnswers]);

  if (!recommendation) {
    return null;
  }

  return (
    <Card className={`p-6 bg-gradient-to-br ${recommendation.color} text-white ${className}`}>
      <div className="space-y-6">
        {/* Header com match perfeito */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-3">
            {recommendation.icon}
            <div className="ml-2">
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Star className="h-3 w-3 mr-1" />
                {recommendation.perfectMatch ? 'Match Perfeito!' : 'Boa Compatibilidade'}
              </Badge>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold mb-2">{recommendation.product}</h3>
          <p className="text-white/90 text-lg">{recommendation.reason}</p>
        </div>

        {/* Benefícios */}
        <div className="grid grid-cols-2 gap-3">
          {recommendation.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white/80 rounded-full flex-shrink-0" />
              <span className="text-sm text-white/90">{benefit}</span>
            </div>
          ))}
        </div>

        {/* Oferta especial */}
        <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Gift className="h-5 w-5 text-white" />
              <span className="text-lg font-bold">OFERTA ESPECIAL</span>
            </div>
            
            <div className="text-3xl font-bold text-white">
              {recommendation.discount}% OFF
            </div>
            
            <div className="bg-white/20 p-2 rounded border border-dashed border-white/40">
              <p className="text-xs text-white/80 mb-1">Seu cupom personalizado:</p>
              <div className="text-lg font-bold tracking-wider">{couponCode}</div>
            </div>

            <p className="text-sm text-white/80">
              {correctAnswers >= 3 ? (
                "🎉 Parabéns! Você acertou todas as perguntas e ganhou desconto máximo!"
              ) : (
                `Desconto baseado em ${correctAnswers} acertos no quiz!`
              )}
            </p>
          </div>
        </Card>

        {/* Call to Action */}
        <div className="space-y-3">
          <GameSoundButton
            onClick={() => {
              // Aqui seria a navegação para checkout
              console.log('Navegando para checkout com produto:', recommendation.product);
            }}
            variant="secondary"
            size="lg"
            soundType="achievement"
            soundIntensity={1.5}
            className="w-full bg-white text-black hover:bg-white/90 font-bold py-4 text-lg animate-cta-glow"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            GARANTIR MEU {recommendation.discount}% OFF AGORA
          </GameSoundButton>

          <div className="text-center">
            <p className="text-xs text-white/70">
              ⏰ Oferta válida por tempo limitado apenas para você!
            </p>
          </div>
        </div>

        {/* Garantia e confiança */}
        <div className="border-t border-white/20 pt-4 text-center">
          <p className="text-sm text-white/80">
            ✅ 30 dias de garantia • 🚚 Frete grátis • ⭐ 4.9/5 estrelas
          </p>
        </div>
      </div>
    </Card>
  );
};