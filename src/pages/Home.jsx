import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Hero from "../components/Hero"
import PropertyCard from "../components/PropertyCard"
import { collection, getDocs, query, limit } from "firebase/firestore"
import { db } from "../firebase/firebase"
import "../styles/Home.css"

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

const fadeInLeft = {
  hidden: { opacity: 0, x: -80 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

const fadeInRight = {
  hidden: { opacity: 0, x: 80 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
}

const scaleOnHover = {
  whileHover: { scale: 1.05, transition: { duration: 0.3 } }
}

const pulseAnimation = {
  animate: {
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
  }
}

function Home() {
  const [featuredProperties, setFeaturedProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const currentYear = new Date().getFullYear()

  useEffect(() => {
    fetchFeaturedProperties()
  }, [])

  const fetchFeaturedProperties = async () => {
    try {
      setLoading(true)
      const q = query(collection(db, "properties"), limit(6))
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) {
        setFeaturedProperties(getSampleProperties())
      } else {
        const propertiesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
        setFeaturedProperties(propertiesData)
      }
    } catch (error) {
      console.error("Error fetching properties:", error)
      setError("Unable to load properties. Using sample data instead.")
      setFeaturedProperties(getSampleProperties())
    } finally {
      setLoading(false)
    }
  }

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
        imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994"
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
        imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"
      },
      {
        id: 3,
        title: "Beach Villa",
        location: "Victoria Island",
        price: 380000000,
        bedrooms: 6,
        bathrooms: 5,
        size: 600,
        type: "Villa",
        imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750"
      },
      {
        id: 4,
        title: "Cozy Bungalow",
        location: "Ikeja, Lagos",
        price: 85000000,
        bedrooms: 3,
        bathrooms: 2,
        size: 180,
        type: "House",
        imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6"
      },
      {
        id: 5,
        title: "Skyline Penthouse",
        location: "Victoria Island",
        price: 450000000,
        bedrooms: 4,
        bathrooms: 3,
        size: 350,
        type: "Apartment",
        imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
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
        imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9"
      }
    ]
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <Hero />

      

      {/* Stats Section with Animation */}
      <motion.section 
        className="stats-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <div className="container">
          <div className="stats-grid">
            <motion.div className="stat-item" variants={fadeInUp} whileHover={{ scale: 1.05, y: -5 }}>
              <div className="stat-number">500+</div>
              <div className="stat-label">Properties Sold</div>
            </motion.div>
            <motion.div className="stat-item" variants={fadeInUp} whileHover={{ scale: 1.05, y: -5 }}>
              <div className="stat-number">1000+</div>
              <div className="stat-label">Happy Clients</div>
            </motion.div>
            <motion.div className="stat-item" variants={fadeInUp} whileHover={{ scale: 1.05, y: -5 }}>
              <div className="stat-number">50+</div>
              <div className="stat-label">Expert Agents</div>
            </motion.div>
            <motion.div className="stat-item" variants={fadeInUp} whileHover={{ scale: 1.05, y: -5 }}>
              <div className="stat-number">10+</div>
              <div className="stat-label">Years Experience</div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Featured Properties Section - REDESIGNED */}
<motion.section 
  className="featured-section-new"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.2 }}
  variants={staggerContainer}
>
  <div className="container">
    <motion.div className="section-header-new" variants={fadeInUp}>
      <span className="section-badge">🔥 HOT PROPERTIES</span>
      <h2>Featured <span className="highlight">Properties</span></h2>
      <p>Discover our most exclusive and luxurious properties handpicked just for you</p>
    </motion.div>

    {loading ? (
      <div className="loading-skeleton-new">
        {[1, 2, 3].map((item) => (
          <div key={item} className="skeleton-card-new">
            <div className="skeleton-image-new"></div>
            <div className="skeleton-content-new">
              <div className="skeleton-title-new"></div>
              <div className="skeleton-text-new"></div>
              <div className="skeleton-price-new"></div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <>
        {/* Featured Properties Grid */}
        <div className="properties-grid-new">
          {featuredProperties.slice(0, 3).map((property, index) => (
            <motion.div
              key={property.id}
              className="property-card-new featured-card"
              variants={fadeInUp}
              custom={index}
              whileHover={{ y: -15, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="card-badge">
                {index === 0 && <span className="badge-hot">HOT 🔥</span>}
                {index === 1 && <span className="badge-new">NEW ✨</span>}
                {index === 2 && <span className="badge-best">BEST 💎</span>}
              </div>
              <div className="card-image">
                <img src={property.imageUrl} alt={property.title} />
                <div className="image-overlay">
                  <button className="view-details-btn" onClick={() => window.location.href = `/properties/${property.id}`}>
                    View Details
                  </button>
                </div>
                <div className="property-type-badge">{property.type}</div>
              </div>
              <div className="card-content">
                <div className="price-section">
                  <span className="price-label">Starting from</span>
                  <h3 className="price">₦{property.price?.toLocaleString()}</h3>
                </div>
                <h2 className="property-title">{property.title}</h2>
                <p className="property-location">
                  <i className='bx bx-map-pin'></i> {property.location}
                </p>
                <div className="property-features">
                  <div className="feature">
                    <i className='bx bx-bed'></i>
                    <span>{property.bedrooms} Beds</span>
                  </div>
                  <div className="feature">
                    <i className='bx bx-bath'></i>
                    <span>{property.bathrooms} Baths</span>
                  </div>
                  <div className="feature">
                    <i className='bx bx-area'></i>
                    <span>{property.size} sqft</span>
                  </div>
                </div>
                <div className="card-footer">
                  <button className="inquiry-btn" onClick={() => window.location.href = `/properties/${property.id}`}>
                    View Property <i className='bx bx-right-arrow-alt'></i>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* More Properties Grid */}
        <div className="more-properties">
          <div className="more-header">
            <h3>More Amazing Properties</h3>
            <span className="more-line"></span>
          </div>
          <div className="more-grid">
            {featuredProperties.slice(3, 6).map((property) => (
              <motion.div
                key={property.id}
                className="property-card-horizontal"
                whileHover={{ x: 10 }}
              >
                <div className="horizontal-image">
                  <img src={property.imageUrl} alt={property.title} />
                </div>
                <div className="horizontal-content">
                  <h4>{property.title}</h4>
                  <p className="horizontal-location">{property.location}</p>
                  <div className="horizontal-price">₦{property.price?.toLocaleString()}</div>
                  <div className="horizontal-features">
                    <span>{property.bedrooms} beds</span>
                    <span>{property.bathrooms} baths</span>
                    <span>{property.size} sqft</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </>
    )}

    <motion.div className="view-all-btn-new" variants={fadeInUp}>
      <button onClick={() => window.location.href = '/properties'}>
        Explore All Properties <i className='bx bx-arrow-right'></i>
      </button>
    </motion.div>
  </div>
</motion.section>

      {/* Services Section */}
      <motion.section 
        className="services-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <div className="container">
          <motion.div className="section-header" variants={fadeInUp}>
            <h2>Our Services</h2>
            <p>What we offer to help you find your dream home</p>
          </motion.div>
          <div className="services-grid">
            <motion.div className="service-card" variants={fadeInUp} whileHover={{ y: -10, scale: 1.05 }}>
              <div className="service-icon">
                <i className='bx bx-search-alt'></i>
              </div>
              <h3>Property Search</h3>
              <p>Find the perfect property matching your preferences and budget</p>
            </motion.div>
            <motion.div className="service-card" variants={fadeInUp} whileHover={{ y: -10, scale: 1.05 }}>
              <div className="service-icon">
                <i className='bx bx-dollar-circle'></i>
              </div>
              <h3>Best Prices</h3>
              <p>Get the best market prices with our expert negotiation</p>
            </motion.div>
            <motion.div className="service-card" variants={fadeInUp} whileHover={{ y: -10, scale: 1.05 }}>
              <div className="service-icon">
                <i className='bx bx-shield-quarter'></i>
              </div>
              <h3>Secure Deals</h3>
              <p>Safe and transparent transactions with legal support</p>
            </motion.div>
            <motion.div className="service-card" variants={fadeInUp} whileHover={{ y: -10, scale: 1.05 }}>
              <div className="service-icon">
                <i className='bx bx-support'></i>
              </div>
              <h3>24/7 Support</h3>
              <p>Round-the-clock customer support for all your needs</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Why Choose Us Section */}
      <motion.section 
        className="why-us-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <div className="container">
          <div className="why-us-content">
            <motion.div className="why-us-text" variants={fadeInLeft}>
              <h2>Why Choose EstateHub?</h2>
              <p>We are Nigeria's most trusted real estate platform with years of experience in helping people find their dream homes.</p>
              
              <div className="features-list">
                <motion.div className="feature-item" variants={fadeInUp} whileHover={{ x: 10 }}>
                  <i className='bx bx-check-circle'></i>
                  <div>
                    <h4>Verified Properties</h4>
                    <p>All properties are thoroughly verified before listing</p>
                  </div>
                </motion.div>
                <motion.div className="feature-item" variants={fadeInUp} whileHover={{ x: 10 }}>
                  <i className='bx bx-check-circle'></i>
                  <div>
                    <h4>Expert Agents</h4>
                    <p>Professional real estate agents to guide you</p>
                  </div>
                </motion.div>
                <motion.div className="feature-item" variants={fadeInUp} whileHover={{ x: 10 }}>
                  <i className='bx bx-check-circle'></i>
                  <div>
                    <h4>Best Deals</h4>
                    <p>Competitive prices and exclusive offers</p>
                  </div>
                </motion.div>
                <motion.div className="feature-item" variants={fadeInUp} whileHover={{ x: 10 }}>
                  <i className='bx bx-check-circle'></i>
                  <div>
                    <h4>Easy Process</h4>
                    <p>Simple and transparent buying process</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
            <motion.div className="why-us-image" variants={fadeInRight}>
              <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3" alt="Why choose us" />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section 
        className="testimonials-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <div className="container">
          <motion.div className="section-header" variants={fadeInUp}>
            <h2>What Our Clients Say</h2>
            <p>Real stories from happy homeowners</p>
          </motion.div>
          <div className="testimonials-grid">
            <motion.div className="testimonial-card" variants={fadeInUp} whileHover={{ y: -10 }}>
              <div className="testimonial-text">
                <i className='bx bxs-quote-left'></i>
                <p>EstateHub helped me find my dream home in Lekki within a week! The process was smooth and professional.</p>
              </div>
              <div className="testimonial-author">
                <img src="https://randomuser.me/api/portraits/women/1.jpg" alt="Client" />
                <div>
                  <h4>Sarah Johnson</h4>
                  <p>Homeowner in Lekki</p>
                </div>
              </div>
            </motion.div>
            <motion.div className="testimonial-card" variants={fadeInUp} whileHover={{ y: -10 }}>
              <div className="testimonial-text">
                <i className='bx bxs-quote-left'></i>
                <p>The team at EstateHub is amazing! They found me a perfect apartment in Abuja that matched all my requirements.</p>
              </div>
              <div className="testimonial-author">
                <img src="https://randomuser.me/api/portraits/men/2.jpg" alt="Client" />
                <div>
                  <h4>Michael Okonkwo</h4>
                  <p>Investor in Abuja</p>
                </div>
              </div>
            </motion.div>
            <motion.div className="testimonial-card" variants={fadeInUp} whileHover={{ y: -10 }}>
              <div className="testimonial-text">
                <i className='bx bxs-quote-left'></i>
                <p>Professional service from start to finish. I highly recommend EstateHub for anyone looking to buy or sell property.</p>
              </div>
              <div className="testimonial-author">
                <img src="https://randomuser.me/api/portraits/women/3.jpg" alt="Client" />
                <div>
                  <h4>Amara Eze</h4>
                  <p>Property Seller</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Blog/News Section */}
      <motion.section 
        className="blog-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <div className="container">
          <motion.div className="section-header" variants={fadeInUp}>
            <h2>Latest News & Articles</h2>
            <p>Stay updated with real estate trends</p>
          </motion.div>
          <div className="blog-grid">
            <motion.div className="blog-card" variants={fadeInUp} whileHover={{ y: -10, scale: 1.02 }}>
              <div className="blog-image">
                <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3" alt="Blog" />
                <span className="blog-category">Market News</span>
              </div>
              <div className="blog-content">
                <h3>Lagos Property Market 2024: What to Expect</h3>
                <p>Discover the latest trends and predictions for the Lagos real estate market this year.</p>
                <a href="#">Read More →</a>
              </div>
            </motion.div>
            <motion.div className="blog-card" variants={fadeInUp} whileHover={{ y: -10, scale: 1.02 }}>
              <div className="blog-image">
                <img src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688" alt="Blog" />
                <span className="blog-category">Tips & Advice</span>
              </div>
              <div className="blog-content">
                <h3>10 Tips for First-Time Home Buyers</h3>
                <p>Essential advice for anyone looking to purchase their first property.</p>
                <a href="#">Read More →</a>
              </div>
            </motion.div>
            <motion.div className="blog-card" variants={fadeInUp} whileHover={{ y: -10, scale: 1.02 }}>
              <div className="blog-image">
                <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750" alt="Blog" />
                <span className="blog-category">Investment</span>
              </div>
              <div className="blog-content">
                <h3>Best Areas to Invest in Lagos 2024</h3>
                <p>Top locations for real estate investment with high returns.</p>
                <a href="#">Read More →</a>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Partners Section */}
      <motion.section 
        className="partners-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={staggerContainer}
      >
        <div className="container">
          <motion.div className="section-header" variants={fadeInUp}>
            <h2>Our Trusted Partners</h2>
            <p>We work with the best in the industry</p>
          </motion.div>
          <motion.div className="partners-grid" variants={staggerContainer}>
            <motion.div className="partner-logo" variants={fadeInUp} whileHover={{ scale: 1.1 }}>🏦 Bank of Nigeria</motion.div>
            <motion.div className="partner-logo" variants={fadeInUp} whileHover={{ scale: 1.1 }}>🏢 Lagos State Govt</motion.div>
            <motion.div className="partner-logo" variants={fadeInUp} whileHover={{ scale: 1.1 }}>🏠 Real Estate Assoc</motion.div>
            <motion.div className="partner-logo" variants={fadeInUp} whileHover={{ scale: 1.1 }}>🔒 Mortgage Hub</motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="cta-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={staggerContainer}
      >
        <div className="container">
          <motion.div className="cta-content" variants={fadeInUp}>
            <h2>Ready to Find Your Dream Home?</h2>
            <p>Contact us today and let our experts help you find the perfect property</p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/contact'}
            >
              Get Started Now <i className='bx bx-right-arrow-alt'></i>
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-about">
              <h3 className="footer-logo"> EstateHub</h3>
              <p>Your trusted partner in finding the perfect home in Nigeria.</p>
              <div className="footer-social">
                <motion.a href="#" whileHover={{ y: -3 }}><i className='bx bxl-facebook'></i></motion.a>
                <motion.a href="#" whileHover={{ y: -3 }}><i className='bx bxl-twitter'></i></motion.a>
                <motion.a href="#" whileHover={{ y: -3 }}><i className='bx bxl-instagram'></i></motion.a>
                <motion.a href="#" whileHover={{ y: -3 }}><i className='bx bxl-whatsapp'></i></motion.a>
              </div>
            </div>
            <div className="footer-links">
              <h3>Quick Links</h3>
              <ul>
                <li onClick={() => window.location.href = '/'}>Home</li>
                <li onClick={() => window.location.href = '/properties'}>Properties</li>
                <li onClick={() => window.location.href = '/contact'}>Contact</li>
              </ul>
            </div>
            <div className="footer-contact">
              <h3>Contact Info</h3>
              <ul>
                <li><i className='bx bx-map'></i> Lekki, Lagos, Nigeria</li>
                <li><i className='bx bx-phone'></i> +234 812 345 6789</li>
                <li><i className='bx bx-envelope'></i> info@estatehub.com</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {currentYear} EstateHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home