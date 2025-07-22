import React, { useState, useEffect } from 'react';
import { Card } from './card';
import { Badge } from './badge';
import { Avatar, AvatarFallback } from './avatar';
import { Star, Users, TrendingUp, CheckCircle } from 'lucide-react';

interface SocialProofWidgetProps {
  className?: string;
  variant?: 'compact' | 'full';
}

export const SocialProofWidget: React.FC<SocialProofWidgetProps> = ({
  className = '',
  variant = 'compact'
}) => {
  const [recentCompletions, setRecentCompletions] = useState(0);
  const [liveUsers, setLiveUsers] = useState(0);

  // Simular atividade em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setRecentCompletions(prev => prev + Math.floor(Math.random() * 3) + 1);
      setLiveUsers(127 + Math.floor(Math.random() * 20));
    }, 5000);

    // Inicializar valores
    setRecentCompletions(2847);
    setLiveUsers(143);

    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    { name: "Maria S.", rating: 5, text: "Incrível! Encontrei o chá perfeito para mim!" },
    { name: "João P.", rating: 5, text: "Super recomendo, mudou minha rotina matinal." },
    { name: "Ana C.", rating: 5, text: "Resultados surpreendentes em apenas 2 semanas!" },
    { name: "Carlos M.", rating: 5, text: "Qualidade excepcional, chegou super rápido." }
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(testimonialInterval);
  }, []);

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Avatar key={i} className="w-6 h-6 border-2 border-background">
                <AvatarFallback className="text-xs bg-primary/20">
                  {String.fromCharCode(65 + i)}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            +{recentCompletions.toLocaleString()} pessoas completaram
          </span>
        </div>

        <Badge variant="secondary" className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          {liveUsers} fazendo agora
        </Badge>
      </div>
    );
  }

  return (
    <Card className={`p-4 bg-gradient-card ${className}`}>
      <div className="space-y-4">
        {/* Estatísticas principais */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="flex items-center justify-center mb-1">
              <Users className="h-4 w-4 text-primary mr-1" />
              <span className="text-lg font-bold text-foreground">
                {recentCompletions.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Completaram hoje</p>
          </div>

          <div>
            <div className="flex items-center justify-center mb-1">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-lg font-bold text-foreground">4.9</span>
            </div>
            <p className="text-xs text-muted-foreground">Avaliação média</p>
          </div>

          <div>
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-lg font-bold text-foreground">98%</span>
            </div>
            <p className="text-xs text-muted-foreground">Satisfação</p>
          </div>
        </div>

        {/* Atividade em tempo real */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-foreground">
              {liveUsers} pessoas fazendo o quiz agora
            </span>
          </div>
          <Badge variant="outline" className="text-xs">
            Ao vivo
          </Badge>
        </div>

        {/* Testemunho rotativo */}
        <div className="relative overflow-hidden h-16">
          <div 
            className="transition-transform duration-500 ease-in-out"
            style={{ transform: `translateY(-${currentTestimonial * 100}%)` }}
          >
            {testimonials.map((testimonial, index) => (
              <div key={index} className="h-16 flex items-center space-x-3 py-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs bg-primary/20">
                    {testimonial.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground">
                      {testimonial.name}
                    </span>
                    <div className="flex">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <CheckCircle className="w-3 h-3 text-green-500" />
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    "{testimonial.text}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to action social */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Junte-se a milhares de pessoas que já descobriram seu chá ideal!
          </p>
        </div>
      </div>
    </Card>
  );
};