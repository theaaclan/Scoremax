// resources/js/Components/Navbar.jsx
import React from 'react';
import '../../css/style.css'; // Your custom styles 

;

const Navbar = () => (
  <div id="fh5co-hero-carousel" className="carousel slide header" data-ride="carousel">
    <nav className="navbar fixed-top navbar-expand-xl">
    

      <div className="container">
        <a className="navbar-brand mobile-logo" href="#"><img src="images/Slogo.png" alt="Vista Pro" /></a>
        <button className="navbar-toggler" data-target="#my-nav" onClick={() => {}} data-toggle="collapse">
          <span className="bar1"></span>
          <span className="bar2"></span>
          <span className="bar3"></span>
        </button>
        <div id="my-nav" className="collapse navbar-collapse">
          <div>
            <ul className="navbar-nav float-left social-links">
              <li className="nav-item">
                <a className="nav-link" href="https://www.facebook.com/fh5co"><i className="fab fa-facebook-f"></i></a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#"><i className="fab fa-pinterest-p"></i></a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="https://twitter.com/fh5co"><i className="fab fa-twitter"></i></a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#"><i className="fab fa-google-plus-g"></i></a>
              </li>
            </ul>
          </div>
          <ul className="navbar-nav mx-auto logo-desktop">
            <li className="nav-item active">
              <a className="nav-link" href="#"><img src="images/Slogo.png" alt="Vista Pro" /></a>
            </li>
          </ul>
          <ul className="navbar-nav float-right menu-links">
            <li className="nav-item">
              <a className="nav-link active text-white" href="index.html">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="bracket.php">Bracket</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="basketball3.php">Score</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="login">Login</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="register">Register</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
);

export default Navbar;
