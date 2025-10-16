import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentSearch from '../../components/functionalComponent/gradesComponent/StudentSearch/StudentSearch';
import { 
  FaUserGraduate, 
  FaMoneyBillWave, 
  FaEdit, 
  FaTrash, 
  FaSave, 
  FaTimes,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaHistory
} from 'react-icons/fa';
import './CuotasPorAlumno.css';

const CuotasPorAlumno = () => {
  const [cuotas, setCuotas] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [formData, setFormData] = useState({});
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarPlanes();
  }, []);

  const cargarPlanes = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/planes`);
      setPlanes(Array.isArray(response.data) ? response.data : [response.data]);
    } catch (err) {
      console.error('Error al obtener planes:', err);
      setError('Error al cargar los planes disponibles');
    }
  };

  const fetchCuotas = async (id) => {
    setLoading(true);
    setError(null);
    setAlumnoSeleccionado(id);
    
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/cuotas/alumno/${id}`);
      setCuotas(response.data);
    } catch (err) {
      console.error('Error al obtener cuotas:', err);
      setError('Error al cargar las cuotas del alumno');
      setCuotas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id, nombrePlan) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar la cuota del plan "${nombrePlan}"?`)) {
      return;
    }

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/cuotas/eliminar/${id}`);
      setCuotas(prev => prev.filter(c => c.id_cuota !== id));
    } catch (error) {
      console.error('Error al eliminar cuota:', error);
      setError('Error al eliminar la cuota');
    }
  };

  const handleEditarClick = (cuota) => {
    setEditandoId(cuota.id_cuota);
    setFormData({
      id_plan: cuota.id_plan,
      fecha_inicio: cuota.fecha_inicio,
      fecha_vencimiento: cuota.fecha_vencimiento,
      estado_pago: cuota.estado_pago
    });
  };

  const handleGuardar = async (id) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/cuotas/editar/${id}`, formData);
      setCuotas(prev =>
        prev.map(c => c.id_cuota === id ? { ...c, ...formData } : c)
      );
      setEditandoId(null);
    } catch (error) {
      console.error('Error al editar cuota:', error);
      setError('Error al editar la cuota');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'paga': return '#48bb78';
      case 'pendiente': return '#ed8936';
      case 'vencida': return '#e53e3e';
      default: return '#718096';
    }
  };

  const getEstadoIcono = (estado) => {
    switch (estado) {
      case 'paga': return <FaCheckCircle />;
      case 'pendiente': return <FaClock />;
      case 'vencida': return <FaExclamationTriangle />;
      default: return <FaClock />;
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES');
  };

  const calcularEstadisticas = () => {
    return {
      total: cuotas.length,
      pagas: cuotas.filter(c => c.estado_pago === 'paga').length,
      pendientes: cuotas.filter(c => c.estado_pago === 'pendiente').length,
      vencidas: cuotas.filter(c => c.estado_pago === 'vencida').length
    };
  };

  const estadisticas = calcularEstadisticas();

  return (
    <div className="cuotas-alumno-container">
      <div className="cuotas-alumno-header">
        <FaUserGraduate className="header-cuotas-icon" />
        <div className="header-cuotas-content">
          <h2>Cuotas por Alumno</h2>
          <p>Consulta y gestiona el historial de cuotas de un alumno específico</p>
        </div>
      </div>

      {/* Búsqueda de Alumno */}
      <div className="search-section">
        <div className="section-header">
          <FaUserGraduate className="section-icon" />
          <h3>Buscar Alumno</h3>
        </div>
        <div className="student-search-wrapper">
          <StudentSearch onSelectStudent={fetchCuotas} />
        </div>
        {alumnoSeleccionado && (
          <div className="selected-student-indicator">
            <FaUserGraduate className="indicator-icon" />
            <span>Mostrando cuotas del alumno seleccionado</span>
          </div>
        )}
      </div>

      {/* Mensajes de Estado */}
      {error && (
        <div className="error-message">
          <FaExclamationTriangle className="error-icon" />
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="loading-message">
          <div className="loading-spinner"></div>
          <span>Cargando cuotas del alumno...</span>
        </div>
      )}

      {/* Tabla de Cuotas */}
      {cuotas.length > 0 ? (
        <div className="table-container">
          <div className="table-header">
            <FaHistory className="table-icon" />
            <h3>Historial de Cuotas</h3>
            <span className="cuotas-count">{cuotas.length} cuota{cuotas.length !== 1 ? 's' : ''}</span>
          </div>
          
          <table className="cuotas-table">
            <thead>
              <tr>
                <th>Plan</th>
                <th>Fecha Inicio</th>
                <th>Fecha Vencimiento</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cuotas.map((cuota) => (
                <tr key={cuota.id_cuota} className={editandoId === cuota.id_cuota ? 'editing' : ''}>
                  <td>
                    {editandoId === cuota.id_cuota ? (
                      <select 
                        name="id_plan" 
                        value={formData.id_plan} 
                        onChange={handleInputChange}
                        className="edit-select"
                      >
                        {planes.map(p => (
                          <option key={p.id_plan} value={p.id_plan}>
                            {p.nombre}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="plan-cell">
                        <FaMoneyBillWave className="plan-icon" />
                        <span>{cuota.nombre_plan}</span>
                      </div>
                    )}
                  </td>
                  <td>
                    {editandoId === cuota.id_cuota ? (
                      <input 
                        type="date" 
                        name="fecha_inicio" 
                        value={formData.fecha_inicio} 
                        onChange={handleInputChange}
                        className="edit-input"
                      />
                    ) : (
                      <div className="fecha-cell">
                        <FaCalendarAlt className="fecha-icon" />
                        <span>{formatearFecha(cuota.fecha_inicio)}</span>
                      </div>
                    )}
                  </td>
                  <td>
                    {editandoId === cuota.id_cuota ? (
                      <input 
                        type="date" 
                        name="fecha_vencimiento" 
                        value={formData.fecha_vencimiento} 
                        onChange={handleInputChange}
                        className="edit-input"
                      />
                    ) : (
                      <div className="fecha-cell">
                        <FaCalendarAlt className="fecha-icon" />
                        <span>{formatearFecha(cuota.fecha_vencimiento)}</span>
                      </div>
                    )}
                  </td>
                  <td>
                    {editandoId === cuota.id_cuota ? (
                      <select 
                        name="estado_pago" 
                        value={formData.estado_pago} 
                        onChange={handleInputChange}
                        className="edit-select"
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="paga">Pagada</option>
                        <option value="vencida">Vencida</option>
                      </select>
                    ) : (
                      <div 
                        className="estado-badge"
                        style={{ backgroundColor: getEstadoColor(cuota.estado_pago) }}
                      >
                        {getEstadoIcono(cuota.estado_pago)}
                        <span>{cuota.estado_pago}</span>
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="acciones-cell">
                      {editandoId === cuota.id_cuota ? (
                        <>
                          <button 
                            onClick={() => handleGuardar(cuota.id_cuota)}
                            className="btn-guardar"
                            title="Guardar cambios"
                          >
                            <FaSave />
                          </button>
                          <button 
                            onClick={() => setEditandoId(null)}
                            className="btn-cancelar"
                            title="Cancelar edición"
                          >
                            <FaTimes />
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => handleEditarClick(cuota)}
                            className="btn-editar"
                            title="Editar cuota"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            onClick={() => handleEliminar(cuota.id_cuota, cuota.nombre_plan)}
                            className="btn-eliminar"
                            title="Eliminar cuota"
                          >
                            <FaTrash />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : alumnoSeleccionado && !loading ? (
        <div className="no-cuotas-message">
          <FaMoneyBillWave className="no-cuotas-icon" />
          <h3>No se encontraron cuotas</h3>
          <p>El alumno seleccionado no tiene cuotas registradas en el sistema.</p>
        </div>
      ) : !alumnoSeleccionado && (
        <div className="select-alumno-message">
          <FaUserGraduate className="select-alumno-icon" />
          <h3>Selecciona un alumno</h3>
          <p>Utiliza el buscador superior para seleccionar un alumno y ver sus cuotas.</p>
        </div>
      )}
    </div>
  );
};

export default CuotasPorAlumno;