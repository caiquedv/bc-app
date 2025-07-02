import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Trash2, ShoppingBag, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Navbar from '@/components/Navbar';
import DevGemsCredit from '@/components/DevGemsCredit';
import { useCart } from '@/hooks/useCart';
import { toast } from '@/hooks/use-toast';

const Cart = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, clearCart, getTotalPrice } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [observations, setObservations] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = getTotalPrice();
  const deliveryFee = 5.00;
  const total = subtotal + deliveryFee;

  const generateOrderId = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const handleEditItem = (itemId: string) => {
    const item = items.find(i => i.id === itemId);

    if (item && item.productId) {
      navigate(`/product/${item.productId}?edit=${itemId}`);
    } else {
      toast({
        title: "Erro ao editar",
        description: "Não foi possível encontrar o produto original para edição.",
        variant: "destructive",
      });
      console.error("O item do carrinho não possui um 'productId' para a navegação.", item);
    }
  };

  const getItemDisplayPrice = (item: any) => {
    const basePrice = item.price * item.quantity;
    const additionalsPrice = (item.additionals || []).reduce(
      (total: number, additional: any) => total + (additional.price * additional.quantity),
      0
    );
    return basePrice + additionalsPrice;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione itens ao carrinho antes de finalizar o pedido.",
        variant: "destructive"
      });
      return;
    }

    if (!customerName || !customerPhone || !customerAddress) {
      toast({
        title: "Dados obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const orderId = generateOrderId();

      const whatsappMessage = createWhatsAppMessage(orderId);
      const whatsappUrl = `https://api.whatsapp.com/send?phone=5566999138120&text=${encodeURIComponent(whatsappMessage)}`;

      clearCart();

      toast({
        title: "Pedido enviado!",
        description: `Seu pedido ${orderId} foi enviado via WhatsApp!`,
      });

      window.open(whatsappUrl, '_blank');

      navigate('/');

    } catch (error) {
      console.error('Erro ao enviar pedido:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar pedido. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const createWhatsAppMessage = (orderId: string) => {
    const itemsList = items.map(item => {
      let itemText = `${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}`;
      
      if (item.additionals && item.additionals.length > 0) {
        const additionalsText = item.additionals.map(add => 
          `  + ${add.quantity}x ${add.name} - R$ ${(add.price * add.quantity).toFixed(2)}`
        ).join('\n');
        itemText += '\n' + additionalsText;
      }
      
      if (item.observations) {
        itemText += `\n  Obs: ${item.observations}`;
      }
      
      return itemText;
    }).join('\n\n');

    let message = `🍗 *NOVO PEDIDO* - ${orderId}\n\n`;
    message += `👤 *Cliente:* ${customerName}\n`;
    message += `📞 *Telefone:* ${customerPhone}\n`;
    message += `📍 *Endereço:* ${customerAddress}\n\n`;

    message += `🛒 *Itens:*\n${itemsList}\n`;
    if (observations) {
      message += `\n📝 *Observações Gerais:* ${observations}\n`;
    }
    message += `\n⏱️ *Tempo de espera estimado: 40 minutos*\n`;
    message += `———————————————\n`;
    message += `💰 *Total a pagar: R$ ${total.toFixed(2)}*\n`;
    message += `💳 *Pagamento:* ${getPaymentMethodName(paymentMethod)}\n`;

    return message;
  };

  const getPaymentMethodName = (method: string) => {
    const methods = {
      cash: 'Dinheiro',
      pix: 'PIX',
      debit: 'Cartão de Débito',
      credit: 'Cartão de Crédito'
    };
    return methods[method as keyof typeof methods] || method;
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex-1 max-w-4xl mx-auto px-2 sm:px-4 py-8 w-full">
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Seu carrinho está vazio</h2>
            <p className="text-gray-600 mb-6">Adicione alguns itens deliciosos do nosso cardápio!</p>
            <Button
              onClick={() => navigate('/')}
              className="bg-red-600 hover:bg-red-700"
            >
              Ver Cardápio
            </Button>
          </div>
        </div>
        <div className="pb-8">
          <DevGemsCredit />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Navbar />
      <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800 break-words">Finalizar Pedido</h1>
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Voltar ao Cardápio
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          {/* Itens do Carrinho */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  Seus Itens
                  <Button
                    size="sm"
                    variant="ghost"
                    className="ml-2 text-red-600 hover:bg-red-50"
                    type="button"
                    onClick={clearCart}
                  >
                    Limpar Carrinho
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold break-words">{item.name}</h3>
                        <p className="text-gray-600">
                          {item.quantity} unidades de R$ {item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex gap-2">

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {item.additionals && item.additionals.length > 0 && (
                      <div>
                        {item.additionals.map((additional) => (
                          <div key={additional.id} className="text-sm text-gray-600">
                            + {additional.quantity} {additional.name} - R$ {(additional.price * additional.quantity).toFixed(2)}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {item.observations && (
                      <div className="text-sm text-gray-600 italic">
                        Obs: {item.observations}
                      </div>
                    )}
                    
                    <div className="flex justify-between pt-2 border-t">
                      <button
                        className="text-red-600 hover:text-red-700 font-medium text-sm"
                        onClick={() => handleEditItem(item.id)}
                        type="button"
                      >
                        Editar
                      </button>
                      <div className="font-semibold">
                        Total: R$ {getItemDisplayPrice(item).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa de entrega:</span>
                  <span>R$ {deliveryFee.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-red-600">R$ {total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dados para Entrega</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Seu nome"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input
                      id="phone"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="(11) 9 9999-9999"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Endereço Completo *</Label>
                    <Textarea
                      id="address"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="Rua, número, bairro, pontos de referência..."
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="observations">Observações Gerais</Label>
                    <Textarea
                      id="observations"
                      value={observations}
                      onChange={(e) => setObservations(e.target.value)}
                      placeholder="Alguma observação especial? (opcional)"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Forma de Pagamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <Alert className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Pagamento na entrega
                    </AlertDescription>
                  </Alert>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash">💵 Dinheiro</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pix" id="pix" />
                      <Label htmlFor="pix">📱 PIX</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="debit" id="debit" />
                      <Label htmlFor="debit">💳 Cartão de Débito</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="credit" id="credit" />
                      <Label htmlFor="credit">💳 Cartão de Crédito</Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 py-6 text-md"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Enviando..."
                  : `Enviar Pedido via WhatsApp - R$ ${total.toFixed(2)}`}
              </Button>
            </form>
            <div className="mt-6">
              <DevGemsCredit />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
