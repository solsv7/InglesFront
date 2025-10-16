import React, { useEffect, useState } from "react";
import transition from "../../transition";
import "./AllVids.css";
import axios from "axios";
import { FaPlay, FaGlobe, FaFilm, FaYoutube, FaSearch } from "react-icons/fa";

const AllVids = () => {
  const [videos, setVideos] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("Ingles");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('🔍 Iniciando fetch de videos...');
        console.log('📡 URL:', `${process.env.REACT_APP_API_URL}/api/all-vids`);
        
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/all-vids`);
        
        console.log('✅ Respuesta recibida:', response);
        console.log('📊 Datos recibidos:', response.data);
        
        if (response.data && Array.isArray(response.data)) {
          setVideos(response.data);
          console.log('🎬 Videos cargados:', response.data.length);
        } else {
          console.warn('⚠️ Respuesta no es un array:', response.data);
          setVideos([]);
        }
      } catch (error) {
        console.error('❌ Error fetching videos:', error);
        console.error('🔧 Detalles del error:', {
          message: error.message,
          response: error.response,
          status: error.response?.status
        });
        setError('Error al cargar los videos');
        setVideos([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const getEmbedURL = (url) => {
    if (!url) return '';
    const videoIdMatch = url.match(/(?:\?v=|\/embed\/|youtu\.be\/)([^#&?]*).*/);
    return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : url;
  };

  const filteredVideos = videos.filter((vid) => 
    vid.idioma === selectedLanguage && 
    vid.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const languages = [
    { name: "Ingles", icon: "🇺🇸", color: "#EF4444" },
    { name: "Portugues", icon: "🇧🇷", color: "#10B981" },
    { name: "Italiano", icon: "🇮🇹", color: "#3B82F6" }
  ];

  console.log('🔄 Estado actual:', {
    videosCount: videos.length,
    filteredCount: filteredVideos.length,
    selectedLanguage,
    searchTerm,
    isLoading,
    error
  });

  return (
    <div className="AnimatedVideosWrapper">
      <div className="VideosContent">
        <div className="videos-header">
          <div className="header-icon">
            <FaFilm />
          </div>
          <h1>Recursos Multimedia</h1>
          <p>Descubre videos educativos para mejorar tu aprendizaje</p>
        </div>

        <div className="videos-form">
          <div className="form-section">
            <label className="section-label">
              <FaSearch className="label-icon" />
              Buscar Videos
            </label>
            <div className="search-input-wrapper">
              <FaSearch className="search-input-icon" />
              <input
                type="text"
                placeholder="Buscar videos por título..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="modern-input"
              />
            </div>
          </div>

          <div className="form-section">
            <label className="section-label">
              <FaGlobe className="label-icon" />
              Filtrar por Idioma
            </label>
            <div className="language-selector-wrapper">
              {languages.map((lang) => (
                <button
                  key={lang.name}
                  className={`language-btn modern-button ${selectedLanguage === lang.name ? "active" : ""}`}
                  onClick={() => setSelectedLanguage(lang.name)}
                  style={{
                    '--accent-color': lang.color
                  }}
                >
                  <span className="flag">{lang.icon}</span>
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="error-message">
              <div className="error-icon">⚠️</div>
              {error}
            </div>
          )}

          <div className="results-info-section">
            <div className="results-info">
              <h3>
                {isLoading ? (
                  "Cargando videos..."
                ) : error ? (
                  "Error al cargar videos"
                ) : (
                  <>
                    {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''} en {selectedLanguage}
                    {searchTerm && ` para "${searchTerm}"`}
                  </>
                )}
              </h3>
            </div>
          </div>

          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Cargando videos educativos...</p>
            </div>
          ) : error ? (
            <div className="empty-state">
              <FaFilm className="empty-icon" />
              <h3>Error al cargar videos</h3>
              <p>No se pudieron cargar los videos. Intenta recargar la página.</p>
            </div>
          ) : filteredVideos.length > 0 ? (
            <div className="videos-grid-section">
              <div className="videos-grid">
                {filteredVideos.map((vids) => (
                  <div key={vids.id_video} className="video-card result-card">
                    <div className="card-header">
                      <div className="card-title">
                        <FaYoutube className="card-icon youtube-icon" />
                        <h3 className="video-title">{vids.titulo}</h3>
                      </div>
                      <span 
                        className="language-badge"
                        style={{
                          backgroundColor: languages.find(l => l.name === vids.idioma)?.color
                        }}
                      >
                        {vids.idioma}
                      </span>
                    </div>
                    
                    <div className="video-wrapper">
                      <iframe
                        src={getEmbedURL(vids.url)}
                        title={vids.titulo}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                      />
                      <div className="play-overlay">
                        <FaPlay />
                      </div>
                    </div>
                    
                    <div className="card-footer">
                      <button 
                        className="watch-button action-btn large"
                        onClick={() => window.open(vids.url, '_blank')}
                      >
                        <FaPlay />
                        Ver en YouTube
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <FaFilm className="empty-icon" />
              <h3>No hay videos disponibles</h3>
              <p>
                {searchTerm 
                  ? `No se encontraron videos en ${selectedLanguage} para "${searchTerm}"`
                  : `No hay videos disponibles en ${selectedLanguage}`
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default transition(AllVids);