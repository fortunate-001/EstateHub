import React from "react";
import "../styles/WhatsAppButton.css";

function WhatsAppButton() {
  const phoneNumber = "2347011715312"; // Replace with your WhatsApp number
  const message =
    "Hello! I'm interested in your properties on EstateHub. Can you help me?";

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
      "_blank",
    );
  };

  return (
    <div className="whatsapp-float" onClick={handleWhatsAppClick}>
      <i className="bx bxl-whatsapp"></i>
    </div>
  );
}

export default WhatsAppButton;