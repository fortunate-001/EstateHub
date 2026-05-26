import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import InquiryModal from "../components/InquiryModal";
import "../styles/PropertyDetails.css";

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInquiry, setShowInquiry] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const docRef = doc(db, "properties", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProperty({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (!property) {
    return (
      <div className="not-found">
        <h1>Property Not Found</h1>
        <button onClick={() => navigate("/")}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className="property-details">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="details-container">
        <img
          src={property.imageUrl || property.image}
          alt={property.title}
          className="details-image"
        />

        <div className="details-content">
          <h1>{property.title}</h1>
          <p className="details-location">📍 {property.location}</p>
          <p className="details-price">₦{property.price?.toLocaleString()}</p>

          <div className="details-specs">
            <div className="spec">
              <span className="spec-label">Bedrooms:</span>
              <span className="spec-value">{property.bedrooms || 3}</span>
            </div>
            <div className="spec">
              <span className="spec-label">Bathrooms:</span>
              <span className="spec-value">{property.bathrooms || 2}</span>
            </div>
            <div className="spec">
              <span className="spec-label">Size:</span>
              <span className="spec-value">{property.size || 200} sqft</span>
            </div>
          </div>

          <div className="details-description">
            <h3>Description</h3>
            <p>
              {property.description ||
                "This beautiful property offers modern amenities and a prime location."}
            </p>
          </div>

          <button
            className="whatsapp-contact-btn"
            onClick={() => setShowInquiry(true)}
          >
            <i className="bx bxl-whatsapp"></i> Inquire on WhatsApp
          </button>
        </div>
      </div>

      {showInquiry && (
        <InquiryModal
          property={property}
          onClose={() => setShowInquiry(false)}
        />
      )}
    </div>
  );
}

export default PropertyDetails;
