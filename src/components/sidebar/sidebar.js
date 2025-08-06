// src/components/Sidebar.js
import React, { useState, useContext, useEffect } from 'react';
import {useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../functionalComponent/UserContext/UserContext'; // Importar el contexto
import './Sidebar.css';
import menuImagen from '../../images/iconos/menu-hamburguesa.png';
import SidebarDropdown from './SidebarDropdown';
import { Link } from 'react-router-dom';


const Sidebar = () => {

  // Estado para controlar si la sidebar está abierta o cerrada
    const [isOpen, setIsOpen] = useState(false);
    const toggleSidebar = () => setIsOpen(!isOpen);
    const location = useLocation();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user')) || {}; // Si es null, asigna un objeto vacío
    const {setUserName} = useContext(UserContext); // Usar el contexto
 
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUserName(''); // Limpiar el nombre del usuario en el contexto
        navigate('/');
    };

    useEffect(() => {
      setIsOpen(false); // Cerrar sidebar al cambiar de ruta
    }, [location.pathname]);

    let content;
    if (user.rol === 1){
      content = (
        <div className='OpcionesSidebar'>
            <Link to="/home-admin"><h4 className='OpcionSidebaruno' id='Blue2'>Perfil</h4></Link>
            <Link to="/Crear-usuarios"><h4 className='OpcionSidebaruno' id='Red2'>Crear Usuario</h4></Link>
            <Link to="/Not-Ready"><h4 className='OpcionSidebaruno' id='Red2'>Modificar Clases</h4></Link>
            <Link to="/Accept"><h4 className='OpcionSidebaruno' id='Red2'>Aceptar Usuarios</h4></Link>
            <button onClick={handleLogout} className='LogOutBTN'>Cerrar Sesion</button>
        </div>
      );
    } else if (user.rol === 2){
      content = (
        <div className='OpcionesSidebar'>
            <Link to="/home-teacher"><h4 className='OpcionSidebar' id='Blue2'>Perfil</h4></Link>
            <Link to="/Crear-usuarios"><h4 className='OpcionSidebar' id='Red2'>Registrar</h4></Link>
            <Link to="/Upload-Marks"><h4 className='OpcionSidebar' id='Red2'>Subir Notas</h4></Link>
             <SidebarDropdown title="Recursos">
              <Link to="/upload-vids"><h4 className='OpcionSidebar' id='Red2'>Subir Videos</h4></Link>
              <Link to="/All-Vids"><h4 className='OpcionSidebar' id='Red2'>Ver Videos</h4></Link>
              <Link to="/diccionario"><h4 className='OpcionSidebar' id='Red2'>Diccionario</h4></Link>
            </SidebarDropdown>
            <Link to="/Advices"><h4 className='OpcionSidebar' id='Red2'>Avisos</h4></Link>
            <Link to="/AdminSchedules"><h4 className='OpcionSidebar' id='Red2'>Clases</h4></Link>
            <Link to="/Niveles"><h4 className='OpcionSidebar' id='Red2'>Niveles</h4></Link>
            <Link to="/Periodos"><h4 className='OpcionSidebar' id='Red2'>Periodos</h4></Link>
            <Link to="/Inscribir-clases"><h4 className='OpcionSidebar' id='Red2'>Alumnos</h4></Link>
            <Link to="/Asistencias"><h4 className='OpcionSidebar' id='Red2'>Asistencias</h4></Link>
            <Link to="/cuotas"><h4 className='OpcionSidebar' id='Red2'>Cuotas</h4></Link>

            <button onClick={handleLogout} className='LogOutBTN'>Cerrar Sesion</button>
        </div>
      );
    } else if (user.rol === 3){
      content = (
          <div className='OpcionesSidebar'>
              <Link to="/home-student"><h4 className='OpcionSidebar' id='Blue2'>Perfil</h4></Link>
              <Link to="/Student-Marks"><h4 className='OpcionSidebar' id='Red2'>Mis Notas</h4></Link>
              <Link to="/All-Msg"><h4 className='OpcionSidebar' id='Red2'>Avisos</h4></Link>
              <Link to="/All-Vids"><h4 className='OpcionSidebar' id='Red2'>Recursos</h4></Link>
              <Link to="/mis-asistencias"><h4 className='OpcionSidebar' id='Red2'>Asistencias</h4></Link>
              <Link to="/diccionario"><h4 className='OpcionSidebar' id='Red2'>Diccionario</h4></Link>


              
              <button onClick={handleLogout} className='LogOutBTN'>Cerrar Sesion</button>
          </div>
      );
    } else {
      content = (
          <div className='OpcionesSidebar'>
              <h4>No tienes permisos asignados</h4>
              <button onClick={handleLogout} className='LogOutBTN'>Cerrar Sesion</button>
          </div>
      );
  }

  return (
      <>
        <button onClick={toggleSidebar} className="toggle-button">
          <img src={menuImagen} alt='' id='menuImagen' />
        </button>

        {/* Overlay con blur */}
        {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar} />}

        <div className={`sidebar ${isOpen ? 'open' : 'closed'} rol-${user.rol}`}>
          <div className='Divparasepararyquedebonito'>
            {content}
          </div>
        </div>
      </>
    );

};

export default Sidebar;
