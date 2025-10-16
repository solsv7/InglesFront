import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiMiniHome, HiMiniUserGroup, HiMiniPhone } from "react-icons/hi2";
import { FaChevronRight } from "react-icons/fa";
import './Navbar.css';

const Navbar = ({ showNavbar }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation(); // Hook para obtener la ubicación actual

  // Efecto para cerrar el navbar cuando cambia la ruta
  useEffect(() => {
    setOpen(false);
  }, [location]); // Se ejecuta cuando location cambia

  if (!showNavbar) return null;

  // Función para manejar el clic en los enlaces
  const handleLinkClick = () => {
    setOpen(false); // Cerrar el navbar inmediatamente al hacer clic
  };

  return (
    <nav className="content-navbar">
      <div className="navbar-toggle" onClick={() => setOpen(!open)}>
        <FaChevronRight className={`navbar-toggle-arrow${open ? " open" : ""}`} />
        <span className="navbar-toggle-text">Menú</span>
        {!open && (
          <div className="navbar-toggle-icons">
            <HiMiniHome /> 
            <HiMiniUserGroup /> 
            <HiMiniPhone />
          </div>
        )}
      </div>
      <div className={`navbar-links${open ? " show" : ""}`}>
        <div>
          <HiMiniHome className="icon"/>
          <Link to="/" onClick={handleLinkClick}>Inicio</Link>
        </div>
        <div>
          <HiMiniUserGroup className="icon"/>
          <Link to="/About" onClick={handleLinkClick}>Sobre Nosotros</Link>
        </div>
        <div>
          <HiMiniPhone className="icon"/>
          <Link to="/Not-Ready" onClick={handleLinkClick}>Contacto</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;