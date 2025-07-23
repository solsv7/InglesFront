import React, { useState } from 'react';
import ResumenAsistenciasAlumno from './ResumenAsistenciasAlumno';
import AsistenciasAlumnoPorRango from './AsistenciasAlumnoPorRango';
import AsistenciasAlumnoPorFecha from './AsistenciasAlumnoPorFecha';
import './AsistenciasPage.css';

const AsistenciasPageAlumno = () => {
  const [vista, setVista] = useState('resumen');

  return (
    <div className="asistencias-page">
      <h1>Mis Asistencias</h1>

      <div className="nav-botones">
        <button onClick={() => setVista('resumen')}>Resumen General</button>
        <button onClick={() => setVista('rango')}>Por Rango de Fechas</button>
        <button onClick={() => setVista('fecha')}>Por Fecha</button>
      </div>

      <div className="vista-activa">
        {vista === 'resumen' && <ResumenAsistenciasAlumno />}
        {vista === 'rango' && <AsistenciasAlumnoPorRango />}
        {vista === 'fecha' && <AsistenciasAlumnoPorFecha />}
      </div>
    </div>
  );
};

export default AsistenciasPageAlumno;
