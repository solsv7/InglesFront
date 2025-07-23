import React from 'react';
import logo from '../../assets/logo.png'; 
import './Footer.css';
import { FaFacebook, FaInstagram} from 'react-icons/fa';

const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
      <div className="footer-logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="footer-links">
        <a href="/">Inicio</a>
        <a href="/cursos">Sobre Nosotros</a>
        <a href="/eventos">Videos</a>
        <a href="/contacto">Contacto</a>
      </div>
      <div className="footer-social">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
      </div>
    </div>
    <div className="footer-bottom">
      <p>© {new Date().getFullYear()} St. Thomas Todos los derechos reservados</p>
    </div>
  </footer>
);

export default Footer;