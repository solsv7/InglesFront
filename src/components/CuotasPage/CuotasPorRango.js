import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  FaCalendarAlt, 
  FaSearch, 
  FaEdit, 
  FaTrash, 
  FaSave, 
  FaTimes,
  FaUserGraduate,
  FaMoneyBillWave,
  FaCalendarCheck,
  FaExclamationTriangle,
  FaFilter
} from 'react-icons/fa';
import './CuotasPorRango.css';

const CuotasPorRango = () => {
  const [cuotas, setCuotas] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlanes = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/planes`);
      setPlanes(Array.isArray(response.data) ? response.data : [response.data]);
    } catch (err) {
      console.error('Error al obtener planes:', err);
      setError('Error al cargar los planes disponibles');
    }
  };

  const fetchCuotas = async () => {
    if (!desde || !hasta) {
      setError('Por favor selecciona ambas fechas');
      return;
    }

    if (new Date(desde) > new Date(hasta)) {
      setError('La fecha de inicio no puede ser mayor a la fecha final');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/cuotas/rango?desde=${desde}&hasta=${hasta}`
      );
      setCuotas(response.data);
    } catch (err) {
      console.error('Error al obtener cuotas por rango:', err);
      setError('Error al cargar las cuotas del rango seleccionado');
      setCuotas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanes();
  }, []);

  const handleEliminar = async (id, nombreAlumno) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar la cuota de ${nombreAlumno}?`)) {
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
      case 'paga': return '✓';
      case 'pendiente': return '⏳';
      case 'vencida': return '⚠️';
      default: return '⏳';
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const limpiarBusqueda = () => {
    setDesde('');
    setHasta('');
    setCuotas([]);
    setError(null);
  };

  const estaHoy = new Date().toISOString().split('T')[0];

  return (
    <div className="cuotas-rango-container">
      <div className="cuotas-rango-header">
        <FaCalendarAlt className="header-cuotas-icon" />
        <div className="header-cuotas-content">
          <h2>Cuotas por Rango de Fechas</h2>
          <p>Consulta y gestiona cuotas dentro de un período específico</p>
        </div>
      </div>

      {/* Filtros de Fecha */}
      <div className="filtros-rango">
        <div className="filtros-header">
          <FaFilter className="filtros-icon" />
          <h3>Seleccionar Rango</h3>
        </div>
        
        <div className="fechas-inputs">
          <div className="fecha-input-group">
            <label htmlFor="desde">
              <FaCalendarAlt className="input-icon" />
              Fecha Inicio
            </label>
            <div className="input-wrapper">
              <input 
                id="desde"
                type="date" 
                value={desde} 
                onChange={e => setDesde(e.target.value)}
                max={hasta || estaHoy}
                className="fecha-input"
              />
            </div>
          </div>

          <div className="fecha-separator">-</div>

          <div className="fecha-input-group">
            <label htmlFor="hasta">
              <FaCalendarCheck className="input-icon" />
              Fecha Fin
            </label>
            <div className="input-wrapper">
              <input 
                id="hasta"
                type="date" 
                value={hasta} 
                onChange={e => setHasta(e.target.value)}
                min={desde}
                max={estaHoy}
                className="fecha-input"
              />
            </div>
          </div>
        </div>

        <div className="filtros-actions">
          <button 
            onClick={fetchCuotas} 
            className="btn-buscar"
            disabled={loading || !desde || !hasta}
          >
            <FaSearch className="btn-icon" />
            {loading ? 'Buscando...' : 'Buscar Cuotas'}
          </button>
          
          <button 
            onClick={limpiarBusqueda} 
            className="btn-limpiar"
            disabled={loading}
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Mensajes de Error */}
      {error && (
        <div className="error-message">
          <FaExclamationTriangle className="error-icon" />
          <span>{error}</span>
        </div>
      )}

      {/* Resultados */}
      {cuotas.length > 0 && (
        <div className="resultados-info">
          <div className="resultados-header">
            <FaCalendarAlt className="resultados-icon" />
            <span>
              Mostrando {cuotas.length} cuota{cuotas.length !== 1 ? 's' : ''} del {formatearFecha(desde)} al {formatearFecha(hasta)}
            </span>
          </div>
        </div>
      )}

      {/* Tabla de Cuotas */}
      <div className="table-container">
        {cuotas.length > 0 ? (
          <table className="cuotas-rango-table">
            <thead>
              <tr>
                <th>Alumno</th>
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
                        <span className="estado-icon">{getEstadoIcono(cuota.estado_pago)}</span>
                        <span className="estado-texto">{cuota.estado_pago}</span>
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
                            onClick={() => handleEliminar(cuota.id_cuota, cuota.nombre_alumno)}
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
        ) : desde && hasta && !loading ? (
          <div className="no-resultados">
            <FaSearch className="no-resultados-icon" />
            <h3>No se encontraron cuotas</h3>
            <p>No hay cuotas registradas en el rango de fechas seleccionado.</p>
          </div>
        ) : !desde || !hasta ? (
          <div className="selecciona-fechas">
            <FaCalendarAlt className="selecciona-fechas-icon" />
            <h3>Selecciona un rango de fechas</h3>
            <p>Elige las fechas de inicio y fin para buscar cuotas en ese período.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CuotasPorRango;