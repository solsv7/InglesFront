import React, { useState, useEffect, useContext } from 'react';
import './header.css';
import Sidebar from '../sidebar/sidebar';
import BandejaMSG from '../Advices/BandejaMSG';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../functionalComponent/UserContext/UserContext';
import logo from '../../images/mejorar img.png';
import Navbar from '../Navbar/Navbar';

const Header = () => {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const { handleLogout } = useContext(UserContext);
  const navigate = useNavigate();
  const showNavbar = !user?.rol; // true si no hay rol


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300 && window.scrollY > lastScrollY) {
        setShow(false);
      } else {
        setShow(true);
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const content = user?.rol === 3 ? <BandejaMSG /> : null;

  const validateSidebar = user?.rol === 4 
    ? <div className='cerrarGuest'><h3 onClick={handleLogout}>Cerrar Sesión</h3></div>
    : <div className="BTNSidebar"><Sidebar /></div>;

  const checkRole = () => {
    switch (user?.rol) {
      case 1: navigate('/home-admin'); break;
      case 2: navigate('/home-teacher'); break;
      case 3: navigate('/home-student'); break;
      default: navigate('/'); break;
    }
  };

  const botonInscripcion = user?.rol >= 1 && user?.rol <= 3 ? (
    <h3 className="btn btn-left"><Link to='/All-Vids' className='linkStyle'>Videos</Link></h3>
  ) : user?.rol === 4 ? (
    <h3 className="btn btn-left ins-button"><Link to='/Inscription' className='linkStyle'>Inscribirme</Link></h3>
  ) : null;
  return (
    <div
      className="header-content"
      style={{
        transition: 'top 0.3s',
        position: 'fixed',
        top: show ? 0 : '-300px',
        width: '100%',
        zIndex: 1000
      }}
    >
      <div className="header-top">
        <div className="header-title">
          <img alt="logo" src={logo} />
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

        <div className="login-container">
          {token ? (
            user?.rol !== 4 ? (
              <div className="log-perf">
                
                {user?.rol === 3 && (
                  <div className='BTNAvisos'>
                    <BandejaMSG />
                  </div>
                )}
                <h3 className="btn btn-left" id="user" onClick={checkRole}>
                  {user?.nombre || 'Usuario'}
                </h3>
                <div className='BotonSidebar'>{validateSidebar}</div>
              </div>
            ) : (
              <div className="cerrarGuest">
                <h3 onClick={handleLogout}>Cerrar Sesión</h3>
              </div>
            )
          ) : (
            <button className="first-button">
              <Link to='/Login' className='EstiloLink'>Ingresar</Link>
            </button>
          )}
        </div>
      </div>      
      {/*<nav className="nav-links">
        <h3 className="btn btn-left"><Link to='/' className='linkStyle'>Inicio</Link></h3>
        <h3 className="btn btn-left"><Link to='/About' className='linkStyle'>Sobre Nosotros</Link></h3>
        {botonInscripcion}
      </nav>*/}
      <Navbar showNavbar={showNavbar} />

    </div>
    
  );
};

export default Header;
