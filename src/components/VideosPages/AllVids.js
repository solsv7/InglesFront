import React, { useEffect, useState } from "react";
import transition from "../../transition";
import "./AllVids.css";
import axios from "axios";

const AllVids = () => {
  const [videos, setVideos] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("Ingles");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/all-vids`);
        setVideos(response.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    fetchVideos();
  }, []);

  const getEmbedURL = (url) => {
    const videoIdMatch = url.match(/(?:\?v=|\/embed\/|youtu\.be\/)([^#&?]*).*/);
    return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : url;
  };

  const filteredVideos = videos.filter((vid) => vid.idioma === selectedLanguage);

  return (
    <div className="contenido-videos">
      <h1 className="titulo-principal">Recursos</h1>

      <div className="texto-select">
        <p>Selecciona el idioma de los videos</p>
      </div>

      <div className="language-selector">
        {["Ingles", "Portugues"].map((lang) => (
          <button
            key={lang}
            className={selectedLanguage === lang ? "active" : ""}
            onClick={() => setSelectedLanguage(lang)}
          >
            {lang}
          </button>
        ))}
      </div>

      <div className="grid-videos">
        {filteredVideos.length > 0 ? (
          filteredVideos.map((vids) => (
            <div key={vids.id_video} className="video-card">
              <h3 className="titulo-video">{vids.titulo}</h3>
              <div className="video-wrapper">
                <iframe
                  src={getEmbedURL(vids.url)}
                  title={vids.titulo}
                  allowFullScreen
                />
              </div>
            </div>
          ))
        ) : (
          <p>No hay videos disponibles en {selectedLanguage}.</p>
        )}
      </div>
    </div>
  );
};

export default transition(AllVids);
