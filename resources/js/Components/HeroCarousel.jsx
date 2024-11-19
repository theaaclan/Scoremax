// resources/js/Components/HeroCarousel.jsx
import React, { useEffect, useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

const HeroCarousel = () => {
  const [isNavbarCollapsed, setNavbarCollapsed] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Navbar scroll effect
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar');
      if (window.scrollY > 70) {
        navbar.classList.add('top-nav-collapse');
      } else {
        navbar.classList.remove('top-nav-collapse');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Manually trigger carousel automatic slide every 5 seconds
    const carouselItems = document.querySelectorAll('.carousel .carousel-item');
    const carouselIndicators = document.querySelectorAll('.carousel-indicators li');
    const interval = setInterval(() => {
      // Remove active class from previous item
      carouselItems[currentIndex].classList.remove('active');
      carouselIndicators[currentIndex].classList.remove('active');

      // Move to next item
      const nextIndex = (currentIndex + 1) % carouselItems.length;
      setCurrentIndex(nextIndex);

      // Add active class to the next item
      carouselItems[nextIndex].classList.add('active');
      carouselIndicators[nextIndex].classList.add('active');
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, [currentIndex]); // Only run the effect when currentIndex changes

  const toggleNavbar = () => {
    setNavbarCollapsed(!isNavbarCollapsed);
  };

  return (
    <div>
      {/* Navbar toggle */}
      <button
        id="navbar-toggle"
        onClick={toggleNavbar}
        className="navbar-toggler"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div id="my-nav" className={`navbar-collapse ${isNavbarCollapsed ? 'collapse' : ''}`}>
        {/* Add your navbar items here */}
      </div>

      {/* Hero Carousel */}
      <div
        id="fh5co-hero-carousel"
        className="carousel slide header"
        data-ride="carousel"
        data-interval="5000"
      >
        <div className="carousel-inner">
          <div className={`carousel-item ${currentIndex === 0 ? 'active' : ''}`}>
            <img className="d-block w-100 backgrounds" alt="backgrounds" src="images/backgrounds.jpg" />
            <div className="carousel-caption d-md-block">
              <p className="frst-hrd" style={{ color: 'white', textShadow: '-1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black' }}>Scoring Management System</p>
              <h5 style={{ color: 'white', textShadow: '-1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black' }}>Winners never quit</h5>
            </div>
          </div>
          <div className={`carousel-item ${currentIndex === 1 ? 'active' : ''}`}>
            <img className="d-block w-100 backgrounds" alt="backgrounds" src="images/background2.jpg" />
            <div className="carousel-caption d-md-block">
              <p className="frst-hrd" style={{ color: 'white', textShadow: '-1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black' }}>Scoring Management System</p>
              <h5 style={{ color: 'white', textShadow: '-1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black' }}>Rise and grind</h5>
            </div>
          </div>
          <div className={`carousel-item ${currentIndex === 2 ? 'active' : ''}`}>
            <img className="d-block w-100 backgrounds" alt="backgrounds" src="images/background3.jpg" />
            <div className="carousel-caption d-md-block">
              <p className="frst-hrd" style={{ color: 'white', textShadow: '-1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black' }}>Scoring Management System</p>
              <h5 style={{ color: 'white', textShadow: '-1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black' }}>Play with heart</h5>
            </div>
          </div>
        </div>
        <ul className="carousel-indicators">
          <li className={` ${currentIndex === 0 ? 'active' : ''}`} data-target="#fh5co-hero-carousel" data-slide-to="0"></li>
          <li className={` ${currentIndex === 1 ? 'active' : ''}`} data-target="#fh5co-hero-carousel" data-slide-to="1"></li>
          <li className={` ${currentIndex === 2 ? 'active' : ''}`} data-target="#fh5co-hero-carousel" data-slide-to="2"></li>
        </ul>
      </div>
    </div>
  );
};

export default HeroCarousel;
