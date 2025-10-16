import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  FaMoneyBillWave, 
  FaEdit, 
  FaTrash, 
  FaSave, 
  FaTimes,
  FaUserGraduate,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSearch
} from 'react-icons/fa';
import './ObtenerCuotas.css';

const ObtenerCuotas = () => {
  const [cuotas, setCuotas] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const anioActual = new Date().getFullYear();

      const [cuotasRes, planesRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/cuotas/anio?anio=${anioActual}`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/planes`)
      ]);

      setCuotas(cuotasRes.data);
      setPlanes(Array.isArray(planesRes.data) ? planesRes.data : [planesRes.data]);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('Error al cargar las cuotas');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id, nombreAlumno) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar la cuota de ${nombreAlumno}?`)) {
      return;
    }

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/cuotas/eliminar/${id}`);
      setCuotas(prev => prev.filter(c => c.id_cuota !== id));
    } catch (error) {
      console.error('Error al eliminar cuota:', error);
      alert('Error al eliminar la cuota');
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
      alert('Error al editar la cuota');
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

  const cuotasFiltradas = cuotas.filter(cuota => {
    const coincideEstado = filtroEstado === 'todos' || cuota.estado_pago === filtroEstado;
    const coincideBusqueda = cuota.nombre_alumno.toLowerCase().includes(busqueda.toLowerCase());
    return coincideEstado && coincideBusqueda;
  });

  const estadisticas = {
    total: cuotas.length,
    pagas: cuotas.filter(c => c.estado_pago === 'paga').length,
    pendientes: cuotas.filter(c => c.estado_pago === 'pendiente').length,
    vencidas: cuotas.filter(c => c.estado_pago === 'vencida').length
  };

  if (loading) {
    return (
      <div className="cuotas-loading">
        <div className="loading-spinner"></div>
        <p>Cargando cuotas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cuotas-error">
        <FaExclamationTriangle className="error-icon" />
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={cargarDatos} className="reload-btn">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="obtener-cuotas-container">


      {/* Estadísticas */}
      <div className="estadisticas-grid">
        <div className="estadistica-card total">
          <div className="estadistica-icon">
            <FaMoneyBillWave />
          </div>
          <div className="estadistica-content">
            <h3>{estadisticas.total}</h3>
            <p>Total Cuotas</p>
          </div>
        </div>

        <div className="estadistica-card pagas">
          <div className="estadistica-icon">
            <FaCheckCircle />
          </div>
          <div className="estadistica-content">
            <h3>{estadisticas.pagas}</h3>
            <p>Pagadas</p>
          </div>
        </div>

        <div className="estadistica-card pendientes">
          <div className="estadistica-icon">
            <FaClock />
          </div>
          <div className="estadistica-content">
            <h3>{estadisticas.pendientes}</h3>
            <p>Pendientes</p>
          </div>
        </div>

        <div className="estadistica-card vencidas">
          <div className="estadistica-icon">
            <FaExclamationTriangle />
          </div>
          <div className="estadistica-content">
            <h3>{estadisticas.vencidas}</h3>
            <p>Vencidas</p>
          </div>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="filtros-container">
        <div className="search-group">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nombre de alumno..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <label>Filtrar por estado:</label>
          <select 
            value={filtroEstado} 
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="filter-select"
          >
            <option value="todos">Todos los estados</option>
            <option value="paga">Pagadas</option>
            <option value="pendiente">Pendientes</option>
            <option value="vencida">Vencidas</option>
          </select>
        </div>
      </div>

      {/* Tabla de Cuotas */}
      <div className="table-container">
        <table className="cuotas-table">
          <thead>
            <tr>
              <th>Alumno</th>
              <th>Plan</th>
              <th>Inicio</th>
              <th>Vencimiento</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cuotasFiltradas.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">
                  <FaSearch className="no-data-icon" />
                  <p>No se encontraron cuotas</p>
                </td>
              </tr>
            ) : (
              cuotasFiltradas.map((cuota) => (
                <tr key={cuota.id_cuota} className={editandoId === cuota.id_cuota ? 'editing' : ''}>
                  <td>
                    <div className="alumno-cell">
                      <FaUserGraduate className="alumno-icon" />
                      <span>{cuota.nombre_alumno}</span>
                    </div>
                  </td>
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
                      cuota.nombre_plan
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
                      formatearFecha(cuota.fecha_inicio)
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
                      formatearFecha(cuota.fecha_vencimiento)
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
                          >
                            <FaSave />
                          </button>
                          <button 
                            onClick={() => setEditandoId(null)}
                            className="btn-cancelar"
                          >
                            <FaTimes />
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => handleEditarClick(cuota)}
                            className="btn-editar"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            onClick={() => handleEliminar(cuota.id_cuota, cuota.nombre_alumno)}
                            className="btn-eliminar"
                          >
                            <FaTrash />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Resumen */}
      <div className="resumen-container">
        <div className="resumen-header">
          <FaMoneyBillWave className="resumen-icon" />
          <h4>Resumen</h4>
        </div>
        <div className="resumen-content">
          <p>
            Mostrando <strong>{cuotasFiltradas.length}</strong> de <strong>{cuotas.length}</strong> cuotas
            {filtroEstado !== 'todos' && ` (filtrado por: ${filtroEstado})`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ObtenerCuotas;