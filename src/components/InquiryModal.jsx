import React, { useState } from "react";
import { db } from "../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";
import "../styles/InquiryModal.css";

function InquiryModal({ property, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const phoneNumber = "2348012345678"; // Replace with your WhatsApp number

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Save inquiry to Firestore
      await addDoc(collection(db, "inquiries"), {
        ...formData,
        property: property?.title || "General Inquiry",
        propertyId: property?.id,
        createdAt: new Date(),
        status: "unread",
      });

      // Send to WhatsApp
      const whatsappMessage = `*New Property Inquiry!*\n\n*Name:* ${formData.name}\n*Email:* ${formData.email}\n*Phone:* ${formData.phone}\n*Property:* ${property?.title || "General Inquiry"}\n*Location:* ${property?.location || "N/A"}\n\n*Message:* ${formData.message}`;
      const encodedMessage = encodeURIComponent(whatsappMessage);
      window.open(
        `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
        "_blank",
      );

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error saving inquiry:", error);
      alert("Error sending inquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="inquiry-modal-overlay" onClick={onClose}>
      <div className="inquiry-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>
          <i className="bx bx-x"></i>
        </button>

        {!success ? (
          <>
            <div className="modal-header">
              <i className="bx bxl-whatsapp"></i>
              <h2>Inquire About {property?.title || "Property"}</h2>
              <p>Fill the form and we'll respond on WhatsApp</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Your Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your WhatsApp number"
                />
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={`I'm interested in ${property?.title} in ${property?.location}. Please contact me with more information.`}
                ></textarea>
              </div>

              <button
                type="submit"
                className="submit-inquiry"
                disabled={submitting}
              >
                <i className="bx bxl-whatsapp"></i>
                {submitting ? "Sending..." : "Send Inquiry on WhatsApp"}
              </button>
            </form>
          </>
        ) : (
          <div className="success-message">
            <i className="bx bx-check-circle"></i>
            <h3>Inquiry Sent Successfully!</h3>
            <p>We'll contact you on WhatsApp shortly.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default InquiryModal;
