
// ...code as described in your script for Index page...
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin, Phone, Star, Utensils, Heart, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-600 to-red-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                O Melhor <span className="text-yellow-300">Frango</span> da Cidade!
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Frango assado na brasa, temperos especiais e aquele sabor que você nunca esquece.
                Peça agora e receba quentinho em casa!
              </p>
              <div className="space-x-4">
                <Button
                  size="lg"
                  onClick={() => navigate('/menu')}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 text-lg"
                >
                  <Utensils className="mr-2 h-5 w-5" />
                  Ver Cardápio
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-red-600 px-8 py-4 text-lg"
                  onClick={() => window.open('https://api.whatsapp.com/send?phone=5511985208044', '_blank')}
                >
                  <Phone className="mr-2 h-5 w-5" />
                  WhatsApp
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1598103442097-8b74394b95c6"
                alt="Frango Assado Big Chicken"
                className="rounded-lg shadow-2xl w-full max-w-md mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Por que escolher a Big Chicken?</h2>
            <p className="text-xl text-gray-600">Qualidade, sabor e tradição em cada pedaço</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Award className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <CardTitle>Qualidade Premium</CardTitle>
                <CardDescription>
                  Selecionamos apenas os melhores frangos, com temperos especiais e receitas tradicionais
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Clock className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <CardTitle>Entrega Rápida</CardTitle>
                <CardDescription>
                  Seu pedido chega quentinho em até 40 minutos, direto da nossa cozinha para sua mesa
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Heart className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <CardTitle>Feito com Amor</CardTitle>
                <CardDescription>
                  Cada frango é preparado com carinho e atenção aos detalhes, como uma receita de família
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Items */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Nossos Mais Pedidos</h2>
            <p className="text-xl text-gray-600">Os favoritos dos nossos clientes</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <img
                src="https://images.unsplash.com/photo-1598103442097-8b74394b95c6"
                alt="Frango Inteiro"
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <CardHeader>
                <CardTitle>Frango Inteiro Tradicional</CardTitle>
                <CardDescription>
                  Nosso clássico frango inteiro temperado com blend especial da casa
                </CardDescription>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">(4.9)</span>
                </div>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <img
                src="https://images.unsplash.com/photo-1527477396000-e27163b481c2"
                alt="Coxas da Casa"
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <CardHeader>
                <CardTitle>Coxas da Casa (6 unid)</CardTitle>
                <CardDescription>
                  Coxas suculentas e temperadas, perfeitas para compartilhar
                </CardDescription>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">(4.8)</span>
                </div>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <img
                src="https://images.unsplash.com/photo-1573080496219-bb080dd4f877"
                alt="Batata Frita"
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <CardHeader>
                <CardTitle>Batata Frita Especial</CardTitle>
                <CardDescription>
                  Batatas crocantes com tempero da casa, acompanhamento perfeito
                </CardDescription>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">(4.7)</span>
                </div>
              </CardHeader>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              onClick={() => navigate('/menu')}
              className="bg-red-600 hover:bg-red-700 px-8 py-4 text-lg"
            >
              Ver Cardápio Completo
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Phone className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Telefone</h3>
              <p className="text-gray-600">(11) 98520-8044</p>
            </div>
            <div className="flex flex-col items-center">
              <MapPin className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Localização</h3>
              <p className="text-gray-600">São Paulo, SP</p>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Horário</h3>
              <p className="text-gray-600">Seg-Dom: 18h às 00h</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
