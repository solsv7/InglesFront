import React, { useState, useEffect } from 'react';
import './Niveles.css';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaLanguage, FaGraduationCap } from 'react-icons/fa';
import Swal from 'sweetalert2';

const Niveles = () => {
  const [niveles, setNiveles] = useState([]);
  const [nombre, setNombre] = useState('');
  const [idioma, setIdioma] = useState('');
  const [editando, setEditando] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Opciones de idiomas disponibles
  const opcionesIdiomas = [
    { value: 'Inglés', label: 'Inglés' },
    { value: 'Italiano', label: 'Italiano' },
    { value: 'Portugués', label: 'Portugués' }
  ];

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

  const cargarNiveles = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/niveles`);
      const data = await response.json();
      setNiveles(data);
    } catch (err) {
      console.error('Error al obtener niveles:', err);
      showErrorAlert('Error', 'No se pudieron cargar los niveles');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarNiveles();
  }, []);

  useEffect(() => {
    if (showForm) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [showForm]);

  const agregarNivel = async () => {
    if (!nombre.trim() || !idioma.trim()) {
      showErrorAlert('Campos incompletos', 'Todos los campos son obligatorios');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/niveles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombre.trim(), idioma: idioma.trim() })
      });

      if (response.ok) {
        showSuccessAlert('¡Éxito!', 'Nivel agregado correctamente');
        setNombre('');
        setIdioma('');
        setShowForm(false);
        cargarNiveles();
      } else {
        showErrorAlert('Error', 'No se pudo agregar el nivel');
      }
    } catch (error) {
      console.error('Error al agregar nivel:', error);
      showErrorAlert('Error de conexión', 'No se pudo conectar con el servidor');
    }
  };

  const actualizarNivel = async () => {
    if (!nombre.trim() || !idioma.trim() || !editando) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/niveles/${editando}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombre.trim(), idioma: idioma.trim() })
      });

      if (response.ok) {
        showSuccessAlert('¡Éxito!', 'Nivel actualizado correctamente');
        setEditando(null);
        setNombre('');
        setIdioma('');
        setShowForm(false);
        cargarNiveles();
      } else {
        showErrorAlert('Error', 'No se pudo actualizar el nivel');
      }
    } catch (error) {
      console.error('Error al actualizar nivel:', error);
      showErrorAlert('Error de conexión', 'No se pudo conectar con el servidor');
    }
  };

  const eliminarNivel = async (id_nivel, nivelNombre) => {
    const result = await showConfirmDialog(
      '¿Estás seguro?',
      `Esta acción eliminará el nivel "${nivelNombre}" permanentemente.`,
      'Sí, eliminar nivel'
    );

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/niveles/eliminar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_nivel })
        });

        if (response.ok) {
          showSuccessAlert('¡Eliminado!', 'El nivel ha sido eliminado correctamente');
          cargarNiveles();
        } else {
          showErrorAlert('Error', 'No se pudo eliminar el nivel');
        }
      } catch (err) {
        console.error('Error al eliminar nivel:', err);
        showErrorAlert('Error de conexión', 'No se pudo conectar con el servidor');
      }
    }
  };

  const seleccionarParaEditar = (nivel) => {
    setEditando(nivel.id_nivel);
    setNombre(nivel.nombre);
    setIdioma(nivel.idioma);
    setShowForm(true);
  };

  const cancelarEdicion = () => {
    if (nombre.trim() || idioma.trim()) {
      Swal.fire({
        title: '¿Descartar cambios?',
        text: 'Tienes cambios sin guardar. ¿Estás seguro de que quieres cancelar?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e53e3e',
        cancelButtonColor: '#718096',
        confirmButtonText: 'Sí, descartar',
        cancelButtonText: 'Seguir editando'
      }).then((result) => {
        if (result.isConfirmed) {
          setEditando(null);
          setNombre('');
          setIdioma('');
          setShowForm(false);
        }
      });
    } else {
      setEditando(null);
      setNombre('');
      setIdioma('');
      setShowForm(false);
    }
  };

  return (
    <div className="niveles-page-wrapper">
      <div className="niveles-container">
        <div className="niveles-page-header">
          <div className="niveles-header-icon">
            <FaGraduationCap />
          </div>
          <h1 className="niveles-main-title">Gestión de Niveles</h1>
          <p className="niveles-subtitle">Administra los niveles de idiomas disponibles en el sistema</p>
        </div>

        <div className="niveles-main-content">
          <div className="niveles-form-section">
            <div className="niveles-section-header">
              <label className="niveles-section-label">
                <FaGraduationCap className="niveles-label-icon" />
                Niveles de Idiomas
              </label>
              <button 
                className="niveles-add-btn niveles-primary-btn"
                onClick={() => setShowForm(true)}
              >
                <FaPlus className="niveles-btn-icon" />
                Agregar Nivel
              </button>
            </div>

            {/* Cards de Niveles en lugar de tabla */}
            <div className="niveles-cards-container niveles-content-card">
              <div className="niveles-cards-header">
                <div className="niveles-cards-title">
                  <FaGraduationCap className="niveles-card-icon" />
                  <h3>Niveles Registrados</h3>
                </div>
                <span className="niveles-items-count">
                  {niveles.length} nivel{niveles.length !== 1 ? 'es' : ''}
                </span>
              </div>

              {isLoading ? (
                <div className="niveles-loading-state">
                  <div className="niveles-loading-spinner"></div>
                  <p>Cargando niveles...</p>
                </div>
              ) : niveles.length > 0 ? (
                <div className="niveles-cards-grid">
                  {niveles.map(nivel => (
                    <div key={nivel.id_nivel} className="nivel-card">
                      <div className="nivel-card-header">
                        <div className="nivel-card-icon-wrapper">
                          <FaGraduationCap className="nivel-card-main-icon" />
                        </div>
                        <div className="nivel-card-actions">
                          <button 
                            onClick={() => seleccionarParaEditar(nivel)}
                            className="nivel-action-btn nivel-edit-btn"
                            title="Editar nivel"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            onClick={() => eliminarNivel(nivel.id_nivel, nivel.nombre)}
                            className="nivel-action-btn nivel-delete-btn"
                            title="Eliminar nivel"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                      
                      <div className="nivel-card-content">
                        <h4 className="nivel-card-title">{nivel.nombre}</h4>
                      </div>
                      
                      <div className="nivel-card-footer">
                        <div className="nivel-card-info">
                          <div className="nivel-info-item">
                            <FaLanguage className="nivel-info-icon" />
                            <span>{nivel.idioma}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="niveles-empty-state">
                  <FaGraduationCap className="niveles-empty-icon" />
                  <h4>No hay niveles registrados</h4>
                  <p>Comienza agregando el primer nivel al sistema</p>
                  <button 
                    className="niveles-add-first-btn niveles-primary-btn"
                    onClick={() => setShowForm(true)}
                  >
                    <FaPlus className="niveles-btn-icon" />
                    Agregar Primer Nivel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Formulario */}
      {showForm && (
        <div className="niveles-modal-overlay">
          <div className="niveles-modal-content">
            <div className="niveles-modal-header">
              <div className="niveles-modal-title">
                {editando ? (
                  <><FaEdit className="niveles-modal-icon" /> Editar Nivel</>
                ) : (
                  <><FaPlus className="niveles-modal-icon" /> Agregar Nuevo Nivel</>
                )}
              </div>
              <button className="niveles-modal-close" onClick={cancelarEdicion}>
                <FaTimes />
              </button>
            </div>

            <div className="niveles-modal-body">
              <div className="niveles-form-section">
                <label className="niveles-section-label">
                  <FaGraduationCap className="niveles-label-icon" />
                  Nombre del Nivel
                </label>
                <div className="niveles-input-wrapper">
                  <FaGraduationCap className="niveles-input-icon" />
                  <input
                    type="text"
                    placeholder="Ej: Básico, Intermedio, Avanzado"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="niveles-form-input"
                  />
                </div>
              </div>

              <div className="niveles-form-section">
                <label className="niveles-section-label">
                  <FaLanguage className="niveles-label-icon" />
                  Idioma
                </label>
                <div className="niveles-select-wrapper">
                  <FaLanguage className="niveles-select-icon" />
                  <select
                    value={idioma}
                    onChange={(e) => setIdioma(e.target.value)}
                    className="niveles-form-select"
                  >
                    <option value="">Selecciona un idioma</option>
                    {opcionesIdiomas.map((opcion) => (
                      <option key={opcion.value} value={opcion.value}>
                        {opcion.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="niveles-modal-footer">
              <button onClick={cancelarEdicion} className="niveles-modal-btn niveles-cancel-btn">
                <FaTimes className="niveles-btn-icon" />
                Cancelar
              </button>
              <button 
                onClick={editando ? actualizarNivel : agregarNivel} 
                className="niveles-modal-btn niveles-confirm-btn"
                disabled={!nombre.trim() || !idioma.trim()}
              >
                {editando ? (
                  <><FaSave className="niveles-btn-icon" /> Actualizar Nivel</>
                ) : (
                  <><FaPlus className="niveles-btn-icon" /> Agregar Nivel</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Niveles;