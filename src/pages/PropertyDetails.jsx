import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { doc, getDoc, collection, getDocs, query, limit, where } from "firebase/firestore";
import { db } from "../firebase/firebase";
import "../styles/PropertyDetails.css";

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInquiry, setShowInquiry] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);

  const getSampleProperties = () => {
    return [
      {
        id: 1,
        title: "Luxury Duplex",
        location: "Lekki, Lagos",
        price: 250000000,
        bedrooms: 5,
        bathrooms: 4,
        size: 450,
        type: "Duplex",
        imageUrl: "https://picsum.photos/id/104/800/600",
        description: "This stunning luxury duplex in the heart of Lekki features modern architecture, high-end finishes, and breathtaking views. The property includes a private swimming pool, state-of-the-art kitchen, smart home technology, and 24/7 security.",
        features: ["Swimming Pool", "Smart Home", "24/7 Security", "Parking", "Gym", "Garden", "Solar Panels", "CCTV"],
        yearBuilt: 2022,
        propertyId: "LUX-DUP-001"
      },
      {
        id: 2,
        title: "Modern Apartment",
        location: "Abuja",
        price: 170000000,
        bedrooms: 3,
        bathrooms: 2,
        size: 200,
        type: "Apartment",
        imageUrl: "https://picsum.photos/id/20/800/600",
        description: "Contemporary apartment in the heart of Abuja with stunning city views. Features include modern finishes, spacious rooms, and excellent security.",
        features: ["City View", "Modern Kitchen", "Security", "Parking", "Elevator", "AC Units"],
        yearBuilt: 2021,
        propertyId: "MOD-APT-002"
      },
      {
        id: 3,
        title: "Beach Villa",
        location: "Victoria Island, Lagos",
        price: 380000000,
        bedrooms: 6,
        bathrooms: 5,
        size: 600,
        type: "Villa",
        imageUrl: "https://picsum.photos/id/15/800/600",
        description: "Exclusive beachfront villa offering private beach access, stunning ocean views, and world-class amenities.",
        features: ["Beach Access", "Ocean View", "Private Pool", "Spa", "Staff Quarters", "Backup Generator"],
        yearBuilt: 2020,
        propertyId: "BCH-VIL-003"
      }
    ];
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, "properties", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const propertyData = { id: docSnap.id, ...docSnap.data() };
          setProperty(propertyData);
        } else {
          const sampleProperty = getSampleProperties().find(p => p.id == id);
          if (sampleProperty) {
            setProperty(sampleProperty);
          } else {
            setProperty(getSampleProperties()[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching property:", error);
        setProperty(getSampleProperties()[0]);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const galleryImages = property ? [
    property.imageUrl,
    property.imageUrl?.replace("800/600", "801/601"),
    property.imageUrl?.replace("800/600", "802/602"),
    property.imageUrl?.replace("800/600", "803/603"),
  ] : [];

  if (loading) {
    return (
      <div className="loading-container-new">
        <div className="loader-new"></div>
        <p>Loading property details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="not-found-new">
        <div className="not-found-content">
          <i className="bx bx-home-smile"></i>
          <h1>Property Not Found</h1>
          <p>The property you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate("/properties")}>Browse Properties</button>
        </div>
      </div>
    );
  }

  return (
    <div className="property-details-new">
      {/* Hero Section */}
      <div className="property-hero">
        <div className="hero-background">
          <img src={property.imageUrl} alt={property.title} />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <button className="back-button" onClick={() => navigate(-1)}>
            <i className="bx bx-arrow-back"></i> Back to Properties
          </button>
          <div className="hero-text">
            <h1>{property.title}</h1>
            <p><i className="bx bx-map-pin"></i> {property.location}</p>
            <div className="hero-price">
              <span className="price-label">Starting from</span>
              <span className="price-value">₦{property.price?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="property-content-new">
        <div className="container-new">
          <div className="content-grid">
            {/* Left Column - Main Info */}
            <div className="main-info">
              {/* Image Gallery */}
              <div className="gallery-section">
                <div className="main-gallery-image">
                  <img src={galleryImages[activeImage]} alt={property.title} />
                </div>
                <div className="gallery-thumbnails">
                  {galleryImages.map((img, index) => (
                    <div 
                      key={index} 
                      className={`thumbnail ${activeImage === index ? 'active' : ''}`}
                      onClick={() => setActiveImage(index)}
                    >
                      <img src={img} alt={`View ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="info-card">
                <h2><i className="bx bx-info-circle"></i> Description</h2>
                <p>{property.description}</p>
              </div>

              {/* Features */}
              <div className="info-card">
                <h2><i className="bx bx-star"></i> Key Features</h2>
                <div className="features-grid-new">
                  {property.features?.map((feature, index) => (
                    <div key={index} className="feature-item-new">
                      <i className="bx bx-check-circle"></i>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specifications */}
              <div className="info-card">
                <h2><i className="bx bx-detail"></i> Specifications</h2>
                <div className="specs-grid-new">
                  <div className="spec-item">
                    <i className="bx bx-bed"></i>
                    <div>
                      <span className="spec-label">Bedrooms</span>
                      <span className="spec-value">{property.bedrooms || 3}</span>
                    </div>
                  </div>
                  <div className="spec-item">
                    <i className="bx bx-bath"></i>
                    <div>
                      <span className="spec-label">Bathrooms</span>
                      <span className="spec-value">{property.bathrooms || 2}</span>
                    </div>
                  </div>
                  <div className="spec-item">
                    <i className="bx bx-area"></i>
                    <div>
                      <span className="spec-label">Area Size</span>
                      <span className="spec-value">{property.size || 200} sqft</span>
                    </div>
                  </div>
                  <div className="spec-item">
                    <i className="bx bx-building-house"></i>
                    <div>
                      <span className="spec-label">Property Type</span>
                      <span className="spec-value">{property.type || "Property"}</span>
                    </div>
                  </div>
                  {property.yearBuilt && (
                    <div className="spec-item">
                      <i className="bx bx-calendar"></i>
                      <div>
                        <span className="spec-label">Year Built</span>
                        <span className="spec-value">{property.yearBuilt}</span>
                      </div>
                    </div>
                  )}
                  {property.propertyId && (
                    <div className="spec-item">
                      <i className="bx bx-barcode"></i>
                      <div>
                        <span className="spec-label">Property ID</span>
                        <span className="spec-value">{property.propertyId}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Contact & Actions */}
            <div className="sidebar-info">
              {/* Price Card */}
              <div className="sidebar-card price-card">
                <div className="price-header">
                  <h3>Property Price</h3>
                </div>
                <div className="price-display">
                  ₦{property.price?.toLocaleString()}
                </div>
                <button 
                  className="contact-agent-btn"
                  onClick={() => setShowContactForm(!showContactForm)}
                >
                  <i className="bx bx-chat"></i> Contact Agent
                </button>
              </div>

              {/* Contact Form */}
              {showContactForm && (
                <div className="sidebar-card contact-form-card">
                  <h3><i className="bx bx-envelope"></i> Send Message</h3>
                  <form className="quick-contact-form">
                    <input type="text" placeholder="Your Name" />
                    <input type="email" placeholder="Your Email" />
                    <input type="tel" placeholder="Your Phone" />
                    <textarea rows="3" placeholder="I'm interested in this property..."></textarea>
                    <button type="submit" className="send-message-btn">
                      Send Message <i className="bx bx-send"></i>
                    </button>
                  </form>
                </div>
              )}

              {/* WhatsApp Button */}
              <div className="sidebar-card whatsapp-card">
                <button 
                  className="whatsapp-btn-large"
                  onClick={() => window.open(`https://wa.me/2347011715312?text=Hello! I'm interested in ${property.title}`, '_blank')}
                >
                  <i className="bx bxl-whatsapp"></i> Inquire on WhatsApp
                </button>
              </div>

              {/* Property Highlights */}
              <div className="sidebar-card highlights-card">
                <h3><i className="bx bx-trophy"></i> Property Highlights</h3>
                <ul>
                  <li><i className="bx bx-check"></i> Prime Location</li>
                  <li><i className="bx bx-check"></i> Modern Amenities</li>
                  <li><i className="bx bx-check"></i> Secure Neighborhood</li>
                  <li><i className="bx bx-check"></i> Easy Access to Roads</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetails;