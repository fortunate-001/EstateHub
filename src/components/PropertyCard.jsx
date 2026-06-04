import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InquiryModal from "./InquiryModal";
import "../styles/PropertyCard.css";

function PropertyCard({ property }) {
  const navigate = useNavigate();
  const [showInquiry, setShowInquiry] = useState(false);
  const [imgError, setImgError] = useState(false);

  
  const fallbackImages = [
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&h=300&fit=crop",
  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&h=300&fit=crop",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&h=300&fit=crop",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&h=300&fit=crop",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&h=300&fit=crop",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500&h=300&fit=crop" 
  ];

  const getImageUrl = () => {
    if (imgError) return fallbackImages[0];
    if (property.imageUrl && property.imageUrl !== "") return property.imageUrl;
    if (property.image && property.image !== "") return property.image;
    return fallbackImages[0];
  };

  const handleImageError = () => {
    setImgError(true);
  };

  return (
    <>
      <div className="property-card-new">
        <div
          className="card-image-new"
          onClick={() => navigate(`/properties/${property.id}`)}
        >
          <img
            src={getImageUrl()}
            alt={property.title}
            onError={handleImageError}
            loading="lazy"
          />
          <div className="image-overlay-new">
            <span className="view-btn">View Property</span>
          </div>
          <div className="card-badges">
            <span className="type-badge">{property.type || "Property"}</span>
            {property.status === "Available" && (
              <span className="status-badge available">Available</span>
            )}
            {property.status === "Sold" && (
              <span className="status-badge sold">Sold</span>
            )}
            {property.status === "Pending" && (
              <span className="status-badge pending">Pending</span>
            )}
          </div>
        </div>

        <div className="card-details-new">
          <div className="price-row">
            <span className="price-new">
              ₦{property.price?.toLocaleString() || "0"}
            </span>
            <span className="price-label-new">Price</span>
          </div>

          <h3
            className="title-new"
            onClick={() => navigate(`/properties/${property.id}`)}
          >
            {property.title || "Property Title"}
          </h3>

          <p className="location-new">{property.location || "Location"}</p>

          <div className="specs-row">
            <div className="spec">
              <span className="spec-number">{property.bedrooms || 0}</span>
              <span className="spec-name">Bedrooms</span>
            </div>
            <div className="spec-divider"></div>
            <div className="spec">
              <span className="spec-number">{property.bathrooms || 0}</span>
              <span className="spec-name">Bathrooms</span>
            </div>
            <div className="spec-divider"></div>
            <div className="spec">
              <span className="spec-number">{property.size || 0}</span>
              <span className="spec-name">Sq Ft</span>
            </div>
          </div>

          <button
            className="inquiry-btn-new"
            onClick={(e) => {
              e.stopPropagation();
              setShowInquiry(true);
            }}
          >
            Request Information
          </button>
        </div>
      </div>

      {showInquiry && (
        <InquiryModal
          property={property}
          onClose={() => setShowInquiry(false)}
        />
      )}
    </>
  );
}

export default PropertyCard;
