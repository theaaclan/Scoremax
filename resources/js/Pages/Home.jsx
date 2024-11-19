import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/style.css"; // Your custom styles
import "../../css/style2.css"; // Additional custom styles
import Navbar from "../Components/Navbar"; // Import Navbar
import HeroCarousel from "../Components/HeroCarousel"; // Import HeroCarousel

const Home = () => (
    <>
        <Navbar />

        <HeroCarousel />
    </>
);

export default Home;
