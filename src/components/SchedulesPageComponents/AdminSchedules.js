import React, { useEffect, useState } from "react";
import './AdminSchedules.css';
import { FaEdit, FaSave, FaPlus, FaTrashAlt, FaCalendarAlt, FaClock, FaGraduationCap, FaTimes } from 'react-icons/fa';

const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

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
    <div className="admin-schedules-popup-overlay">
      <div className="admin-schedules-popup-content">
        <div className="admin-schedules-popup-header">
          <div className="admin-schedules-popup-title">
            <FaPlus className="admin-schedules-popup-icon" />
            <h3>Agregar Nueva Clase</h3>
          </div>
          <button className="admin-schedules-popup-close" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        <div className="admin-schedules-popup-body">
          <div className="admin-schedules-form-grid">
            <div className="admin-schedules-form-group">
              <label>
                <FaGraduationCap className="admin-schedules-input-icon" />
                Nivel
              </label>
              <select 
                value={nuevoNivel} 
                onChange={(e) => setNuevoNivel(e.target.value)}
                className="admin-schedules-select"
              >
                <option value="">Selecciona un nivel</option>
                {niveles.map(nivel => (
                  <option key={nivel.id_nivel} value={nivel.id_nivel}>
                    {nivel.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-schedules-form-group">
              <label>
                <FaCalendarAlt className="admin-schedules-input-icon" />
                Día de la semana
              </label>
              <select 
                value={idDia} 
                onChange={(e) => setIdDia(e.target.value)}
                className="admin-schedules-select"
              >
                {diasSemana.map((dia, index) => (
                  <option key={index} value={index + 1}>
                    {dia}
                  </option>
                ))}
              </select>
            </div>
              <div className="admin-schedules-time-group">
                <div className="admin-schedules-form-group">
                  <label>
                    <FaClock className="admin-schedules-input-icon" />
                    Hora de inicio
                  </label>
                  <input 
                    type="time" 
                    value={horaInicio} 
                    onChange={(e) => setHoraInicio(e.target.value)}
                    className="admin-schedules-time-input"
                  />
                </div>

                <div className="admin-schedules-form-group">
                  <label>
                    <FaClock className="admin-schedules-input-icon" />
                    Hora de fin
                  </label>
                  <input 
                    type="time" 
                    value={horaFin} 
                    onChange={(e) => setHoraFin(e.target.value)}
                    className="admin-schedules-time-input"
                  />
                </div>
            </div>
          </div>
        </div>

        <div className="admin-schedules-popup-footer">
          <button 
            onClick={handleClose}
            className="admin-schedules-popup-btn admin-schedules-cancel-btn"
          >
            Cancelar
          </button>
          <button 
            onClick={agregarClase} 
            className="admin-schedules-popup-btn admin-schedules-confirm-btn"
            disabled={isSubmitting}
          >
            <FaPlus className="admin-schedules-btn-icon" />
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
    if (window.confirm("¿Estás seguro de que deseas eliminar esta clase?")) {
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
    <div className="admin-schedules-card">
      <div className="admin-schedules-card-header">
        <div className="admin-schedules-header-left">
          <FaCalendarAlt className="admin-schedules-header-icon" />
          <div className="admin-schedules-header-info">
            <h3>Horario de Clases</h3>
            <span className="admin-schedules-classes-count">
              {horarios.length} clase{horarios.length !== 1 ? 's' : ''} registrada{horarios.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        <button 
          className="admin-schedules-add-button"
          onClick={onAddClass}
          title="Agregar nueva clase"
        >
          <FaPlus className="admin-schedules-add-icon" />
          Agregar Clase
        </button>
      </div>
      
      <div className="admin-schedules-table-container">
        <table className="admin-schedules-table">
          <colgroup>
            <col className="admin-schedules-col-time" />
            <col className="admin-schedules-col-day" span="5" />
          </colgroup>

          <thead>
            <tr>
              <th className="admin-schedules-time-header">Horario</th>
              {diasSemana.map((dia, index) => (
                <th key={index} className="admin-schedules-day-header">
                  {dia}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {intervalosTiempo.map((intervalo, index) => (
              <tr key={index} className="admin-schedules-row">
                <td className="admin-schedules-time-slot">{intervalo}</td>
                {diasSemana.map((dia, idx) => {
                  const clase = obtenerClase(dia, intervalo);
                  return (
                    <td key={idx} className={`admin-schedules-class-cell ${clase ? 'admin-schedules-has-class' : 'admin-schedules-empty'}`}>
                      {editandoCelda && editandoCelda.dia === dia && editandoCelda.intervalo === intervalo ? (
                        <div className="admin-schedules-edit-form">
                          <select 
                            value={nuevoNivel} 
                            onChange={(e) => setNuevoNivel(e.target.value)}
                            className="admin-schedules-edit-select"
                          >
                            <option value="">Seleccionar nivel</option>
                            {niveles.map(n => (
                              <option key={n.id_nivel} value={n.id_nivel}>
                                {n.nombre}
                              </option>
                            ))}
                          </select>
                          <div className="admin-schedules-time-inputs">
                            <input 
                              type="time" 
                              value={nuevoInicio} 
                              onChange={(e) => setNuevoInicio(e.target.value)}
                              className="admin-schedules-edit-time"
                            />
                            <input 
                              type="time" 
                              value={nuevoFin} 
                              onChange={(e) => setNuevoFin(e.target.value)}
                              className="admin-schedules-edit-time"
                            />
                          </div>
                          <div className="admin-schedules-edit-actions">
                            <button 
                              onClick={manejarGuardarEdicion} 
                              className="admin-schedules-save-btn"
                              disabled={isSubmitting}
                            >
                              <FaSave />
                            </button>
                            <button 
                              onClick={cancelarEdicion} 
                              className="admin-schedules-cancel-edit-btn"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="admin-schedules-class-info">
                          <span className="admin-schedules-class-name">
                            {clase ? clase.nivel_nombre : "Disponible"}
                          </span>
                          {clase && (
                            <div className="admin-schedules-class-actions">
                              <button 
                                onClick={() => manejarEditarCelda(dia, intervalo)}
                                className="admin-schedules-action-btn admin-schedules-edit-btn"
                                title="Editar clase"
                              >
                                <FaEdit />
                              </button>
                              <button 
                                onClick={() => eliminarClase(clase.id_clase)}
                                className="admin-schedules-action-btn admin-schedules-delete-btn"
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
        <div className="admin-schedules-loading-spinner"></div>
        <p>Cargando horarios...</p>
      </div>
    );
  }

  return (
    <div className="admin-schedules-page">
      <div className="admin-schedules-container">
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