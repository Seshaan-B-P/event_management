import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const number = '8124931018';
  const message = 'Hello BPS Events, I would like to inquire about your event planning and decoration services.';
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/91${number}?text=${encodedMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="float-wa"
      aria-label="Contact BPS Events on WhatsApp"
    >
      <MessageCircle size={32} fill="white" />
    </a>
  );
};

export default WhatsAppButton;
