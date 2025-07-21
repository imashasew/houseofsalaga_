import React from 'react'
import './Hero.css'
import heroImage from '../../Assets/heroImage.png';
import { useNavigate } from 'react-router-dom';

const Hero = () => {

     const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate('/shop');  
  };

  return (
    
        <section className="hero-section">
        <div className="hero-container">
        
            {/* Left Text */}
            <div className="hero-text">
                <h1 className="hero-title">
                    Elevate Style,<br />Embrace Story
                </h1>
                <p className="hero-description">
                    We provide the largest clothing collection for any season. You can choose trendy or classy design according to your preferences. Our services are super fast and we update within 24 hours.
                </p>
                
                 <button className="hero-button" onClick={handleExploreClick}>
                     Explore <span className="arrow">→</span>
                 </button>
            </div>

            {/* Right Image */}
            <div className="hero-image-container">
             <img src={heroImage} alt="Fashion Hero" className="hero-image" />
             <div className="hero-arch"></div>
            </div>

      </div>
    </section>
      
   
  )
}

export default Hero
