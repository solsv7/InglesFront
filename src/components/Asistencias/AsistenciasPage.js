import React, { useState } from 'react';
import RegistroAsistencias from './RegistroAsistencias';
import VerAsistenciasPorFecha from './VerAsistenciasPorFecha';
import TotalesPorClase from './TotalesPorClase';
import TotalesPorRango from './TotalesPorRango';
import './AsistenciasPage.css';

const AsistenciasPage = () => {
  const [vista, setVista] = useState('registrar');

  return (
    <div className="asistencias-page">
      <h1>Gestión de Asistencias</h1>

      <div className="nav-botones">
        <button onClick={() => setVista('registrar')}>Registrar Asistencias</button>
        <button onClick={() => setVista('por-fecha')}>Ver por Clase y Fecha</button>
        <button onClick={() => setVista('totales')}>Totales por Clase</button>
        <button onClick={() => setVista('rango')}>Totales por Rango</button>
      </div>

      <div className="vista-activa">
        {vista === 'registrar' && <RegistroAsistencias />}
        {vista === 'por-fecha' && <VerAsistenciasPorFecha />}
        {vista === 'totales' && <TotalesPorClase />}
        {vista === 'rango' && <TotalesPorRango />}
      </div>
    </div>
  );
};

export default AsistenciasPage;
