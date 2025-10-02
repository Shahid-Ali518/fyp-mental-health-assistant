import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

import React from 'react'

const Navbar = () => {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="logo">Mental Health Assistant</div>

                {/* Desktop Menu */}
                <div className={`menu ${isOpen ? "active" : ""}`}>
                    <Link to="/audio-to-text">Audio to Text</Link>
                    <Link to="/pdf-to-audio">PDF to Audio</Link>
                    <Link to="/questionaire">Questionnaire</Link>
                </div>

                {/* Mobile Button */}
                <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? "✖" : "☰"}
                </button>
            </div>
        </nav>
    );

}

export default Navbar
