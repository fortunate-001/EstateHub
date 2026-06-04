// src/utils/emailjs.js
import emailjs from "@emailjs/browser";

// ⚠️ REPLACE THESE WITH YOUR ACTUAL VALUES FROM EMAILJS DASHBOARD ⚠️
const SERVICE_ID = "service_ubagizp"; // ← PASTE YOUR SERVICE ID HERE
const TEMPLATE_ID = "template_gotg4dx"; // ← PASTE YOUR TEMPLATE ID HERE
const PUBLIC_KEY = "hw6SgQGc39aytgaBG"; // ← PASTE YOUR PUBLIC KEY HERE

export const sendContactEmail = async (formData) => {
  try {
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      subject: formData.subject,
      message: formData.message,
      to_email: "fortunateolawale7@gmail.com",
    };

    console.log("Sending with:", { SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY });
    console.log("Template params:", templateParams);

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY,
    );
    console.log("Email sent successfully!", response);
    return { success: true, response };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, error: error.text };
  }
};
