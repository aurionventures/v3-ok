/** Número WhatsApp para contato - (11) 9999-9999 - altere aqui para mudar em todos os botões */
export const WHATSAPP_NUMBER = "551199999999";

export const whatsappUrl = (message?: string) => {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  if (message) return `${base}?text=${encodeURIComponent(message)}`;
  return base;
};
