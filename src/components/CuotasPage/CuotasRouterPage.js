// CuotasPage.js (este reemplaza a CuotasRouterPage.js)
import React, { useState } from 'react';
import RegistrarCuota from './RegistrarCuota.js';
import ObtenerCuotas from './ObtenerCuotas.js';
import CuotasPorAlumno from './CuotasPorAlumno.js';
import CuotasPendientes from './CuotasPendientes.js';
import CuotasPorRango from './CuotasPorRango.js';
import './CuotasPage.css';


const CuotasPage = () => {
  const [vista, setVista] = useState('obtener'); // vista por defecto

  return (
    <div className="cuotas-page">
      <h1>Gestión de Cuotas</h1>
      
      <div className="nav-botones">
        <button onClick={() => setVista('registrar')}>Registrar Cuota</button>
        <button onClick={() => setVista('obtener')}>Obtener Cuotas</button>
        <button onClick={() => setVista('alumno')}>Cuotas por Alumno</button>
        <button onClick={() => setVista('pendientes')}>Cuotas Pendientes</button>
        <button onClick={() => setVista('rango')}>Cuotas por Rango</button>
      </div>

      <div className="vista-activa">
        {vista === 'registrar' && <RegistrarCuota />}
        {vista === 'obtener' && <ObtenerCuotas />}
        {vista === 'alumno' && <CuotasPorAlumno />}
        {vista === 'pendientes' && <CuotasPendientes />}
        {vista === 'rango' && <CuotasPorRango />}
      </div>
    </div>
  );
};

export default CuotasPage;
