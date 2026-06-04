import React, { useState } from "react";
import { db } from "../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { sendContactEmail } from "../data/emailjs";
import "../styles/Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      // Save to Firestore
      await addDoc(collection(db, "contacts"), {
        ...formData,
        createdAt: serverTimestamp(),
        status: "unread",
      });

      // Send email via EmailJS
      const emailResult = await sendContactEmail(formData);

      if (emailResult.success) {
        setSuccess(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(
          "Email sending failed, but your message was saved. We will contact you soon.",
        );
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const phoneNumber = "2348123456789";
  const emailAddress = "fortunateolawale7@gmail.com";

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>Get in touch with us for any inquiries</p>
      </div>

      <div className="contact-container">
        <div className="contact-info">
          <div className="info-card">
            <i className="bx bx-phone"></i>
            <h3>Phone</h3>
            <p>+234 812 345 6789</p>
            <p>+234 801 234 5678</p>
          </div>

          <div className="info-card">
            <i className="bx bx-envelope"></i>
            <h3>Email</h3>
            <p>{emailAddress}</p>
            <p>support@estatehub.com</p>
          </div>

          <div className="info-card">
            <i className="bx bx-map"></i>
            <h3>Address</h3>
            <p>Lekki Phase 1, Lagos</p>
            <p>Nigeria</p>
          </div>

          <div className="info-card">
            <i className="bx bx-time"></i>
            <h3>Working Hours</h3>
            <p>Monday - Friday: 9am - 6pm</p>
            <p>Saturday: 10am - 4pm</p>
            <p>Sunday: Closed</p>
          </div>
        </div>

        <div className="contact-form-container">
          <h2>Send us a Message</h2>
          {success && (
            <div className="success-alert">
              <i className="bx bx-check-circle"></i>
              Message sent successfully! We'll get back to you soon.
            </div>
          )}
          {error && (
            <div className="error-alert">
              <i className="bx bx-error-circle"></i>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
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
            </div>

            <div className="form-group">
              <label>Subject *</label>
              <input
                type="text"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                placeholder="Message subject"
              />
            </div>

            <div className="form-group">
              <label>Message *</label>
              <textarea
                name="message"
                rows="5"
                required
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message here..."
              ></textarea>
            </div>

            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>

      <div className="map-section">
        <iframe
          title="Location Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.123456789!2d3.456789!3d6.456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3c9e2!2sLekki%20Phase%201%2C%20Lagos!5e0!3m2!1sen!2sng!4v1234567890!5m2!1sen!2sng"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
}

export default Contact;
