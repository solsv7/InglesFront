import React, { useState } from 'react';
import axios from 'axios';
import './DiccionarioIngles.css';

const DiccionarioIngles = () => {
  const [palabra, setPalabra] = useState('');
  const [traduccion, setTraduccion] = useState('');
  const [definiciones, setDefiniciones] = useState(null);
  const [error, setError] = useState(null);

  const buscarPalabra = async () => {
    if (!palabra.trim()) {
      setError('Ingresa una palabra');
      return;
    }

    try {
      // Paso 1: Traducción (MyMemory API)
      const resTraduccion = await axios.get(
        `https://api.mymemory.translated.net/get?q=${palabra}&langpair=en|es`
      );
      const traduccionText = resTraduccion.data.responseData.translatedText;
      setTraduccion(traduccionText || 'No hay traducción disponible');

      // Paso 2: Definiciones (DictionaryAPI)
      const resDefiniciones = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${palabra}`
      );
      setDefiniciones(resDefiniciones.data[0]);
      setError(null);

    } catch (err) {
      setDefiniciones(null);
      setError('Palabra no encontrada en el diccionario inglés');
    }
  };

  return (
    <div className="diccionario-page">
      <h2>Diccionario Inglés-Español</h2>
      <div className="diccionario-busqueda">
        <input
          type="text"
          placeholder="Buscar palabra en inglés"
          value={palabra}
          onChange={(e) => setPalabra(e.target.value)}
        />
        <button onClick={buscarPalabra}>Buscar</button>
      </div>

      {error && <p className="error-mensaje">{error}</p>}

      {traduccion && (
        <div className="resultado-traduccion">
          <h3>Traducción al español:</h3>
          <p>{traduccion}</p>
        </div>
      )}

      {definiciones && (
        <div className="resultado-container">
          <h3>Definiciones en inglés:</h3>
          {definiciones.meanings.map((meaning, i) => (
            <div className="meaning-container" key={i}>
              <strong>{meaning.partOfSpeech}</strong>
              <ul>
                {meaning.definitions.slice(0, 3).map((def, j) => (
                  <li key={j}>{def.definition}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiccionarioIngles;