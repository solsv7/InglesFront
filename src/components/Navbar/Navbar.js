import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiMiniHome, HiMiniUserGroup, HiMiniPhone, HiMiniFilm } from "react-icons/hi2";
import { FaChevronRight } from "react-icons/fa";
import './Navbar.css';

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="content-navbar">
      {/* Botón solo visible en mobile */}
      <div className="navbar-toggle" onClick={() => setOpen(!open)}>
        
        <FaChevronRight
          className={`navbar-toggle-arrow${open ? " open" : ""}`}
        />
        <span className="navbar-toggle-text">{!open && "Enlaces"}</span>
      </div>
      {/* Links, visibles solo si open o en desktop */}
      <div className={`navbar-links${open ? " show" : ""}`}>
        <div><HiMiniHome className="icon"/><Link to="/">Inicio</Link></div>
        <div><HiMiniUserGroup className="icon"/><Link to="/About">Sobre Nosotros</Link></div>
        <div><HiMiniFilm className="icon"/><Link to="/All-Vids">Videos</Link></div>
        <div><HiMiniPhone className="icon"/><Link to="/Not-Ready">Contacto</Link></div>
      </div>
    </nav>
  );
};

export default Navbar;