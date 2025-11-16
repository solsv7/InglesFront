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
import Swal from 'sweetalert2';
import './Periodos.css';

const Periodos = () => {
  const [periodos, setPeriodos] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [editandoNombre, setEditandoNombre] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const showSuccessAlert = (title, text = '') => {
    Swal.fire({
      title: title,
      text: text,
      confirmButtonColor: '#48bb78',
      confirmButtonText: 'Aceptar',
      timer: 3000,
      timerProgressBar: true
    });
  };

  const showErrorAlert = (title, text = '') => {
    Swal.fire({
      title: title,
      text: text,
      confirmButtonColor: '#e53e3e',
      confirmButtonText: 'Aceptar'
    });
  };

  const showConfirmDialog = (title, text, confirmButtonText = 'Sí, eliminar') => {
    return Swal.fire({
      title: title,
      text: text,
      showCancelButton: true,
      confirmButtonColor: '#e53e3e',
      cancelButtonColor: '#718096',
      confirmButtonText: confirmButtonText,
      cancelButtonText: 'Cancelar'
    });
  };

  const obtenerPeriodos = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/periodos`);
      setPeriodos(res.data);
    } catch (error) {
      console.error('Error al obtener periodos:', error);
      showErrorAlert('Error', 'No se pudieron cargar los períodos');
    } finally {
      setIsLoading(false);
    }
  };

  const crearPeriodo = async () => {
    if (!nuevoNombre.trim()) {
      showErrorAlert('Campo incompleto', 'El nombre del período es obligatorio');
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/periodos`, { 
        nombre: nuevoNombre.trim() 
      });
      setNuevoNombre('');
      setShowForm(false);
      showSuccessAlert('¡Éxito!', 'Período creado correctamente');
      obtenerPeriodos();
    } catch (error) {
      console.error('Error al crear periodo:', error);
      showErrorAlert('Error', 'No se pudo crear el período');
    }
  };

  const editarPeriodo = async (id) => {
    if (!editandoNombre.trim()) {
      showErrorAlert('Campo incompleto', 'El nombre del período es obligatorio');
      return;
    }

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/periodos/${id}`, { 
        nombre: editandoNombre.trim() 
      });
      setEditandoId(null);
      setEditandoNombre('');
      showSuccessAlert('¡Éxito!', 'Período actualizado correctamente');
      obtenerPeriodos();
    } catch (error) {
      console.error('Error al editar periodo:', error);
      showErrorAlert('Error', 'No se pudo actualizar el período');
    }
  };

  const eliminarPeriodo = async (id, nombre) => {
    const result = await showConfirmDialog(
      '¿Estás seguro?',
      `Esta acción eliminará el período "${nombre}" permanentemente.`,
      'Sí, eliminar período'
    );

    if (result.isConfirmed) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/periodos/${id}`);
        showSuccessAlert('¡Eliminado!', 'El período ha sido eliminado correctamente');
        obtenerPeriodos();
      } catch (error) {
        console.error('Error al eliminar periodo:', error);
        showErrorAlert('Error', 'No se pudo eliminar el período');
      }
    }
  };

  const iniciarEdicion = (periodo) => {
    setEditandoId(periodo.id_periodo);
    setEditandoNombre(periodo.nombre);
  };

  const cancelarEdicion = () => {
    if (editandoNombre.trim() !== periodos.find(p => p.id_periodo === editandoId)?.nombre) {
      Swal.fire({
        title: '¿Descartar cambios?',
        text: 'Tienes cambios sin guardar. ¿Estás seguro de que quieres cancelar?',
        showCancelButton: true,
        confirmButtonColor: '#e53e3e',
        cancelButtonColor: '#718096',
        confirmButtonText: 'Sí, descartar',
        cancelButtonText: 'Seguir editando'
      }).then((result) => {
        if (result.isConfirmed) {
          setEditandoId(null);
          setEditandoNombre('');
        }
      });
    } else {
      setEditandoId(null);
      setEditandoNombre('');
    }
  };

  const cancelarCreacion = () => {
    if (nuevoNombre.trim()) {
      Swal.fire({
        title: '¿Descartar período?',
        text: 'Tienes un período sin guardar. ¿Estás seguro de que quieres cancelar?',
        showCancelButton: true,
        confirmButtonColor: '#e53e3e',
        cancelButtonColor: '#718096',
        confirmButtonText: 'Sí, descartar',
        cancelButtonText: 'Seguir editando'
      }).then((result) => {
        if (result.isConfirmed) {
          setShowForm(false);
          setNuevoNombre('');
        }
      });
    } else {
      setShowForm(false);
      setNuevoNombre('');
    }
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