import React from "react";
import { 
  FaHeart, 
  FaGraduationCap, 
  FaUsers, 
  FaGlobeAmericas,
  FaQuoteLeft,
  FaStar,
  FaPlayCircle
} from "react-icons/fa";
import './AboutUs.css';
import VideoCarousel from "../functionalComponent/VideoCarrousel/VideoCarousel";
import mainvisual from '../../assets/ftAbout.jpg';
import logo from '../../assets/logo.png';


const AboutUs = () => {
    const features = [
        {
            icon: <FaGraduationCap />,
            title: "Más de 30 Años",
            description: "De experiencia educativa transformando vidas"
        },
        {
            icon: <FaUsers />,
            title: "Comunidad Activa",
            description: "Estudiantes que crecen y aprenden juntos"
        },
        {
            icon: <FaGlobeAmericas />,
            title: "Enfoque Global",
            description: "Preparamos para un mundo conectado"
        },
        {
            icon: <FaHeart />,
            title: "Aprendizaje Significativo",
            description: "Cada clase es una nueva aventura"
        }
    ];

    const testimonialsStats = [
        { number: "500+", label: "Estudiantes" },
        { number: "30+", label: "Años de Experiencia" },
        { number: "98%", label: "Satisfacción" },
        { number: "50+", label: "Cursos Realizados" }
    ];

    return(
        <div className="about-us-container">
            {/* Bloque 1: Hero con Stats y Video Carousel */}
            <StatsVideoBlock stats={testimonialsStats} />
            
            {/* Bloque 2: Qué es Saint Thomas con texto y floating cards */}
            <MissionBlock />
            
            {/* Bloque 3: Features con imagen principal */}
            <FeaturesWithImageBlock features={features} />

            {/* CTA Section con fondo animado */}
            <CTABlock />
        </div>
    );
};

// Bloque 1: Stats y Video Carousel
const StatsVideoBlock = ({ stats }) => {
    return (
        <section className="hero-with-video">
            <div className="container">
                <div className="hero-video-grid">
                    <div className="hero-content">
                        <h1 className="hero-title">Sobre Nosotros</h1>
                        <p className="hero-subtitle">
                            Transformando vidas a través del conocimiento desde hace más de 3 décadas
                        </p>
                        <div className="hero-stats">
                            {stats.map((stat, index) => (
                                <div key={index} className="stat-item">
                                    <div className="stat-number">{stat.number}</div>
                                    <div className="stat-label">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="video-carousel-section">
                        <div className="video-section-header">
                            <h3>Testimonios</h3>
                            <p>Nuestros alumnos nos cuentan en video sus experiencias junto a nosotros</p>
                        </div>
                        <div className="compact-video-carousel">
                            <VideoCarousel />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// Bloque 2: Misión con texto y floating cards
const MissionBlock = () => {
    return (
        <section className="mission-section">
            <div className="container">
                <div className="mission-content">
                    <div className="mission-visual">
                        <div className="visual-content">
                            <div className="floating-card card-1">
                                <FaQuoteLeft className="quote-icon" />
                                <p>El mejor lugar para aprender inglés</p>
                                <div className="student-rating">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className="star-icon" />
                                    ))}
                                </div>
                            </div>
                            <div className="floating-card card-2">
                                <FaQuoteLeft className="quote-icon" />
                                <p>Profesores increíbles y muy dedicados</p>
                                <div className="student-rating">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className="star-icon" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mission-text">
                        <div className="about-section-header">
                            <h2>¿Qué es Saint Thomas?</h2>
                            <img src={logo} alt="Saint Thomas Logo" className="about-logo" />
                        </div>
                        <p className="mission-description">
                            En <strong>Saint Thomas</strong>, no solo enseñamos idiomas, creamos experiencias de aprendizaje 
                            que perduran toda la vida. Con más de <strong>tres décadas de experiencia</strong>, hemos perfeccionado 
                            el arte de hacer que cada clase sea una aventura emocionante y cada lección, un paso hacia 
                            nuevas oportunidades.
                        </p>
                        <p className="mission-description">
                            Nuestro compromiso va más allá de la enseñanza tradicional. Fomentamos un ambiente donde 
                            los estudiantes desarrollan confianza, amplían sus horizontes y se preparan para un mundo 
                            globalizado, todo mientras construyen amistades y recuerdos inolvidables.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

// Bloque 3: Features con imagen
const FeaturesWithImageBlock = ({ features }) => {
    return (
        <section className="features-with-image-section">
            <div className="container">
                <div className="features-image-content">
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card">
                                <div className="feature-icon">
                                    {feature.icon}
                                </div>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                    <div className="features-image">
                        <div className="main-visual">
                            <img src={mainvisual} alt="Saint Thomas Features" className="about-main-image" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// Bloque CTA con fondo animado
const CTABlock = () => {
    return (
        <section className="animated-cta-section">
            <div className="animated-cta-wrapper">
                <div className="container">
                    <div className="cta-content">
                        <h2>¿Listo para comenzar tu aventura?</h2>
                        <p>Únete a nuestra comunidad y descubre el placer de aprender idiomas</p>
                        <button className="cta-button">
                            Contáctanos Hoy
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;