import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useCart, CartItem, CartItemAdditional } from '@/hooks/useCart';
import { Product, ProductAdditional, fetchProducts } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DevGemsCredit from '@/components/DevGemsCredit';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, updateItem, items } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [observations, setObservations] = useState('');
  const [selectedAdditionals, setSelectedAdditionals] = useState<CartItemAdditional[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Get the category from URL params or location state
  const categoryFromState = location.state?.category;

  // Detectar se veio do carrinho
  const isFromCart = new URLSearchParams(window.location.search).has('edit');

  // Verificar se está editando um item existente
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');

    if (editId) {
      const existingItem = items.find(item => item.id === editId);
      if (existingItem) {
        setIsEditing(true);
        setEditingItemId(editId);
        setQuantity(existingItem.quantity);
        setObservations(existingItem.observations || '');
        setSelectedAdditionals(existingItem.additionals || []);
      }
    }
  }, [items]);

  useEffect(() => {
    const loadProduct = async () => {
      if (id) {
        const allProducts = await fetchProducts();
        const foundProduct = allProducts.find(p => String(p.id) === id);
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          navigate('/');
        }
      }
    };
    loadProduct();
  }, [id, navigate]);

  if (!product) {
    return <div>Carregando...</div>;
  }

  const availableAdditionals = product?.additionals || [
    { id: 'molho-barbecue', name: 'Molho Barbecue Extra', price: 2.0 },
    { id: 'molho-alho', name: 'Molho de Alho Extra', price: 2.0 },
    { id: 'batata-extra', name: 'Batata Frita Extra', price: 8.0 },
    { id: 'queijo', name: 'Queijo Extra', price: 5.0 },
    { id: 'bacon', name: 'Bacon', price: 6.0 },
  ];

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;

    setQuantity(newQuantity);

    // Ajustar adicionais se a quantidade diminuiu
    setSelectedAdditionals(prev =>
      prev.map(additional => ({
        ...additional,
        quantity: Math.min(additional.quantity, newQuantity)
      })).filter(additional => additional.quantity > 0)
    );
  };

  const handleAdditionalQuantityChange = (additionalId: string, newQuantity: number) => {
    if (newQuantity < 0 || newQuantity > quantity) return;

    setSelectedAdditionals(prev => {
      const existing = prev.find(a => a.id === additionalId);

      if (newQuantity === 0) {
        return prev.filter(a => a.id !== additionalId);
      }

      if (existing) {
        return prev.map(a =>
          a.id === additionalId ? { ...a, quantity: newQuantity } : a
        );
      } else {
        const additional = availableAdditionals.find(a => a.id === additionalId);
        if (additional) {
          return [...prev, { ...additional, quantity: newQuantity }];
        }
      }

      return prev;
    });
  };

  const getAdditionalQuantity = (additionalId: string) => {
    const additional = selectedAdditionals.find(a => a.id === additionalId);
    return additional ? additional.quantity : 0;
  };

  const getTotalPrice = () => {
    const productTotal = parseFloat(product.price as any) * quantity;
    const additionalsTotal = selectedAdditionals.reduce(
      (total, additional) => total + (parseFloat(additional.price as any) * additional.quantity),
      0
    );
    return productTotal + additionalsTotal;
  };

  const handleAddToCart = () => {
    const cartItem: Omit<CartItem, 'quantity'> = {
      id: isEditing ? editingItemId! : `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: parseFloat(product.price as any),
      image: product.image_url || "https://images.unsplash.com/photo-1562967914-608f82629710",
      observations: observations.trim() || undefined,
      additionals: selectedAdditionals.length > 0 ? selectedAdditionals : undefined,
    };

    if (isEditing && editingItemId) {
      updateItem(editingItemId, { ...cartItem, quantity });
      toast({
        title: "Item atualizado!",
        description: `${product.name} foi atualizado no carrinho.`,
      });
    } else {
      addToCart({ ...cartItem, quantity });
      toast({
        title: "Item adicionado!",
        description: `${product.name} foi adicionado ao carrinho.`,
      });
    }

    // Navigate back based on origin
    if (isFromCart) {
      navigate('/cart');
    } else if (categoryFromState) {
      navigate('/', { state: { activeCategory: categoryFromState } });
    } else {
      navigate('/');
    }
  };

  const handleBackButton = () => {
    if (isFromCart) {
      navigate('/cart');
    } else if (categoryFromState) {
      navigate('/', { state: { activeCategory: categoryFromState } });
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={handleBackButton}
          className="bg-red-600 text-white hover:bg-red-700 mb-8"
        >
          {isFromCart ? 'Voltar ao Carrinho' : 'Voltar ao Cardápio'}
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Imagem do Produto */}
          <div>
            <img
              src={product.image_url || "https://images.unsplash.com/photo-1562967914-608f82629710"}
              alt={product.name}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
              onError={e => {
                (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1562967914-608f82629710";
              }}
            />
          </div>

          {/* Detalhes do Produto */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
              {product.description && product.description !== "Sem descrição" && (
                <p className="text-gray-600 mb-4">{product.description}</p>
              )}
              <div className="text-3xl font-bold text-red-600">
                R$ {parseFloat(product.price as any).toFixed(2)}
              </div>
            </div>

            {/* Quantidade */}
            <Card>
              <CardHeader>
                <CardTitle>Quantidade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Adicionais */}
            <Card>
              <CardHeader>
                <CardTitle>Adicionais (Opcionais)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {availableAdditionals.map((additional) => {
                  const currentQuantity = getAdditionalQuantity(additional.id);
                  return (
                    <div key={additional.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{additional.name}</h4>
                        <p className="text-sm text-gray-600">R$ {parseFloat(additional.price as any).toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAdditionalQuantityChange(additional.id, currentQuantity - 1)}
                          disabled={currentQuantity <= 0}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{currentQuantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAdditionalQuantityChange(additional.id, currentQuantity + 1)}
                          disabled={currentQuantity >= quantity}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Observações */}
            <Card>
              <CardHeader>
                <CardTitle>Observações (Opcional)</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Alguma observação especial para este item?"
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  rows={3}
                />
              </CardContent>
            </Card>

            {/* Resumo e Botão */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Produto ({quantity}x):</span>
                    <span>R$ {(parseFloat(product.price as any) * quantity).toFixed(2)}</span>
                  </div>
                  {selectedAdditionals.map((additional) => (
                    <div key={additional.id} className="flex justify-between text-sm">
                      <span>{additional.name} ({additional.quantity}x):</span>
                      <span>R$ {(parseFloat(additional.price as any) * additional.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-red-600">R$ {getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
                <Button
                  onClick={handleAddToCart}
                  className="w-full mt-6 bg-red-600 hover:bg-red-700 py-6 text-lg"
                >
                  {isEditing ? 'Atualizar no Carrinho' : 'Adicionar ao Carrinho'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <DevGemsCredit />
      </div>
    </div>
  );
};

export default ProductDetails;
