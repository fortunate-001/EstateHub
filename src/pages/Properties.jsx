import React, { useState, useEffect } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase/firebase"
import PropertyCard from "../components/PropertyCard"
import "../styles/Properties.css"

function Properties() {
  const [properties, setProperties] = useState([])
  const [filteredProperties, setFilteredProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [priceRange, setPriceRange] = useState("")
  const [locations, setLocations] = useState([])

  useEffect(() => {
    fetchProperties()
  }, [])

  useEffect(() => {
    filterProperties()
  }, [searchTerm, selectedLocation, selectedType, priceRange, properties])

  const fetchProperties = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "properties"))
      const propertiesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      setProperties(propertiesData)
      setFilteredProperties(propertiesData)
      
      // Extract unique locations
      const uniqueLocations = [...new Set(propertiesData.map(p => p.location))]
      setLocations(uniqueLocations)
    } catch (error) {
      console.error("Error fetching properties:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterProperties = () => {
    let filtered = [...properties]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Location filter
    if (selectedLocation) {
      filtered = filtered.filter(property => property.location === selectedLocation)
    }

    // Type filter
    if (selectedType) {
      filtered = filtered.filter(property => property.type === selectedType)
    }

    // Price range filter
    if (priceRange) {
      const [min, max] = priceRange.split('-')
      if (max) {
        filtered = filtered.filter(property => property.price >= parseInt(min) && property.price <= parseInt(max))
      } else {
        filtered = filtered.filter(property => property.price >= parseInt(min))
      }
    }

    setFilteredProperties(filtered)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedLocation("")
    setSelectedType("")
    setPriceRange("")
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <h2>Loading Properties...</h2>
      </div>
    )
  }

  return (
    <div className="properties-page">
      <div className="properties-header">
        <h1>Find Your Dream Property</h1>
        <p>Browse through our extensive collection of properties</p>
      </div>

      {/* Search and Filter Section */}
      <div className="filters-section">
        <div className="search-bar">
          <i className='bx bx-search'></i>
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
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
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

      {/* Results Count */}
      <div className="results-count">
        Found {filteredProperties.length} properties
      </div>

      {/* Properties Grid */}
      <div className="properties-grid">
        {filteredProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="no-results">
          <i className='bx bx-home-smile'></i>
          <h3>No properties found</h3>
          <p>Try adjusting your search or filters</p>
          <button onClick={clearFilters}>Clear All Filters</button>
        </div>
      )}
    </div>
  )
}

export default Properties