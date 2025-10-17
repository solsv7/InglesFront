import React, { useState, useRef, useEffect } from "react";
import { 
  FaPlay, 
  FaPause, 
  FaVolumeMute, 
  FaVolumeUp,
  FaExpand,
  FaCompress,
  FaChevronLeft, 
  FaChevronRight,
  FaCircle
} from "react-icons/fa";
import "./VideoCarousel.css";

// Importar videos - ajusta las rutas según tu estructura
const videos = [
  require("../../../assets/videos/video1.mp4"),
  require("../../../assets/videos/video2.mp4"),
  require("../../../assets/videos/video3.mp4"),
  require("../../../assets/videos/video4.mp4"),
  require("../../../assets/videos/video5.mp4"),
  require("../../../assets/videos/video6.mp4"),
  require("../../../assets/videos/video7.mp4"),
  require("../../../assets/videos/video8.mp4"),
  require("../../../assets/videos/video9.mp4"),
];

const VideoCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const videoRef = useRef(null);
  const carouselRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  // Efecto para manejar el autoplay y resetear video al cambiar
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setProgress((video.currentTime / video.duration) * 100);
    };

    const handleEnded = () => {
      if (isAutoPlaying) {
        goToNext();
      } else {
        setIsPlaying(false);
        setProgress(0);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    // Reset video cuando cambia
    video.currentTime = 0;
    setProgress(0);

    if (isPlaying) {
      video.play().catch(console.error);
    }

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [currentIndex, isPlaying, isAutoPlaying]);

  // Mostrar/ocultar controles
  const showControlsTemporarily = () => {
    setShowControls(true);
    clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  // Navegación
  const goToPrevious = () => {
    setCurrentIndex(prev => prev === 0 ? videos.length - 1 : prev - 1);
    setIsPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex(prev => prev === videos.length - 1 ? 0 : prev + 1);
    if (isAutoPlaying) {
      setTimeout(() => setIsPlaying(true), 300);
    } else {
      setIsPlaying(false);
    }
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsPlaying(false);
  };

  // Control de video
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
    showControlsTemporarily();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !isMuted;
      setIsMuted(!isMuted);
    }
    showControlsTemporarily();
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    const video = videoRef.current;
    if (video) {
      video.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
    showControlsTemporarily();
  };

  const handleProgressClick = (e) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    video.currentTime = percent * video.duration;
    showControlsTemporarily();
  };

  const toggleFullscreen = () => {
    if (!carouselRef.current) return;

    if (!isFullscreen) {
      if (carouselRef.current.requestFullscreen) {
        carouselRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
    showControlsTemporarily();
  };

  // Event listeners para fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div 
      className="video-carousel"
      ref={carouselRef}
      onMouseMove={showControlsTemporarily}
      onMouseLeave={() => {
        if (isPlaying) {
          controlsTimeoutRef.current = setTimeout(() => {
            setShowControls(false);
          }, 1000);
        }
      }}
    >
      {/* Contenedor Principal del Video */}
      <div className="video-container">
        <video
          ref={videoRef}
          src={videos[currentIndex]}
          className="carousel-video"
          muted={isMuted}
          onClick={togglePlay}
          playsInline
        />
        
        {/* Overlay de Controles */}
        <div className={`video-controls ${showControls ? 'visible' : 'hidden'}`}>
          
          {/* Barra de Progreso */}
          <div className="progress-bar-container" onClick={handleProgressClick}>
            <div 
              className="progress-bar" 
              style={{ width: `${progress}%` }}
            />
            <div className="progress-buffer" />
          </div>

          {/* Controles Inferiores */}
          <div className="controls-bottom">
            <div className="controls-left">
              <button className="control-btn" onClick={togglePlay}>
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              
              <button className="control-btn" onClick={toggleMute}>
                {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
              </button>
              
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider"
              />
              
              <div className="video-time">
                Video {currentIndex + 1} de {videos.length}
              </div>
            </div>

            <div className="controls-right">
              {/*<button 
                className={`control-btn ${isAutoPlaying ? 'active' : ''}`}
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                title="Reproducción automática"
              >
                Auto
              </button>
              */}
              
              <button className="control-btn" onClick={toggleFullscreen}>
                {isFullscreen ? <FaCompress /> : <FaExpand />}
              </button>
            </div>
          </div>
        </div>

        {/* Botones de Navegación */}
        <button 
          className="nav-btn prev-btn"
          onClick={goToPrevious}
          aria-label="Video anterior"
        >
          <FaChevronLeft />
        </button>
        
        <button 
          className="nav-btn next-btn"
          onClick={goToNext}
          aria-label="Video siguiente"
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Miniaturas 
      <div className="thumbnails-container">
        {videos.map((_, index) => (
          <button
            key={index}
            className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          >
            <div className="thumbnail-number">{index + 1}</div>
            {index === currentIndex && isPlaying && (
              <div className="playing-indicator">
                <FaCircle />
              </div>
            )}
          </button>
        ))}
      </div>
      */}

      {/* Indicadores */}
      <div className="carousel-indicators">
        {videos.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Ir al video ${index + 1}`}
          >
            <div className="indicator-progress">
              {index === currentIndex && isPlaying && (
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress}%` }}
                />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default VideoCarousel;