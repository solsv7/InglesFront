import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  FaClock, 
  FaTrash, 
  FaUserGraduate, 
  FaMoneyBillWave, 
  FaCalendarAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaSync,
  FaBell
} from 'react-icons/fa';
import './CuotasPendientes.css';

const CuotasPendientes = () => {
  const [cuotas, setCuotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actualizandoId, setActualizandoId] = useState(null);

  useEffect(() => {
    cargarCuotasPendientes();
  }, []);

  const cargarCuotasPendientes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/cuotas/pendientes`);
      setCuotas(response.data);
    } catch (err) {
      console.error('Error al obtener cuotas pendientes:', err);
      setError('Error al cargar las cuotas pendientes');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id, nombreAlumno) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar la cuota pendiente de ${nombreAlumno}?`)) {
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

  const handleEstadoChange = async (id, nuevoEstado) => {
    setActualizandoId(id);
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/cuotas/editar/${id}`, { 
        estado_pago: nuevoEstado 
      });
      setCuotas(prev =>
        prev.map(cuota =>
          cuota.id_cuota === id ? { ...cuota, estado_pago: nuevoEstado } : cuota
        )
      );
      
      // Si se marca como pagada, eliminar de la lista de pendientes
      if (nuevoEstado === 'paga') {
        setTimeout(() => {
          setCuotas(prev => prev.filter(c => c.id_cuota !== id));
        }, 500);
      }
    } catch (error) {
      console.error('Error al actualizar el estado de la cuota:', error);
      setError('Error al actualizar el estado de la cuota');
    } finally {
      setActualizandoId(null);
    }
  };

  const getDiasVencimiento = (fechaVencimiento) => {
    const hoy = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diferencia = vencimiento.getTime() - hoy.getTime();
    return Math.ceil(diferencia / (1000 * 3600 * 24));
  };

  const getEstadoVencimiento = (fechaVencimiento) => {
    const dias = getDiasVencimiento(fechaVencimiento);
    if (dias < 0) return 'vencida';
    if (dias <= 3) return 'proxima';
    return 'normal';
  };

  const getColorVencimiento = (fechaVencimiento) => {
    const estado = getEstadoVencimiento(fechaVencimiento);
    switch (estado) {
      case 'vencida': return '#e53e3e';
      case 'proxima': return '#ed8936';
      default: return '#48bb78';
    }
  };

  const getTextoVencimiento = (fechaVencimiento) => {
    const dias = getDiasVencimiento(fechaVencimiento);
    if (dias < 0) return `Vencida hace ${Math.abs(dias)} días`;
    if (dias === 0) return 'Vence hoy';
    if (dias === 1) return 'Vence mañana';
    return `Vence en ${dias} días`;
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const cuotasProximas = cuotas.filter(cuota => getEstadoVencimiento(cuota.fecha_vencimiento) === 'proxima');
  const cuotasVencidas = cuotas.filter(cuota => getEstadoVencimiento(cuota.fecha_vencimiento) === 'vencida');

  if (loading) {
    return (
      <div className="cuotas-pendientes-loading">
        <div className="loading-spinner"></div>
        <p>Cargando cuotas pendientes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cuotas-pendientes-error">
        <FaExclamationTriangle className="error-icon" />
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={cargarCuotasPendientes} className="reload-btn">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="cuotas-pendientes-container">
      
      {/* Alertas Importantes */}
      {(cuotasVencidas.length > 0 || cuotasProximas.length > 0) && (
        <div className="alertas-container">
          {cuotasVencidas.length > 0 && (
            <div className="alerta alerta-vencida">
              <FaExclamationTriangle className="alerta-icon" />
              <div className="alerta-content">
                <h4>Cuotas Vencidas</h4>
                <p>Tienes {cuotasVencidas.length} cuota{cuotasVencidas.length !== 1 ? 's' : ''} vencida{cuotasVencidas.length !== 1 ? 's' : ''} que requieren atención inmediata.</p>
              </div>
            </div>
          )}
          
          {cuotasProximas.length > 0 && (
            <div className="alerta alerta-proxima">
              <FaBell className="alerta-icon" />
              <div className="alerta-content">
                <h4>Cuotas por Vencer</h4>
                <p>Tienes {cuotasProximas.length} cuota{cuotasProximas.length !== 1 ? 's' : ''} que vencerá{cuotasProximas.length !== 1 ? 'n' : ''} en los próximos 3 días.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Estadísticas Rápidas */}
      <div className="estadisticas-pendientes">
        <div className="estadistica-pendiente total">
          <div className="estadistica-icon">
            <FaClock />
          </div>
          <div className="estadistica-content">
            <h3>{cuotas.length}</h3>
            <p>Total Pendientes</p>
          </div>
        </div>

        <div className="estadistica-pendiente proximas">
          <div className="estadistica-icon">
            <FaBell />
          </div>
          <div className="estadistica-content">
            <h3>{cuotasProximas.length}</h3>
            <p>Por Vencer</p>
          </div>
        </div>

        <div className="estadistica-pendiente vencidas">
          <div className="estadistica-icon">
            <FaExclamationTriangle />
          </div>
          <div className="estadistica-content">
            <h3>{cuotasVencidas.length}</h3>
            <p>Vencidas</p>
          </div>
        </div>
      </div>

      {/* Tabla de Cuotas Pendientes */}
      <div className="table-container">
        <div className="table-header">
          <FaMoneyBillWave className="table-icon" />
          <h3>Lista de Cuotas Pendientes</h3>
          <span className="cuotas-count">{cuotas.length} cuota{cuotas.length !== 1 ? 's' : ''} pendiente{cuotas.length !== 1 ? 's' : ''}</span>
        </div>

        {cuotas.length === 0 ? (
          <div className="no-cuotas-pendientes">
            <FaCheckCircle className="no-cuotas-icon" />
            <h3>¡Excelente!</h3>
            <p>No hay cuotas pendientes en este momento.</p>
          </div>
        ) : (
          <table className="cuotas-pendientes-table">
            <thead>
              <tr>
                <th>Alumno</th>
                <th>Plan</th>
                <th>Fecha Inicio</th>
                <th>Fecha Vencimiento</th>
                <th>Estado de Vencimiento</th>
                <th>Cambiar Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cuotas.map((cuota) => (
                <tr key={cuota.id_cuota} className={`vencimiento-${getEstadoVencimiento(cuota.fecha_vencimiento)}`}>
                  <td>
                    <div className="alumno-cell">
                      <FaUserGraduate className="alumno-icon" />
                      <span>{cuota.nombre_alumno}</span>
                    </div>
                  </td>
                  <td>
                    <div className="plan-cell">
                      <FaMoneyBillWave className="plan-icon" />
                      <span>{cuota.nombre_plan}</span>
                    </div>
                  </td>
                  <td>
                    <div className="fecha-cell">
                      <FaCalendarAlt className="fecha-icon" />
                      <span>{formatearFecha(cuota.fecha_inicio)}</span>
                    </div>
                  </td>
                  <td>
                    <div className="fecha-cell">
                      <FaCalendarAlt className="fecha-icon" />
                      <span>{formatearFecha(cuota.fecha_vencimiento)}</span>
                    </div>
                  </td>
                  <td>
                    <div 
                      className="estado-vencimiento"
                      style={{ color: getColorVencimiento(cuota.fecha_vencimiento) }}
                    >
                      <div className="vencimiento-indicator" style={{ backgroundColor: getColorVencimiento(cuota.fecha_vencimiento) }}></div>
                      <span>{getTextoVencimiento(cuota.fecha_vencimiento)}</span>
                    </div>
                  </td>
                  <td>
                    <div className="estado-select-container">
                      {actualizandoId === cuota.id_cuota ? (
                        <div className="actualizando-estado">
                          <FaSync className="spinning-icon" />
                        </div>
                      ) : (
                        <select
                          value={cuota.estado_pago}
                          onChange={(e) => handleEstadoChange(cuota.id_cuota, e.target.value)}
                          className="estado-select"
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="paga">Pagada</option>
                          <option value="vencida">Vencida</option>
                        </select>
                      )}
                    </div>
                  </td>
                  <td>
                    <button 
                      onClick={() => handleEliminar(cuota.id_cuota, cuota.nombre_alumno)}
                      className="btn-eliminar"
                      title="Eliminar cuota"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Información Adicional */}
      <div className="info-pendientes">
        <div className="info-header">
          <FaBell className="info-icon" />
          <h4>Gestión de Cuotas Pendientes</h4>
        </div>
        <div className="info-content">
          <ul>
            <li>Las cuotas se marcan automáticamente como <strong>vencidas</strong> después de la fecha de vencimiento</li>
            <li>Puedes cambiar el estado a <strong>pagada</strong> cuando se reciba el pago</li>
            <li>Las cuotas vencidas se muestran en <span style={{color: '#e53e3e'}}>rojo</span> para atención prioritaria</li>
            <li>Las cuotas próximas a vencer se muestran en <span style={{color: '#ed8936'}}>naranja</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CuotasPendientes;