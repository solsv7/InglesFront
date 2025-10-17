import React, { useState, useEffect } from "react";
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaInstagram,
  FaPlay,
  FaPause,
  FaExpand,
  FaTimes
} from "react-icons/fa";
import "./Carousel.css";

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
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalVideoIndex, setModalVideoIndex] = useState(0);

  // Configuración del autoplay
  useEffect(() => {
    if (!isAutoPlaying || isModalOpen) return;

    const interval = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying, isModalOpen]);

  // Navegación
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

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Modal functions
  const openModal = (index = currentIndex) => {
    setModalVideoIndex(index);
    setIsModalOpen(true);
    setIsAutoPlaying(false); // Pausar autoplay cuando se abre el modal
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const goToModalPrevious = () => {
    setModalVideoIndex((prevIndex) =>
      prevIndex === 0 ? instagramVideos.length - 1 : prevIndex - 1
    );
  };

  const goToModalNext = () => {
    setModalVideoIndex((prevIndex) =>
      prevIndex === instagramVideos.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Touch events para móviles
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  // Close modal with Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isModalOpen]);

  return (
    <>
      <div className="instagram-carousel">
        {/* Header del Carousel */}
        <div className="carousel-header">
          <div className="instagram-brand">
            <FaInstagram className="instagram-icon" />
            <span>@SaintThomas</span>
          </div>
          <div className="carousel-controls">
            <button 
              className={`control-btn ${isAutoPlaying ? 'active' : ''}`}
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              title={isAutoPlaying ? 'Pausar carrusel' : 'Reproducir carrusel'}
            >
              {isAutoPlaying ? <FaPause /> : <FaPlay />}
            </button>
          </div>
        </div>

        {/* Contenedor Principal */}
        <div 
          className="carousel-container"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Botón Anterior */}
          <button 
            className="carousel-nav-btn prev-btn"
            onClick={goToPrevious}
            aria-label="Video anterior"
          >
            <FaChevronLeft />
          </button>

          {/* Video Actual */}
          <div className="video-container">
            <div className="video-wrapper" onClick={() => openModal()}>
              <iframe
                key={currentIndex}
                src={instagramVideos[currentIndex]}
                width="400"
                height="450"
                frameBorder="0"
                scrolling="no"
                allowFullScreen
                className="instagram-embed"
                title={`Instagram video ${currentIndex + 1}`}
              />
              <div className="video-overlay">
                <div className="video-counter">
                  {currentIndex + 1} / {instagramVideos.length}
                </div>
                <button 
                  className="expand-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal();
                  }}
                  aria-label="Expandir video"
                >
                  <FaExpand />
                </button>
              </div>
            </div>
          </div>

          {/* Botón Siguiente */}
          <button 
            className="carousel-nav-btn next-btn"
            onClick={goToNext}
            aria-label="Video siguiente"
          >
            <FaChevronRight />
          </button>
        </div>

        {/* Indicadores */}
        <div className="carousel-indicators">
          {instagramVideos.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentIndex ? "active" : ""}`}
              onClick={() => goToSlide(index)}
              aria-label={`Ir al video ${index + 1}`}
            >
              <div className="indicator-progress">
                {index === currentIndex && isAutoPlaying && (
                  <div className="progress-bar" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Miniaturas */}
        <div className="carousel-thumbnails">
          {instagramVideos.slice(0, 5).map((_, index) => (
            <button
              key={index}
              className={`thumbnail ${index === currentIndex ? "active" : ""}`}
              onClick={() => goToSlide(index)}
            >
              <div className="thumbnail-number">{index + 1}</div>
            </button>
          ))}
          {instagramVideos.length > 5 && (
            <div className="thumbnail-more">
              +{instagramVideos.length - 5}
            </div>
          )}
        </div>

        {/* Navegación por Teclado */}
        <div className="carousel-help">
          <span>Haz clic en el video para expandir • Usa las flechas ← → para navegar</span>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Header del Modal */}
            <div className="modal-header">
              <div className="modal-title">
                <FaInstagram className="modal-instagram-icon" />
                <span>Video {modalVideoIndex + 1} de {instagramVideos.length}</span>
              </div>
              <button 
                className="modal-close-btn"
                onClick={closeModal}
                aria-label="Cerrar modal"
              >
                <FaTimes />
              </button>
            </div>

            {/* Contenido del Modal */}
            <div className="modal-body">
              {/* Botón Anterior en Modal */}
              <button 
                className="modal-nav-btn modal-prev-btn"
                onClick={goToModalPrevious}
                aria-label="Video anterior"
              >
                <FaChevronLeft />
              </button>

              {/* Video en Modal */}
              <div className="modal-video-container">
                <iframe
                  key={modalVideoIndex}
                  src={instagramVideos[modalVideoIndex]}
                  width="500"
                  height="600"
                  frameBorder="0"
                  scrolling="no"
                  allowFullScreen
                  className="modal-instagram-embed"
                  title={`Instagram video ${modalVideoIndex + 1} - Vista expandida`}
                />
              </div>

              {/* Botón Siguiente en Modal */}
              <button 
                className="modal-nav-btn modal-next-btn"
                onClick={goToModalNext}
                aria-label="Video siguiente"
              >
                <FaChevronRight />
              </button>
            </div>

            {/* Indicadores del Modal */}
            <div className="modal-indicators">
              {instagramVideos.map((_, index) => (
                <button
                  key={index}
                  className={`modal-indicator ${index === modalVideoIndex ? "active" : ""}`}
                  onClick={() => setModalVideoIndex(index)}
                  aria-label={`Ir al video ${index + 1}`}
                />
              ))}
            </div>

            {/* Miniaturas del Modal */}
            <div className="modal-thumbnails">
              {instagramVideos.map((_, index) => (
                <button
                  key={index}
                  className={`modal-thumbnail ${index === modalVideoIndex ? "active" : ""}`}
                  onClick={() => setModalVideoIndex(index)}
                >
                  <div className="modal-thumbnail-number">{index + 1}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InstagramCarousel;