import React from 'react'
import "../styles/hero.css"
import { useNavigate } from 'react-router-dom'

function Hero() {
    const navigate = useNavigate() 

  return (
    <section className="hero">

        <div className="hero-overlay"></div>

        <div className="hero-content">

            <h1>Find Your Dream Home</h1>

            <p>Discover modern apartments and luxury homes across Nigeria.</p>

            <button onClick={() => navigate("/properties")}>Explore Properties</button>

        </div>

    </section>
  )
}

export default Hero