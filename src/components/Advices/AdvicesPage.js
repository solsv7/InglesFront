import React, { useState, useEffect } from "react";
import transition from "../../transition";
import "./AdvicesPage.css";
import axios from "axios";
import StudentSearch from "../../components/functionalComponent/gradesComponent/StudentSearch/StudentSearch";

const AdvicesPage = () => {
  const [target, setTarget] = useState("");
  const [clases, setClases] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedClase, setSelectedClase] = useState("");
  const [message, setMessage] = useState("");

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
      alert("Aviso enviado con éxito");
    } catch (error) {
      console.error("Error al guardar el aviso:", error.response?.data || error);
      alert("Hubo un error al enviar el aviso");
    }
  };

  return (
    <div className="AnimatedAdviceWrapper">
      <div className="AdviceContent">
        <h1>Avisos</h1>
        <form className="advicesForm" onSubmit={handleSubmit}>
          <select value={target} onChange={handleTargetChange} className="SelectType">
            <option value="">¿A quién se dirige?</option>
            <option value="alumno">Alumno</option>
            <option value="curso">Clase</option>
            <option value="todos">Todos</option>
          </select>

          {target === "alumno" && (
            <div>
              <StudentSearch onSelectStudent={(id) => setSelectedStudent(id)} />
            </div>
          )}

          {target === "curso" && (
            <div>
              <select onChange={(e) => setSelectedClase(e.target.value)}>
                <option value="">Seleccionar Clase</option>
                {clases.map((clase) => (
                  <option key={clase.id_clase} value={clase.id_clase}>
                    {`Clase ${clase.id_clase} - ${clase.nivel_nombre} (${clase.dia_nombre} ${clase.hora_inicio} - ${clase.hora_fin})`}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <textarea
              cols={40}
              rows={7}
              placeholder="Escribe el mensaje que quieres enviar"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <button type="submit" className="boton-enviar">Enviar aviso</button>
        </form>
      </div>
    </div>
  );
};

export default transition(AdvicesPage);
