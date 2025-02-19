import React, { useContext, useEffect } from 'react';
import './header.css';
import Login from '../HomePageComponents/Login/LoginComponent';
import Sidebar from '../sidebar/sidebar';
import BandejaMSG from '../Advices/BandejaMSG';
import { useNavigate} from 'react-router-dom';
import { UserContext } from '../functionalComponent/UserContext/UserContext';
import { Link } from 'react-router-dom';

const Header = () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const { handleLogout } = useContext(UserContext);
  const navigate = useNavigate();



  
let content;
    if (user?.rol == 3 ){
      content = (
        <div>
            <BandejaMSG />
        </div>
      );
    } else {
      content = (
          <div className='Nada'>
          </div>
      );
  }
  let validateSidebar;
  if (user?.rol == 4 ){
    validateSidebar = (
      <div className='cerrarGuest'>
        <h3 onClick={handleLogout}>Cerrar Sesion</h3>
      </div>
          
    );
  }else {
    validateSidebar = (
      <div className="BTNSidebar">
        <Sidebar />
      </div>
    );
}

  // Redirección basada en el rol del usuario
  const checkRole = () => {
    switch (user?.rol) {
      case 1:
        navigate('/home-admin');
        break;
      case 2:
        navigate('/home-teacher');
        break;
      case 3:
        navigate('/home-student');
        break;
      default:
        navigate('/');
        break;
    }
  };
  

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
        {/* Navegación */}
        <h3 className="btn btn-left" ><Link to='/' className='linkStyle'>Inicio</Link></h3>
        <h3 className="btn btn-left" ><Link to='/All-Vids' className='linkStyle'>Sobre Nosotros</Link></h3>


        {/* Contenedor de login */}
        <div className="login-container">
          {token ? (
            <div className="log-perf">
              <h3 className="btn btn-left ins-button" ><Link to='/Inscription' className='linkStyle'>Inscripcion</Link></h3>
                <h3 className="btn btn-left" id="user" onClick={checkRole}>
                  {user.nombre || 'Usuario'}
                </h3>
              <div className='BTNAvisos'>
                {content}
              </div>
              <div >
                {validateSidebar}
              </div>
            </div>
          ) : (
            <>
                <button className="login-button"><Link to='/Login' className='EstiloLink'>Ingresar</Link></button>
                
            </>
        )}
    </div>
</nav>
    </header>
  );
};

export default Header;
