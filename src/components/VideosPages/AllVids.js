import React, { useEffect, useState } from "react";
import transition from "../../transition";
import "./AllVids.css";
import axios from "axios";

const AllVids = () => {
  const [videos, setVideos] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("Ingles"); // Idioma por defecto

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/all-vids");
        setVideos(response.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    fetchVideos();
  }, []);

  // Función para obtener la URL correcta de los videos de YouTube
  const getEmbedURL = (url) => {
    const videoIdMatch = url.match(/(?:\?v=|\/embed\/|youtu\.be\/)([^#&?]*).*/);
    return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : url;
  };

  // Filtrar videos por idioma seleccionado
  const filteredVideos = videos.filter((vid) => vid.idioma === selectedLanguage);

  return (
    <div className="Contenido-Videos">
      <h1>Todos los Videos</h1>

      {/* Selector de idioma */}
      <div className="TextoSelect"><p>Selecione el idioma de los videos</p></div>
      <div className="language-selector">
        <button
          className={selectedLanguage === "Ingles" ? "active" : ""}
          onClick={() => setSelectedLanguage("Ingles")}
        >
          Ingles
        </button>
        <button
          className={selectedLanguage === "Portugues" ? "active" : ""}
          onClick={() => setSelectedLanguage("Portugues")}
        >
          Portugues
        </button>
      </div>

      {/* Mostrar videos filtrados */}
      <div className="separador-videos">
        {filteredVideos.length > 0 ? (
          filteredVideos.map((vids) => (
            <div key={vids.id_video}>
              <h3 className="titulos">{vids.titulo}</h3>
              <iframe
                src={getEmbedURL(vids.url)}
                title={vids.titulo}
                allowFullScreen
              />
            </div>
          ))
        ) : (
          <p>Aun no hay videos en {selectedLanguage}.</p>
        )}
      </div>
    </div>
  );
};

export default transition(AllVids);
