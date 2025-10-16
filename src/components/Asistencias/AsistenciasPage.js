import React, { useState } from 'react';
import { 
  FaCalendarCheck, 
  FaClipboardList, 
  FaChartBar, 
  FaCalendarAlt,
  FaUsers,
  FaChartLine,
  FaChevronRight
} from 'react-icons/fa';
import { BsCalendarRangeFill } from "react-icons/bs";
import { MdClass } from "react-icons/md";


import RegistroAsistencias from './RegistroAsistencias';
import VerAsistenciasPorFecha from './VerAsistenciasPorFecha';
import TotalesPorClase from './TotalesPorClase';
import TotalesPorRango from './TotalesPorRango';
import './AsistenciasPage.css';

const AsistenciasPage = () => {
  const [vista, setVista] = useState('registrar');

  const opcionesNavegacion = [
    {
      id: 'registrar',
      icono: FaClipboardList,
      titulo: 'Registrar Asistencias',
      descripcion: 'Toma la asistencia de los alumnos por clase',
      color: '#48bb78'
    },
    {
      id: 'por-fecha',
      icono: FaCalendarAlt,
      titulo: 'Ver por Clase y Fecha',
      descripcion: 'Consulta asistencias por clase y fecha específica',
      color: '#ed8936'
    },
    {
      id: 'totales',
      icono: MdClass,
      titulo: 'Totales por Clase',
      descripcion: 'Estadísticas de asistencia por clase',
      color: '#667eea'
    },
    {
      id: 'rango',
      icono: BsCalendarRangeFill,
      titulo: 'Totales por Rango',
      descripcion: 'Reportes de asistencia por rango de fechas',
      color: '#9f7aea'
    }
  ];

  const renderVista = () => {
    switch (vista) {
      case 'registrar': return <RegistroAsistencias />;
      case 'por-fecha': return <VerAsistenciasPorFecha />;
      case 'totales': return <TotalesPorClase />;
      case 'rango': return <TotalesPorRango />;
      default: return null;
    }
  };

  const opcionActiva = opcionesNavegacion.find(opcion => opcion.id === vista);

  return (
    <div className="asistencias-page-wrapper">
      <div className="asistencias-container">
        {/* Header Principal */}
        <div className="asistencias-page-header">
          <div className="asistencias-header-icon">
            <FaCalendarCheck />
          </div>
          <h1 className="asistencias-main-title">Gestión de Asistencias</h1>
          <p className="asistencias-subtitle">
            Registra, visualiza y analiza la asistencia de tus alumnos
          </p>
        </div>

        <div className="asistencias-main-content">
          {/* Panel de Navegación */}
          <div className="asistencias-nav-panel">
            <div className="nav-panel-header">
              <FaUsers className="panel-icon" />
              <h3>Módulos de Asistencia</h3>
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

export default AsistenciasPage;