import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSave, 
  FaTimes, 
  FaCalendarAlt,
  FaClock,
  FaListAlt
} from 'react-icons/fa';
import './Periodos.css';

const Periodos = () => {
  const [periodos, setPeriodos] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [editandoNombre, setEditandoNombre] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const obtenerPeriodos = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/periodos`);
      setPeriodos(res.data);
    } catch (error) {
      console.error('Error al obtener periodos:', error);
      showMessage('❌ Error al cargar los períodos', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const crearPeriodo = async () => {
    if (!nuevoNombre.trim()) {
      showMessage('⚠️ El nombre del período es obligatorio', 'error');
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/periodos`, { 
        nombre: nuevoNombre.trim() 
      });
      setNuevoNombre('');
      setShowForm(false);
      showMessage('✅ Período creado exitosamente', 'success');
      obtenerPeriodos();
    } catch (error) {
      console.error('Error al crear periodo:', error);
      showMessage('❌ Error al crear el período', 'error');
    }
  };

  const editarPeriodo = async (id) => {
    if (!editandoNombre.trim()) {
      showMessage('⚠️ El nombre del período es obligatorio', 'error');
      return;
    }

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/periodos/${id}`, { 
        nombre: editandoNombre.trim() 
      });
      setEditandoId(null);
      setEditandoNombre('');
      showMessage('✅ Período actualizado exitosamente', 'success');
      obtenerPeriodos();
    } catch (error) {
      console.error('Error al editar periodo:', error);
      showMessage('❌ Error al actualizar el período', 'error');
    }
  };

  const eliminarPeriodo = async (id, nombre) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar el período "${nombre}"?`)) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/periodos/${id}`);
      showMessage('✅ Período eliminado exitosamente', 'success');
      obtenerPeriodos();
    } catch (error) {
      console.error('Error al eliminar periodo:', error);
      showMessage('❌ Error al eliminar el período', 'error');
    }
  };

  const iniciarEdicion = (periodo) => {
    setEditandoId(periodo.id_periodo);
    setEditandoNombre(periodo.nombre);
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setEditandoNombre('');
  };

  const cancelarCreacion = () => {
    setShowForm(false);
    setNuevoNombre('');
  };

  useEffect(() => {
    obtenerPeriodos();
  }, []);

  return (
    <div className="periodos-page-wrapper">
      <div className="periodos-container">
        <div className="periodos-page-header">
          <div className="periodos-header-icon">
            <FaCalendarAlt />
          </div>
          <h1 className="periodos-main-title">Gestión de Períodos</h1>
          <p className="periodos-subtitle">Administra los períodos académicos del sistema</p>
        </div>

        <div className="periodos-main-content">
          <div className="periodos-form-section">
            <div className="periodos-section-header">
              <label className="periodos-section-label">
                <FaCalendarAlt className="periodos-label-icon" />
                Períodos Académicos
              </label>
              <button 
                className="periodos-add-btn periodos-primary-btn"
                onClick={() => setShowForm(true)}
              >
                <FaPlus className="periodos-btn-icon" />
                Agregar Período
              </button>
            </div>

            {message.text && (
              <div className={`periodos-message periodos-${message.type}`}>
                <div className="periodos-message-icon">
                  {message.type === 'success' ? '✅' : '❌'}
                </div>
                {message.text}
              </div>
            )}

            {/* Cards de Períodos */}
            <div className="periodos-cards-container periodos-content-card">
              <div className="periodos-cards-header">
                <div className="periodos-cards-title">
                  <FaListAlt className="periodos-card-icon" />
                  <h3>Períodos Registrados</h3>
                </div>
                <span className="periodos-items-count">
                  {periodos.length} período{periodos.length !== 1 ? 's' : ''}
                </span>
              </div>

              {isLoading ? (
                <div className="periodos-loading-state">
                  <div className="periodos-loading-spinner"></div>
                  <p>Cargando períodos...</p>
                </div>
              ) : periodos.length > 0 ? (
                <div className="periodos-cards-grid">
                  {periodos.map(periodo => (
                    <div key={periodo.id_periodo} className="periodo-card">
                      <div className="card-header">
                        <div className="periodo-card-icon-wrapper">
                          <FaClock className="periodo-card-main-icon" />
                        </div>
                        <div className="periodo-card-actions">
                          {editandoId === periodo.id_periodo ? (
                            <>
                              <button 
                                onClick={() => editarPeriodo(periodo.id_periodo)}
                                className="periodo-action-btn periodo-save-btn"
                                title="Guardar cambios"
                              >
                                <FaSave />
                              </button>
                              <button 
                                onClick={cancelarEdicion}
                                className="periodo-action-btn periodo-cancel-btn"
                                title="Cancelar edición"
                              >
                                <FaTimes />
                              </button>
                            </>
                          ) : (
                            <>
                              <button 
                                onClick={() => iniciarEdicion(periodo)}
                                className="periodo-action-btn periodo-edit-btn"
                                title="Editar período"
                              >
                                <FaEdit />
                              </button>
                              <button 
                                onClick={() => eliminarPeriodo(periodo.id_periodo, periodo.nombre)}
                                className="periodo-action-btn periodo-delete-btn"
                                title="Eliminar período"
                              >
                                <FaTrash />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="periodo-card-content">
                        {editandoId === periodo.id_periodo ? (
                          <div className="periodo-edit-input-wrapper">
                            <input
                              type="text"
                              value={editandoNombre}
                              onChange={(e) => setEditandoNombre(e.target.value)}
                              className="periodo-edit-input"
                              placeholder="Nombre del período"
                              autoFocus
                            />
                          </div>
                        ) : (
                          <h4 className="periodo-card-title">{periodo.nombre}</h4>
                        )}
                      </div>
                      
                    </div>
                  ))}
                </div>
              ) : (
                <div className="periodos-empty-state">
                  <FaCalendarAlt className="periodos-empty-icon" />
                  <h4>No hay períodos registrados</h4>
                  <p>Comienza agregando el primer período al sistema</p>
                  <button 
                    className="periodos-add-first-btn periodos-primary-btn"
                    onClick={() => setShowForm(true)}
                  >
                    <FaPlus className="periodos-btn-icon" />
                    Agregar Primer Período
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal para agregar nuevo período */}
      {showForm && (
        <div className="periodos-modal-overlay">
          <div className="periodos-modal-content">
            <div className="periodos-modal-header">
              <div className="periodos-modal-title">
                <FaPlus className="periodos-modal-icon" />
                Agregar Nuevo Período
              </div>
              <button className="periodos-modal-close" onClick={cancelarCreacion}>
                <FaTimes />
              </button>
            </div>

            <div className="periodos-modal-body">
              <div className="periodos-form-section">
                <label className="periodos-section-label">
                  <FaCalendarAlt className="periodos-label-icon" />
                  Nombre del Período
                </label>
                <div className="periodos-input-wrapper">
                  <FaCalendarAlt className="periodos-input-icon" />
                  <input
                    type="text"
                    placeholder="Ej: Primer Cuatrimestre 2024, Segundo Semestre, etc."
                    value={nuevoNombre}
                    onChange={(e) => setNuevoNombre(e.target.value)}
                    className="periodos-form-input"
                    autoFocus
                  />
                </div>
              </div>
            </div>

            <div className="periodos-modal-footer">
              <button onClick={cancelarCreacion} className="periodos-modal-btn periodos-cancel-btn">
                <FaTimes className="periodos-btn-icon" />
                Cancelar
              </button>
              <button 
                onClick={crearPeriodo}
                className="periodos-modal-btn periodos-confirm-btn"
                disabled={!nuevoNombre.trim()}
              >
                <FaPlus className="periodos-btn-icon" />
                Agregar Período
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Periodos;