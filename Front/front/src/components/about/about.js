import React from 'react';
import './About.css'; // Asegúrate de crear este archivo CSS

const About = () => {
    return (
        <div className="about-container">
            <div className="text-section">
                <h2>Frase Inspiradora o Descripción</h2>
                <p>Esta es una frase que describe la filosofía de enseñanza o cualquier otro mensaje que desees transmitir.</p>
            </div>
            <div className="image-section">
                <img src="ruta/a/la/imagen_de_la_profesora.png" alt="Profesora" />
            </div>
        </div>
    );
};

export default About;
