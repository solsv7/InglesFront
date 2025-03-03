import React, { useContext } from 'react';
import './header.css';
import Sidebar from '../sidebar/sidebar';
import BandejaMSG from '../Advices/BandejaMSG';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../functionalComponent/UserContext/UserContext';
import { Link } from 'react-router-dom';

const Header = () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const { handleLogout } = useContext(UserContext);
  const navigate = useNavigate();

  let content = user?.rol === 3 ? <BandejaMSG /> : <div className='Nada'></div>;

  let validateSidebar = user?.rol === 4 
    ? <div className='cerrarGuest'><h3 onClick={handleLogout}>Cerrar Sesion</h3></div>
    : <div className="BTNSidebar"><Sidebar /></div>;

  const checkRole = () => {
    switch (user?.rol) {
      case 1: navigate('/home-admin'); break;
      case 2: navigate('/home-teacher'); break;
      case 3: navigate('/home-student'); break;
      default: navigate('/'); break;
    }
  };

  // Definir el botón basado en el rol del usuario
  let botonInscripcion = null;
  if (user?.rol >= 1 && user?.rol <= 3) {
    botonInscripcion = <h3 className="btn btn-left"><Link to='/All-Vids' className='linkStyle'>Videos</Link></h3>;
  } else if (user?.rol === 4) {
    botonInscripcion = <h3 className="btn btn-left ins-button"><Link to='/Inscription' className='linkStyle'>Inscribirme</Link></h3>;
  }

  return (
    <header className="header">
      <div className="ContenedorTitle">
        <div className="Title">
          <div className="Word">
            <p id="Blue">S</p>
            <p id="Red">t</p>
          </div>
          <div className="Word">
            <p id="Blue">T</p>
            <p id="Red">h</p>
            <p id="Blue">o</p>
            <p id="Red">m</p>
            <p id="Blue">a</p>
            <p id="Blue">s</p>
          </div>
        </div>
      </div>
      <nav className="nav-links">
        <h3 className="btn btn-left"><Link to='/' className='linkStyle'>Inicio</Link></h3>
        <h3 className="btn btn-left"><Link to='/About' className='linkStyle'>Sobre Nosotros</Link></h3>
        {botonInscripcion}

        <div className="login-container">
  {token ? (
    user?.rol !== 4 ? (
      // Para usuarios con rol distinto de 4
      <div className="log-perf">
        <h3 className="btn btn-left" id="user" onClick={checkRole}>
          {user.nombre || 'Usuario'}
        </h3>
        <div className='BTNAvisos'>{content}</div>
        <div className='BotonSidebar'>{validateSidebar}</div>
      </div>
    ) : (
      // Para usuarios con rol 4 (solo botón de Cerrar Sesión)
      <div className="cerrarGuest">
        <h3 onClick={handleLogout}>Cerrar Sesion</h3>
      </div>
    )
  ) : (
    // Si no hay token, muestra "Ingresar"
    <button className="login-button">
      <Link to='/Login' className='EstiloLink'>Ingresar</Link>
    </button>
  )}
</div>

      </nav>
    </header>
  );
};

export default Header;
