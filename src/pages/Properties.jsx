import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import "../styles/Properties.css";

function Properties() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    filterProperties();
  }, [searchTerm, selectedLocation, selectedType, priceRange, properties]);

  const getSampleProperties = () => {
    return [
      {
        id: 1,
        title: "Spacious Family Home",
        location: "Lekki, Lagos",
        price: 250000000,
        bedrooms: 5,
        bathrooms: 4,
        size: 450,
        type: "House",
        status: "Available",
        imageUrl: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?w=600&h=400&fit=crop",
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
        status: "Available",
        imageUrl: "https://images.pexels.com/photos/164558/pexels-photo-164558.jpeg?w=600&h=400&fit=crop",
      },
      {
        id: 3,
        title: "Waterfront Property",
        location: "Victoria Island, Lagos",
        price: 380000000,
        bedrooms: 6,
        bathrooms: 5,
        size: 600,
        type: "Villa",
        status: "Available",
        imageUrl: "https://images.pexels.com/photos/2587054/pexels-photo-2587054.jpeg?w=600&h=400&fit=crop",
      },
      {
        id: 4,
        title: "Cozy Bungalow",
        location: "Bodija, Ibadan",
        price: 65000000,
        bedrooms: 3,
        bathrooms: 2,
        size: 180,
        type: "House",
        status: "Available",
        imageUrl: "https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?w=600&h=400&fit=crop",
      },
      {
        id: 5,
        title: "Luxury Penthouse",
        location: "Victoria Island, Lagos",
        price: 450000000,
        bedrooms: 4,
        bathrooms: 3,
        size: 350,
        type: "Apartment",
        status: "Available",
        imageUrl: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?w=600&h=400&fit=crop",
      },
      {
        id: 6,
        title: "Garden Estate",
        location: "Ajah, Lagos",
        price: 120000000,
        bedrooms: 4,
        bathrooms: 3,
        size: 300,
        type: "House",
        status: "Available",
        imageUrl: "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?w=600&h=400&fit=crop",
      },
    ];
  };

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "properties"));
      const propertiesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      if (propertiesData.length === 0) {
        const sampleData = getSampleProperties();
        setProperties(sampleData);
        setFilteredProperties(sampleData);
        const uniqueLocations = [...new Set(sampleData.map((p) => p.location))];
        setLocations(uniqueLocations);
      } else {
        setProperties(propertiesData);
        setFilteredProperties(propertiesData);
        const uniqueLocations = [...new Set(propertiesData.map((p) => p.location))];
        setLocations(uniqueLocations);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      const sampleData = getSampleProperties();
      setProperties(sampleData);
      setFilteredProperties(sampleData);
      const uniqueLocations = [...new Set(sampleData.map((p) => p.location))];
      setLocations(uniqueLocations);
    } finally {
      setLoading(false);
    }
  };

  const filterProperties = () => {
    let filtered = [...properties];

    if (searchTerm) {
      filtered = filtered.filter(
        (property) =>
          (property.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
          (property.location?.toLowerCase() || "").includes(searchTerm.toLowerCase())
      );
    }

    if (selectedLocation) {
      filtered = filtered.filter(
        (property) => property.location === selectedLocation
      );
    }

    if (selectedType) {
      filtered = filtered.filter((property) => property.type === selectedType);
    }

    if (priceRange) {
      const [min, max] = priceRange.split("-");
      if (max) {
        filtered = filtered.filter(
          (property) =>
            property.price >= parseInt(min) && property.price <= parseInt(max)
        );
      } else {
        filtered = filtered.filter(
          (property) => property.price >= parseInt(min)
        );
      }
    }

    setFilteredProperties(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedLocation("");
    setSelectedType("");
    setPriceRange("");
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading Properties...</p>
      </div>
    );
  }

  return (
    <div className="properties-page">
      <div className="properties-header">
        <h1>Find Your Dream Property</h1>
        <p>Browse through our extensive collection of properties</p>
      </div>

      <div className="filters-section">
        <div className="search-bar">
          <i className="bx bx-search"></i>
          <input
            type="text"
            placeholder="Search by title or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters-grid">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="filter-select"
          >
            <option value="">All Locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="filter-select"
          >
            <option value="">All Types</option>
            <option value="House">House</option>
            <option value="Apartment">Apartment</option>
            <option value="Duplex">Duplex</option>
            <option value="Villa">Villa</option>
            <option value="Land">Land</option>
            <option value="Commercial">Commercial</option>
            <option value="Mansion">Mansion</option>
          </select>

          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="filter-select"
          >
            <option value="">All Prices</option>
            <option value="0-50000000">Under ₦50M</option>
            <option value="50000000-100000000">₦50M - ₦100M</option>
            <option value="100000000-200000000">₦100M - ₦200M</option>
            <option value="200000000-500000000">₦200M - ₦500M</option>
            <option value="500000000-999999999">₦500M+</option>
          </select>

          <button className="clear-filters-btn" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      </div>

      <div className="results-count">
        Found <span>{filteredProperties.length}</span> properties
      </div>

      <div className="properties-grid">
        {filteredProperties.map((property) => (
          <div 
            key={property.id} 
            className="property-card"
            onClick={() => navigate(`/properties/${property.id}`)}
          >
            <div className="property-image">
              <img 
                src={property.imageUrl} 
                alt={property.title}
                onError={(e) => {
                  e.target.src = "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?w=600&h=400&fit=crop";
                }}
              />
              <span className="property-type">{property.type}</span>
              <div className="property-overlay">
                <button className="view-property-btn">View Details</button>
              </div>
            </div>
            <div className="property-info">
              <h3 className="property-title">{property.title}</h3>
              <p className="property-location">
                <i className="bx bx-map-pin"></i> {property.location}
              </p>
              <p className="property-price">₦{property.price?.toLocaleString()}</p>
              <div className="property-features">
                <span><i className="bx bx-bed"></i> {property.bedrooms || 0} beds</span>
                <span><i className="bx bx-bath"></i> {property.bathrooms || 0} baths</span>
                <span><i className="bx bx-area"></i> {property.size || 0} sqft</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="no-results">
          <i className="bx bx-home-smile"></i>
          <h3>No properties found</h3>
          <p>Try adjusting your search or filters</p>
          <button onClick={clearFilters}>Clear All Filters</button>
        </div>
      )}
    </div>
  );
}

export default Properties;