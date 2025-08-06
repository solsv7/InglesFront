import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiMiniHome, HiMiniUserGroup, HiMiniPhone, HiMiniFilm } from "react-icons/hi2";
import { FaChevronRight } from "react-icons/fa";
import './Navbar.css';

const Navbar = ({ showNavbar }) => {
  const [open, setOpen] = useState(false);

  if (!showNavbar) return null; // No renderizar si no corresponde

  return (
    <nav className="content-navbar">
      <div className="navbar-toggle" onClick={() => setOpen(!open)}>
        <FaChevronRight className={`navbar-toggle-arrow${open ? " open" : ""}`} />
        <span className="navbar-toggle-text">{!open && (
    <div className="navbar-toggle-icons">
      <HiMiniHome /> 
      <HiMiniUserGroup /> 
      <HiMiniPhone />
    </div>
  )}</span>
      </div>
      <div className={`navbar-links${open ? " show" : ""}`}>
        <div><HiMiniHome className="icon"/><Link to="/">Inicio</Link></div>
        <div><HiMiniUserGroup className="icon"/><Link to="/About">Sobre Nosotros</Link></div>
        <div><HiMiniPhone className="icon"/><Link to="/Not-Ready">Contacto</Link></div>
      </div>
    </nav>
  );
};

export default Navbar;
