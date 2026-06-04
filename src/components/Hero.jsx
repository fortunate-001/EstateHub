import React from "react";
import "../styles/hero.css";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-grid">
        <div className="hero-content-left">
          
          <h1 className="hero-main-title">
            Discover Your <span className="title-accent">Perfect Property</span>
          </h1>
          
          <p className="hero-subtitle">
            From luxury apartments to family homes, we help you find the property of your dreams in Nigeria's most desirable locations.
          </p>
          
          <div className="hero-actions">
            <button className="hero-primary-btn" onClick={() => navigate("/properties")}>
              Start Exploring
              <i className="bx bx-chevron-right"></i>
            </button>
            <div className="hero-trust-badge">
              <div className="trust-avatars">
                <img src="https://randomuser.me/api/portraits/women/1.jpg" alt="user" />
                <img src="https://randomuser.me/api/portraits/men/2.jpg" alt="user" />
                <img src="https://randomuser.me/api/portraits/women/3.jpg" alt="user" />
                <span className="avatar-count">1k+</span>
              </div>
              <div className="trust-text">
                <strong>Trusted by 1000+</strong>
                <span>Happy Homeowners</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-content-right">
          <div className="hero-card-stack">
            <div className="hero-card card-1">
              <div className="card-img">
                <img src="https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?w=400&h=300&fit=crop" alt="property" />
              </div>
              <div className="card-info">
                <h4>Luxury Duplex</h4>
                <p>Lekki, Lagos</p>
                <span className="card-price">₦250M</span>
              </div>
            </div>
            <div className="hero-card card-2">
              <div className="card-img">
                <img src="https://images.pexels.com/photos/164558/pexels-photo-164558.jpeg?w=400&h=300&fit=crop" alt="property" />
              </div>
              <div className="card-info">
                <h4>Modern Apartment</h4>
                <p>Abuja</p>
                <span className="card-price">₦170M</span>
              </div>
            </div>
            <div className="hero-card card-3">
              <div className="card-img">
                <img src="https://images.pexels.com/photos/2587054/pexels-photo-2587054.jpeg?w=400&h=300&fit=crop" alt="property" />
              </div>
              <div className="card-info">
                <h4>Beach Villa</h4>
                <p>Victoria Island</p>
                <span className="card-price">₦380M</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;