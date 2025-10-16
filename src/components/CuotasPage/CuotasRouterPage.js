import React, { useState } from 'react';
import { 
  FaMoneyBillWave, 
  FaSearch, 
  FaUserGraduate, 
  FaClock, 
  FaCalendarAlt,
  FaListAlt,
  FaChevronRight
} from 'react-icons/fa';
import RegistrarCuota from './RegistrarCuota.js';
import ObtenerCuotas from './ObtenerCuotas.js';
import CuotasPorAlumno from './CuotasPorAlumno.js';
import CuotasPendientes from './CuotasPendientes.js';
import CuotasPorRango from './CuotasPorRango.js';
import './CuotasPage.css';

const CuotasPage = () => {
  const [vista, setVista] = useState('obtener');

  const opcionesNavegacion = [
    {
      id: 'registrar',
      icono: FaMoneyBillWave,
      titulo: 'Registrar Cuota',
      descripcion: 'Registra un nuevo pago de cuota para un alumno',
      color: '#48bb78'
    },
    {
      id: 'obtener',
      icono: FaListAlt,
      titulo: 'Obtener Cuotas',
      descripcion: 'Consulta todas las cuotas registradas en el sistema',
      color: '#667eea'
    },
    {
      id: 'alumno',
      icono: FaUserGraduate,
      titulo: 'Cuotas por Alumno',
      descripcion: 'Visualiza el historial de cuotas de un alumno específico',
      color: '#ed8936'
    },
    {
      id: 'pendientes',
      icono: FaClock,
      titulo: 'Cuotas Pendientes',
      descripcion: 'Consulta las cuotas que están pendientes de pago',
      color: '#e53e3e'
    },
    {
      id: 'rango',
      icono: FaCalendarAlt,
      titulo: 'Cuotas por Rango',
      descripcion: 'Busca cuotas dentro de un rango de fechas específico',
      color: '#9f7aea'
    }
  ];

  const renderVista = () => {
    switch (vista) {
      case 'registrar': return <RegistrarCuota />;
      case 'obtener': return <ObtenerCuotas />;
      case 'alumno': return <CuotasPorAlumno />;
      case 'pendientes': return <CuotasPendientes />;
      case 'rango': return <CuotasPorRango />;
      default: return <ObtenerCuotas />;
    }
  };

  const opcionActiva = opcionesNavegacion.find(opcion => opcion.id === vista);

  return (
    <div className="cuotas-page-wrapper">
      <div className="cuotas-container">
        {/* Header Principal */}
        <div className="cuotas-page-header">
          <div className="cuotas-header-icon">
            <FaMoneyBillWave />
          </div>
          <h1 className="cuotas-main-title">Gestión de Cuotas</h1>
          <p className="cuotas-subtitle">
            Administra y consulta el sistema de pagos de cuotas de los alumnos
          </p>
        </div>

        <div className="cuotas-main-content">
          {/* Panel de Navegación */}
          <div className="cuotas-nav-panel">
            <div className="nav-panel-header">
              <FaListAlt className="panel-icon" />
              <h3>Módulos de Cuotas</h3>
            </div>
            
            <div className="nav-options-grid">
              {opcionesNavegacion.map((opcion) => {
                const Icono = opcion.icono;
                return (
                  <div
                    key={opcion.id}
                    className={`nav-option-card ${vista === opcion.id ? 'active' : ''}`}
                    onClick={() => setVista(opcion.id)}
                  >
                    <div 
                      className="option-icon-wrapper"
                      style={{ backgroundColor: `${opcion.color}20`, borderColor: opcion.color }}
                    >
                      <Icono 
                        className="option-icon" 
                        style={{ color: opcion.color }}
                      />
                    </div>
                    
                    <div className="option-content">
                      <h4 className="option-title">{opcion.titulo}</h4>
                      <p className="option-description">{opcion.descripcion}</p>
                    </div>
                    
                    <div className="option-indicator">
                      <FaChevronRight className="indicator-icon" />
                    </div>
                    
                    {vista === opcion.id && (
                      <div 
                        className="active-indicator"
                        style={{ backgroundColor: opcion.color }}
                      ></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contenido Principal */}
          <div className="cuotas-content-panel">
            <div className="content-panel-header">
              <div className="panel-title-section">
                {opcionActiva && (
                  <>
                    <opcionActiva.icono 
                      className="panel-title-icon"
                      style={{ color: opcionActiva.color }}
                    />
                    <h2 className="panel-title">{opcionActiva.titulo}</h2>
                  </>
                )}
              </div>
              <div className="panel-description">
                {opcionActiva && <p>{opcionActiva.descripcion}</p>}
              </div>
            </div>

            <div className="content-panel-body">
              {renderVista()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CuotasPage;