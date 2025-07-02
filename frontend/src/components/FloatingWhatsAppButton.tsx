
import { MessageCircle } from "lucide-react";

const WHATSAPP_LINK =
  "https://api.whatsapp.com/send?phone=5566999138120&text=Ol%C3%A1%2C%20gostaria%20de%20fazer%20um%20pedido!";

const FloatingWhatsAppButton = () => {
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Pedir pelo WhatsApp"
      className="fixed z-50 bottom-[4.25rem] right-1 rounded-full bg-green-500 hover:bg-green-600 shadow-lg p-4 animate-fade-in"
      title="Pedir pelo WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-white" />
    </a>
  );
};

export default FloatingWhatsAppButton;
