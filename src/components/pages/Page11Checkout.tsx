import React, { useState } from 'react';
import { SoundButton } from '@/components/ui/SoundButton';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProgressBar } from '@/components/ProgressBar';
import { useQuiz } from '@/contexts/QuizContext';
import { useToast } from '@/hooks/use-toast';

export const Page11Checkout = () => {
  const { discount, recommendation, currentPage, totalSteps } = useQuiz();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  });

  const originalPrice = 67.90;
  const finalPrice = (originalPrice * (1 - discount / 100)).toFixed(2);
  const savings = (originalPrice - parseFloat(finalPrice)).toFixed(2);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // Simula redirecionamento para pagamento
    toast({
      title: "Redirecionando para pagamento...",
      description: "Você será redirecionado em instantes!",
    });

    // Redireciona para o link de checkout configurável
    const checkoutUrl = process.env.REACT_APP_CHECKOUT_URL || "LINK_CHECKOUT_FUTURO_AQUI";
    
    setTimeout(() => {
      if (checkoutUrl !== "LINK_CHECKOUT_FUTURO_AQUI") {
        window.location.href = `${checkoutUrl}?price=${finalPrice}&discount=${discount}&product=${encodeURIComponent(recommendation || 'Chá Verde Premium')}`;
      } else {
        // Link placeholder para demonstração
        alert(`Checkout configurado: R$ ${finalPrice} com ${discount}% desconto`);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <ProgressBar currentStep={currentPage} totalSteps={totalSteps} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Resumo do Pedido */}
            <Card className="p-8 bg-gradient-card backdrop-blur-sm shadow-elegant animate-fade-in">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                📋 Resumo do Seu Pedido
              </h2>

              <div className="space-y-6">
                <div className="bg-gradient-accent p-6 rounded-lg">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="text-4xl">🍵</div>
                    <div>
                      <h3 className="font-bold text-accent-foreground">
                        {recommendation || 'Chá Verde Premium com Gengibre'}
                      </h3>
                      <p className="text-accent-foreground/80">Personalizado para você</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-accent-foreground/20 pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span>Preço original:</span>
                      <span className="line-through text-accent-foreground/60">R$ {originalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span>Desconto ({discount}%):</span>
                      <span className="text-green-600 font-semibold">-R$ {savings}</span>
                    </div>
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Total:</span>
                      <span className="text-primary">R$ {finalPrice}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-muted-foreground">
                    <span className="text-green-500">✓</span>
                    <span>Frete grátis para todo o Brasil</span>
                  </div>
                  <div className="flex items-center space-x-3 text-muted-foreground">
                    <span className="text-green-500">✓</span>
                    <span>Garantia de 30 dias</span>
                  </div>
                  <div className="flex items-center space-x-3 text-muted-foreground">
                    <span className="text-green-500">✓</span>
                    <span>Entrega em 3-5 dias úteis</span>
                  </div>
                  <div className="flex items-center space-x-3 text-muted-foreground">
                    <span className="text-green-500">✓</span>
                    <span>Pagamento 100% seguro</span>
                  </div>
                </div>

                <div className="bg-primary/10 p-4 rounded-lg">
                  <p className="text-center font-semibold text-primary">
                    🔥 Oferta válida apenas hoje!
                  </p>
                </div>
              </div>
            </Card>

            {/* Formulário de Checkout */}
            <Card className="p-8 bg-gradient-card backdrop-blur-sm shadow-elegant animate-scale-in">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                📦 Dados para Entrega
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Telefone/WhatsApp *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Endereço Completo</Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="Rua, número, complemento"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      type="text"
                      placeholder="Sua cidade"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">CEP</Label>
                    <Input
                      id="zipCode"
                      type="text"
                      placeholder="00000-000"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <SoundButton
                    type="submit"
                    size="lg"
                    className="w-full bg-action-button hover:bg-action-button/90 text-action-button-foreground font-bold py-6 text-xl shadow-glow animate-pulse-glow transition-bounce"
                  >
                    🛒 FINALIZAR COMPRA - R$ {finalPrice}
                  </SoundButton>
                  
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    🔒 Seus dados estão seguros • Pagamento processado com segurança
                  </p>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};