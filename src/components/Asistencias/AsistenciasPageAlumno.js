import React, { useState } from 'react';
import { 
  FaChartBar, 
  FaCalendarAlt, 
  FaCalendarDay,
  FaUserGraduate,
  FaChevronRight
} from 'react-icons/fa';
import ResumenAsistenciasAlumno from './ResumenAsistenciasAlumno';
import AsistenciasAlumnoPorRango from './AsistenciasAlumnoPorRango';
import AsistenciasAlumnoPorFecha from './AsistenciasAlumnoPorFecha';
import './AsistenciasPageAlumno.css';

const AsistenciasPageAlumno = () => {
  const [vista, setVista] = useState('resumen');

  const opcionesNavegacion = [
    {
      id: 'resumen',
      icono: FaChartBar,
      titulo: 'Resumen General',
      descripcion: 'Consulta un resumen general de tus asistencias',
      color: '#48bb78'
    },
    {
      id: 'rango',
      icono: FaCalendarAlt,
      titulo: 'Por Rango de Fechas',
      descripcion: 'Visualiza tus asistencias por un rango de fechas específico',
      color: '#ed8936'
    },
    {
      id: 'fecha',
      icono: FaCalendarDay,
      titulo: 'Por Fecha Específica',
      descripcion: 'Consulta tus asistencias de una fecha en particular',
      color: '#667eea'
    }
  ];

  const renderVista = () => {
    switch (vista) {
      case 'resumen': return <ResumenAsistenciasAlumno />;
      case 'rango': return <AsistenciasAlumnoPorRango />;
      case 'fecha': return <AsistenciasAlumnoPorFecha />;
      default: return <ResumenAsistenciasAlumno />;
    }
  };

  const opcionActiva = opcionesNavegacion.find(opcion => opcion.id === vista);

  return (
    <div className="asistencias-page-wrapper">
      <div className="asistencias-container">
        {/* Header Principal */}
        <div className="asistencias-page-header">
          <div className="asistencias-header-icon">
            <FaUserGraduate />
          </div>
          <h1 className="asistencias-main-title">Mis Asistencias</h1>
          <p className="asistencias-subtitle">
            Consulta tu historial de asistencias de diferentes formas
          </p>
        </div>

        <div className="asistencias-main-content">
          {/* Panel de Navegación */}
          <div className="asistencias-nav-panel">
            <div className="nav-panel-header">
              <FaChartBar className="panel-icon" />
              <h3>Vistas de Asistencia</h3>
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
          <div className="asistencias-content-panel">
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

export default AsistenciasPageAlumno;