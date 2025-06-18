import React, { useState } from "react";
import "./Carousel.css"; // Estilos opcionales

const instagramVideos = [
  "https://www.instagram.com/reel/C4WQMghuCTk/embed",
  "https://www.instagram.com/reel/CpaKg-pjzY9/embed",
  "https://www.instagram.com/reel/CjEr7GhjImq/embed",
  "https://www.instagram.com/reel/Ch3OmEWjVoe/embed",
  "https://www.instagram.com/reel/Ca2Hy7kDmiU/embed",
  "https://www.instagram.com/reel/CjJ2alaD6pq/embed",
  "https://www.instagram.com/reel/CaV5nsFjZdL/embed",
  "https://www.instagram.com/reel/CaGRAlujGdW/embed",
  "https://www.instagram.com/reel/CaDsmoFj9lK/embed",
];

const InstagramCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Función para cambiar de video
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? instagramVideos.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === instagramVideos.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="carousel-container">
      {/* Botón izquierdo */}
      <button className="carousel-button left" onClick={goToPrevious}>
        {"<"}
      </button>
      {/* Botón derecho */}
      <button className="carousel-button right" onClick={goToNext}>
        {">"}
      </button>
    
        <div className="VideoInstagramWithIndicator">
      {/* Video actual */}
      <iframe
        key={currentIndex} // Evita problemas con el cambio de iframe
        src={instagramVideos[currentIndex]}
        width="400"
        height="470"
        frameBorder="0"
        scrolling="no"
        allowFullScreen
        style={{ border: "none", overflow: "hidden" }}
      ></iframe>

      
      {/* Indicadores de posición */}
      <div className="carousel-indicators">
        {instagramVideos.map((_, index) => (
          <span
            key={index}
            className={`indicator ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
      </div>
    </div>
  );
};

export default InstagramCarousel;
