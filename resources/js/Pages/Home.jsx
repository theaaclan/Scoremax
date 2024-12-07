import React from "react";
import Navbar from "../Layouts/Navbar"; // Import Navbar
import "@css/tailwind.css";

const Home = () => (
    <div className="h-screen overflow-hidden">
        {/* This wrapper ensures no scrolling and full-screen height */}
        <Navbar />
        <div className="flex flex-col justify-center items-center h-full">
            {/* h-full makes the container take up the full height of the screen */}
            <img
                src="images/Dark-BG.png"
                alt="Centered"
                className="w-full h-full object-cover" // Ensures the image covers the screen fully
            />
        </div>
    </div>
);

export default Home;
