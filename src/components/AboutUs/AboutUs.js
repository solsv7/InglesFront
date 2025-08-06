import React from "react";
import InstagramCarousel from "../functionalComponent/InstagramCarrousel/IgCarousel";
import './AboutUs.css';

const AboutUs = () => {
    return(
        <div className="about-container">
            <section className="hero">
                <h1>Sobre Nosotros</h1>
            </section>

            <section className="info-section">
                <div className="info-text">
                <h2>¿Qué es Saint Thomas?</h2>
                <p>En nuestro centro de idiomas… cada clase es una nueva aventura. Con más de 3 décadas de experiencia, seguimos transformando vidas a través del conocimiento.</p>
                </div>
                <div className="info-image"></div>
            </section>

            <section className="testimonials">
                <div className="testimonials-text">
                <h2>Testimonios de nuestros estudiantes</h2>
                </div>
                <InstagramCarousel />
            </section>
            </div>

    );
};

export default AboutUs;