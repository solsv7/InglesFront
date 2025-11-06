import React, { useEffect, useState } from "react";
import './AdminSchedules.css';
import { FaEdit, FaSave, FaPlus, FaTrashAlt, FaCalendarAlt, FaClock, FaGraduationCap, FaTimes } from 'react-icons/fa';

const diasSemana = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"];

// Componente de Popup para agregar clase
const AgregarClasePopup = ({ niveles, cargarHorarios, isOpen, onClose }) => {
  const [nuevoNivel, setNuevoNivel] = useState("");
  const [idDia, setIdDia] = useState(1);
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const agregarClase = async () => {
    if (!nuevoNivel || !idDia || !horaInicio || !horaFin) {
      alert("Todos los campos son obligatorios");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/clases`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_nivel: nuevoNivel,
          id_dia: idDia,
          hora_inicio: horaInicio,
          hora_fin: horaFin
        })
      });

      if (response.ok) {
        cargarHorarios();
        resetForm();
        onClose();
      }
    } catch (error) {
      console.error("Error al agregar la clase:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setNuevoNivel("");
    setIdDia(1);
    setHoraInicio("");
    setHoraFin("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="popup-header">
          <div className="popup-title">
            <FaPlus className="popup-icon" />
            <h3>Agregar Nueva Clase</h3>
          </div>
          <button className="popup-close" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        <div className="popup-body">
          <div className="form-grid">
            <div className="form-group">
              <label>
                <FaGraduationCap className="input-icon" />
                Nivel
              </label>
              <select 
                value={nuevoNivel} 
                onChange={(e) => setNuevoNivel(e.target.value)}
                className="modern-select"
              >
                <option value="">Selecciona un nivel</option>
                {niveles.map(nivel => (
                  <option key={nivel.id_nivel} value={nivel.id_nivel}>
                    {nivel.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>
                <FaCalendarAlt className="input-icon" />
                DA-a de la semana
              </label>
              <select 
                value={idDia} 
                onChange={(e) => setIdDia(e.target.value)}
                className="modern-select"
              >
                {diasSemana.map((dia, index) => (
                  <option key={index} value={index + 1}>
                    {dia}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>
                <FaClock className="input-icon" />
                Hora de inicio
              </label>
              <input 
                type="time" 
                value={horaInicio} 
                onChange={(e) => setHoraInicio(e.target.value)}
                className="time-input"
              />
            </div>

            <div className="form-group">
              <label>
                <FaClock className="input-icon" />
                Hora de fin
              </label>
              <input 
                type="time" 
                value={horaFin} 
                onChange={(e) => setHoraFin(e.target.value)}
                className="time-input"
              />
            </div>
          </div>
        </div>

        <div className="popup-footer">
          <button 
            onClick={handleClose}
            className="popup-btn cancel-btn"
          >
            Cancelar
          </button>
          <button 
            onClick={agregarClase} 
            className="popup-btn confirm-btn"
            disabled={isSubmitting}
          >
            <FaPlus className="btn-icon" />
            {isSubmitting ? "Agregando..." : "Agregar Clase"}
          </button>
        </div>
      </div>
    </div>
  );
};

const EditarClase = ({ horarios, niveles, cargarHorarios, onAddClass }) => {
  const [editandoCelda, setEditandoCelda] = useState(null);
  const [nuevoNivel, setNuevoNivel] = useState("");
  const [nuevoInicio, setNuevoInicio] = useState("");
  const [nuevoFin, setNuevoFin] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const intervalosTiempo = Array.from(
    new Set(horarios.map(c => `${c.hora_inicio} - ${c.hora_fin}`))
  ).sort();

  const obtenerClase = (dia, intervalo) => {
    const [horaInicio] = intervalo.split(" - ");
    return horarios.find(c => c.dia_nombre === dia && c.hora_inicio === horaInicio);
  };

  const manejarEditarCelda = (dia, intervalo) => {
    const clase = obtenerClase(dia, intervalo);
    if (clase) {
      setEditandoCelda({
        dia,
        intervalo,
        id_clase: clase.id_clase,
        id_dia: clase.id_dia,
      });
      setNuevoNivel(clase.id_nivel);
      setNuevoInicio(clase.hora_inicio);
      setNuevoFin(clase.hora_fin);
    }
  };

  const manejarGuardarEdicion = async () => {
    if (!editandoCelda || !nuevoNivel || !nuevoInicio || !nuevoFin) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/clases`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_clase: editandoCelda.id_clase,
          id_dia: editandoCelda.id_dia,
          id_nivel: nuevoNivel,
          hora_inicio: nuevoInicio,
          hora_fin: nuevoFin
        }),
      });

      if (response.ok) {
        setEditandoCelda(null);
        setNuevoNivel("");
        setNuevoInicio("");
        setNuevoFin("");
        cargarHorarios();
      }
    } catch (error) {
      console.error("Error al actualizar la clase:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const eliminarClase = async (id_clase) => {
    if (window.confirm("A�EstA�s seguro de que deseas eliminar esta clase?")) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/clases/eliminar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_clase }),
        });

        if (response.ok) {
          cargarHorarios();
        }
      } catch (error) {
        console.error("Error al eliminar la clase:", error);
      }
    }
  };

  const cancelarEdicion = () => {
    setEditandoCelda(null);
    setNuevoNivel("");
    setNuevoInicio("");
    setNuevoFin("");
  };

  return (
    <div className="schedule-table-card">
      <div className="card-header">
        <div className="header-left">
          <FaCalendarAlt className="header-icon" />
          <div className="header-info">
            <h3>Horario de Clases</h3>
            <span className="classes-count">
              {horarios.length} clase{horarios.length !== 1 ? 's' : ''} registrada{horarios.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        <button 
          className="add-class-button"
          onClick={onAddClass}
          title="Agregar nueva clase"
        >
          <FaPlus className="add-icon" />
          Agregar Clase
        </button>
      </div>
      
      <div className="table-container">
        <table className="modern-table">
          {/* NUEVO: colgroup para controlar anchos de columnas en pantallas grandes */}
          <colgroup>
            <col className="col-time" />
            <col className="col-day" span="5" />
          </colgroup>

          <thead>
            <tr>
              <th className="time-header">Horario</th>
              {diasSemana.map((dia, index) => (
                <th key={index} className="day-header">
                  {dia}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {intervalosTiempo.map((intervalo, index) => (
              <tr key={index} className="schedule-row">
                <td className="time-slot">{intervalo}</td>
                {diasSemana.map((dia, idx) => {
                  const clase = obtenerClase(dia, intervalo);
                  return (
                    <td key={idx} className={`class-cell ${clase ? 'has-class' : 'empty'}`}>
                      {editandoCelda && editandoCelda.dia === dia && editandoCelda.intervalo === intervalo ? (
                        <div className="edit-form">
                          <select 
                            value={nuevoNivel} 
                            onChange={(e) => setNuevoNivel(e.target.value)}
                            className="edit-select"
                          >
                            <option value="">Seleccionar nivel</option>
                            {niveles.map(n => (
                              <option key={n.id_nivel} value={n.id_nivel}>
                                {n.nombre}
                              </option>
                            ))}
                          </select>
                          <div className="time-inputs">
                            <input 
                              type="time" 
                              value={nuevoInicio} 
                              onChange={(e) => setNuevoInicio(e.target.value)}
                              className="edit-time"
                            />
                            <input 
                              type="time" 
                              value={nuevoFin} 
                              onChange={(e) => setNuevoFin(e.target.value)}
                              className="edit-time"
                            />
                          </div>
                          <div className="edit-actions">
                            <button 
                              onClick={manejarGuardarEdicion} 
                              className="save-btn"
                              disabled={isSubmitting}
                            >
                              <FaSave />
                            </button>
                            <button 
                              onClick={cancelarEdicion} 
                              className="cancel-btn"
                            >
                              A-
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="class-info">
                          <span className="class-name">
                            {clase ? clase.nivel_nombre : "Disponible"}
                          </span>
                          {clase && (
                            <div className="class-actions">
                              <button 
                                onClick={() => manejarEditarCelda(dia, intervalo)}
                                className="action-btn edit-btn"
                                title="Editar clase"
                              >
                                <FaEdit />
                              </button>
                              <button 
                                onClick={() => eliminarClase(clase.id_clase)}
                                className="action-btn delete-btn"
                                title="Eliminar clase"
                              >
                                <FaTrashAlt />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminSchedules = () => {
  const [horarios, setHorarios] = useState([]);
  const [niveles, setNiveles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  const cargarHorarios = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/clases`);
      const data = await response.json();
      setHorarios(data);
    } catch (error) {
      console.error("Error al obtener los horarios:", error);
    }
  };

  useEffect(() => {
    const cargarDatos = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          cargarHorarios(),
          fetch(`${process.env.REACT_APP_API_URL}/api/niveles`)
            .then(response => response.json())
            .then(data => setNiveles(data))
        ]);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    cargarDatos();
  }, []);

  if (isLoading) {
    return (
      <div className="admin-schedules-loading">
        <div className="loading-spinner"></div>
        <p>Cargando horarios...</p>
      </div>
    );
  }

  return (
    <div className="admin-schedules">
      <div className="schedules-container">
        <EditarClase 
          horarios={horarios} 
          niveles={niveles} 
          cargarHorarios={cargarHorarios}
          onAddClass={() => setShowPopup(true)}
        />
        
        <AgregarClasePopup
          niveles={niveles}
          cargarHorarios={cargarHorarios}
          isOpen={showPopup}
          onClose={() => setShowPopup(false)}
        />
      </div>
    </div>
  );
};

export default AdminSchedules;