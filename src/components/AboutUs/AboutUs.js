import React from "react";
import InstagramCarousel from "../functionalComponent/InstagramCarrousel/IgCarousel";
import './AboutUs.css';

const AboutUs = () => {
    return(
        <div className="contenedorAboutUs">
            <div className="TextoInfo">
                <h1>Sobre Nosotros</h1>
            </div>
            
            <div className="Informacion">
                <div className="TextoAbout">
                <h2>¿Que es Saint Thomas?</h2>
                <h3>En nuestro centro de idiomas, el aprendizaje se convierte en una experiencia natural y significativa. Creemos que dominar un nuevo idioma es abrir una puerta a infinitas oportunidades, y lo hacemos con un enfoque dinamico, divertido y cercano. Desde teatro hasta cocina, pasando por musica y campamentos, cada clase es una nueva aventura. Con mas de 3 decadas de experiencia, seguimos transformando vidas a traves del conocimiento</h3>
                </div>
                <div className="ImagenAbout"></div>
            </div>
            <div className="Testimonios">
                <div className="TextoTestimonios">
                <h1>Testimonios de nuestros estudiantes</h1>
                
                </div>
                <InstagramCarousel />
            </div>
        </div>
    );
};

export default AboutUs;