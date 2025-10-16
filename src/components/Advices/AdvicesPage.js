import React, { useState, useEffect } from "react";
import transition from "../../transition";
import "./AdvicesPage.css";
import axios from "axios";
import StudentSearch from "../../components/functionalComponent/gradesComponent/StudentSearch/StudentSearch";
import { FaPaperPlane, FaUsers, FaUser, FaGlobe, FaComments } from "react-icons/fa";

const AdvicesPage = () => {
  const [target, setTarget] = useState("");
  const [clases, setClases] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedClase, setSelectedClase] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchClases = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/clases`);
        setClases(response.data);
      } catch (error) {
        console.error("Error fetching clases:", error);
      }
    };
    fetchClases();
  }, []);

  const handleTargetChange = (event) => {
    setTarget(event.target.value);
    setSelectedStudent("");
    setSelectedClase("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!target) return alert("Debes seleccionar un destinatario");
    if (target === "alumno" && !selectedStudent) return alert("Debes seleccionar un alumno");
    if (target === "curso" && !selectedClase) return alert("Debes seleccionar una clase");
    if (!message.trim()) return alert("El mensaje no puede estar vacío");

    setIsSubmitting(true);

    let data = { target, mensaje: message };
    let url = `${process.env.REACT_APP_API_URL}/api/mensaje`;

    if (target === "alumno") {
      data.id_alumno = selectedStudent;
    } else if (target === "curso") {
      data.id_clase = selectedClase;
      url = `${process.env.REACT_APP_API_URL}/api/mensajeClase`;
    }

    try {
      await axios.post(url, data);
      alert("✅ Aviso enviado con éxito");
      setMessage("");
      setTarget("");
      setSelectedStudent("");
      setSelectedClase("");
    } catch (error) {
      console.error("Error al guardar el aviso:", error.response?.data || error);
      alert("❌ Hubo un error al enviar el aviso");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTargetIcon = () => {
    switch (target) {
      case "alumno": return <FaUser />;
      case "curso": return <FaUsers />;
      case "todos": return <FaGlobe />;
      default: return <FaComments />;
    }
  };

  return (
    <div className="AnimatedAdviceWrapper">
      <div className="AdviceContent">
        <div className="advice-header">
          <div className="header-advice-icon">
            <FaComments />
          </div>
          <h1>Sistema de Avisos</h1>
          <p>Comunica información importante a estudiantes y clases</p>
        </div>

        <form className="advicesForm" onSubmit={handleSubmit}>
          <div className="form-section">
            <label className="section-label">
              <FaUsers className="label-icon" />
              Destinatario del Aviso
            </label>
            <div className="select-wrapper">
              {getTargetIcon()}
              <select 
                value={target} 
                onChange={handleTargetChange} 
                className="SelectType modern-select"
              >
                <option value="">Selecciona el destinatario</option>
                <option value="alumno">Alumno específico</option>
                <option value="curso">Toda una clase</option>
                <option value="todos">Todos los estudiantes</option>
              </select>
            </div>
          </div>

          {target === "alumno" && (
            <div className="form-section">
              <label className="section-label">
                <FaUser className="label-icon" />
                Seleccionar Alumno
              </label>
              <div className="student-search-wrapper">
                <StudentSearch onSelectStudent={(id) => setSelectedStudent(id)} />
              </div>
            </div>
          )}

          {target === "curso" && (
            <div className="form-section">
              <label className="section-label">
                <FaUsers className="label-icon" />
                Seleccionar Clase
              </label>
              <div className="select-wrapper">
                <FaUsers />
                <select 
                  onChange={(e) => setSelectedClase(e.target.value)}
                  className="modern-select"
                  value={selectedClase}
                >
                  <option value="">Selecciona una clase</option>
                  {clases.map((clase) => (
                    <option key={clase.id_clase} value={clase.id_clase}>
                      {`Clase ${clase.id_clase} - ${clase.nivel_nombre} (${clase.dia_nombre} ${clase.hora_inicio} - ${clase.hora_fin})`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="form-section">
            <label className="section-label">
              <FaComments className="label-icon" />
              Mensaje del Aviso
            </label>
            <div className="textarea-wrapper">
              <textarea
                placeholder="Escribe aquí el mensaje que quieres enviar. Puede ser información importante, recordatorios, anuncios, etc."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="modern-textarea"
                maxLength={500}
              />
              <div className="character-count">
                {message.length}/500 caracteres
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="boton-enviar modern-button"
            disabled={isSubmitting}
          >
            <FaPaperPlane className="button-icon" />
            {isSubmitting ? "Enviando..." : "Enviar Aviso"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default transition(AdvicesPage);