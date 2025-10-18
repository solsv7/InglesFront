import React, { useState } from 'react';
import axios from 'axios';
import { FaSearch, FaBook, FaLanguage, FaVolumeUp, FaCopy, FaCheck } from 'react-icons/fa';
import transition from '../../transition';
import './DiccionarioIngles.css';

const DiccionarioIngles = () => {
  const [palabra, setPalabra] = useState('');
  const [traduccion, setTraduccion] = useState('');
  const [definiciones, setDefiniciones] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedText, setCopiedText] = useState('');

  // Función para usar un proxy CORS
  const fetchWithProxy = async (url) => {
    // Intentar con proxy CORS
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

    
    try {
      const response = await axios.get(proxyUrl, {
        timeout: 10000,
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      return response;
    } catch (proxyError) {
      console.warn('Proxy falló, intentando directo:', proxyError);
      // Si el proxy falla, intentar directo
      return await axios.get(url, { timeout: 10000 });
    }
  };

  const buscarPalabra = async () => {
    if (!palabra.trim()) {
      setError('Por favor, ingresa una palabra');
      return;
    }

    setIsLoading(true);
    setError(null);
    setTraduccion('');
    setDefiniciones(null);

    try {
      console.log('🔍 Buscando palabra:', palabra);
      
      // Paso 1: Traducción (MyMemory API) - Esta funciona bien
      const resTraduccion = await axios.get(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(palabra)}&langpair=en|es`
      );
      console.log('📝 Respuesta traducción:', resTraduccion.data);
      
      const traduccionText = resTraduccion.data.responseData.translatedText;
      setTraduccion(traduccionText || 'No hay traducción disponible');

      // Paso 2: Definiciones (DictionaryAPI) - Con manejo de CORS
      try {
        const dictionaryUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(palabra.toLowerCase())}`;
        console.log('🌐 URL DictionaryAPI:', dictionaryUrl);
        
        const resDefiniciones = await fetchWithProxy(dictionaryUrl);
        console.log('📚 Respuesta definiciones:', resDefiniciones.data);
        
        if (resDefiniciones.data && resDefiniciones.data[0]) {
          setDefiniciones(resDefiniciones.data[0]);
          setError(null); // Limpiar error si ahora funciona
        } else {
          console.warn('⚠️ No se encontraron definiciones para:', palabra);
          setError('No se encontraron definiciones para esta palabra');
        }
      } catch (dictError) {
        console.error('❌ Error con DictionaryAPI:', dictError);
        
        // Mensajes de error más específicos
        if (dictError.code === 'ERR_NETWORK') {
          setError('Problema de conexión. Verifica tu internet o intenta más tarde.');
        } else if (dictError.response?.status === 404) {
          setError(`La palabra "${palabra}" no fue encontrada en el diccionario inglés`);
        } else if (dictError.response?.status === 429) {
          setError('Límite de consultas excedido. Por favor, espera un momento.');
        } else {
          setError('No se pudieron cargar las definiciones en este momento');
        }
        setDefiniciones(null);
      }

    } catch (err) {
      console.error('❌ Error general:', err);
      setDefiniciones(null);
      setError('Error al procesar la solicitud. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      buscarPalabra();
    }
  };

  const speakWord = (text, lang = 'en-US') => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = lang;
      speech.rate = 0.8;
      window.speechSynthesis.speak(speech);
    } else {
      console.warn('La síntesis de voz no está soportada en este navegador');
    }
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(type);
      setTimeout(() => setCopiedText(''), 2000);
    } catch (err) {
      console.error('Error al copiar: ', err);
    }
  };

  // Función mejorada para obtener la pronunciación
  const getPhonetic = (definiciones) => {
    if (!definiciones) return null;
    
    // Buscar en diferentes ubicaciones posibles
    if (definiciones.phonetic) {
      return definiciones.phonetic;
    }
    
    // Buscar en el array phonetics
    if (definiciones.phonetics && definiciones.phonetics.length > 0) {
      const phoneticObj = definiciones.phonetics.find(p => p.text);
      return phoneticObj ? phoneticObj.text : null;
    }
    
    return null;
  };

  // Función para obtener audio de pronunciación
  const getAudioUrl = (definiciones) => {
    if (!definiciones?.phonetics) return null;
    
    const audioPhonetic = definiciones.phonetics.find(p => p.audio && p.audio.trim() !== '');
    return audioPhonetic ? audioPhonetic.audio : null;
  };

  return (
    <div className="AnimatedDictionaryWrapper">
      <div className="DictionaryContent">
        <div className="dictionary-header">
          <div className="header-icon">
            <FaBook />
          </div>
          <h1>Diccionario Inglés-Español</h1>
          <p>Encuentra traducciones y definiciones al instante</p>
        </div>

        <div className="dictionary-form">
          <div className="form-section">
            <label className="section-label">
              <FaSearch className="label-icon" />
              Buscar Palabra
            </label>
            <div className="search-container-wrapper">
              <div className="search-input-wrapper">
                <FaSearch className="search-input-icon" />
                <input
                  type="text"
                  placeholder="Escribe una palabra en inglés..."
                  value={palabra}
                  onChange={(e) => setPalabra(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="modern-input"
                />
              </div>
              <button 
                onClick={buscarPalabra} 
                className="search-button modern-button"
                disabled={isLoading}
              >
                {isLoading ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <div className="error-icon">⚠️</div>
              {error}
            </div>
          )}

          {(traduccion || definiciones) && (
            <div className="results-container">
              {traduccion && (
                <div className="result-card translation-card">
                  <div className="diccionario-card-header">
                    <div className="card-title">
                      <FaLanguage className="card-icon" />
                      <h3>Traducción al Español</h3>
                    </div>
                    <div className="diccionario-card-actions">
                      <button 
                        onClick={() => speakWord(palabra, 'en-US')}
                        className="action-btn"
                        title="Pronunciar en inglés"
                        disabled={!('speechSynthesis' in window)}
                      >
                        <FaVolumeUp />
                      </button>
                      <button 
                        onClick={() => copyToClipboard(traduccion, 'translation')}
                        className="action-btn"
                        title="Copiar traducción"
                      >
                        {copiedText === 'translation' ? <FaCheck /> : <FaCopy />}
                      </button>
                    </div>
                  </div>
                  <div className="translation-content">
                    <span className="original-word">{palabra}</span>
                    <div className="arrow-diccionario">→</div>
                    <span className="translated-word">{traduccion}</span>
                  </div>
                </div>
              )}

              {definiciones && (
                <div className="result-card definitions-card">
                  <div className="diccionario-card-header">
                    <div className="card-title">
                      <FaBook className="card-icon" />
                      <h3>Definiciones en Inglés</h3>
                    </div>
                    <div className="diccionario-card-actions">
                      <button 
                        onClick={() => speakWord(palabra, 'en-US')}
                        className="action-btn large"
                        title="Pronunciar palabra"
                        disabled={!('speechSynthesis' in window)}
                      >
                        <FaVolumeUp /> Pronunciar
                      </button>
                      {getAudioUrl(definiciones) && (
                        <button 
                          onClick={() => new Audio(getAudioUrl(definiciones)).play()}
                          className="action-btn large"
                          title="Reproducir audio"
                        >
                          <FaVolumeUp /> Audio
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="phonetic-section">
                    {getPhonetic(definiciones) && (
                      <div className="phonetic">
                        <strong>Pronunciación:</strong> /{getPhonetic(definiciones)}/
                      </div>
                    )}
                  </div>

                  <div className="meanings-grid">
                    {definiciones.meanings && definiciones.meanings.map((meaning, i) => (
                      <div className="meaning-card" key={i}>
                        <div className="part-of-speech">
                          {meaning.partOfSpeech}
                        </div>
                        <div className="definitions-list">
                          {meaning.definitions && meaning.definitions.slice(0, 4).map((def, j) => (
                            <div key={j} className="definition-item">
                              <div className="definition-text">{def.definition}</div>
                              {def.example && (
                                <div className="example">
                                  "<em>{def.example}</em>"
                                </div>
                              )}
                              {def.synonyms && def.synonyms.length > 0 && (
                                <div className="synonyms">
                                  <strong>Sinónimos:</strong> {def.synonyms.slice(0, 3).join(', ')}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        {meaning.synonyms && meaning.synonyms.length > 0 && (
                          <div className="meaning-synonyms">
                            <strong>Sinónimos:</strong> {meaning.synonyms.slice(0, 5).join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!traduccion && !definiciones && !error && !isLoading && (
            <div className="empty-state">
              <FaBook className="empty-icon" />
              <h3>Comienza a buscar palabras</h3>
              <p>Escribe una palabra en inglés arriba para obtener su traducción y definición</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default transition(DiccionarioIngles);