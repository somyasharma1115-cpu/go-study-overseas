const WHATSAPP_NUMBER = "917909909148";
const CHATBOT_NUMBER = "917909909195";

export const buildChatbotUrl = (message: string) =>
  `https://wa.me/${CHATBOT_NUMBER}?text=${encodeURIComponent(message)}`;

export const CHATBOT_URL = buildChatbotUrl(
  "Hi Go Study Overseas Chatbot, I need assistance.",
);

export const buildWhatsAppUrl = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const WHATSAPP_URL = buildWhatsAppUrl(
  "Hi Go Study Overseas, I'd like to know more about studying abroad.",
);
