import React, { useState, useEffect, useContext, useRef } from 'react';
import ReactDOM from 'react-dom';
import './header.css';
import { IoMdClose } from "react-icons/io";
import Sidebar from '../sidebar/sidebar';
import BandejaMSG from '../Advices/BandejaMSG';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../functionalComponent/UserContext/UserContext';
import logo from '../../images/mejorar img.png';
import Navbar from '../Navbar/Navbar';

const Header = () => {
  const [showOverlay, setShowOverlay] = useState(false); // Cambiar a false por defecto
  const [maskStyle, setMaskStyle] = useState({});
  const insButtonRef = useRef(null);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const { handleLogout } = useContext(UserContext);
  const navigate = useNavigate();
  const showNavbar = !user?.rol;

  // Mostrar overlay solo para rol 4 (invitado)
  useEffect(() => {
    if (user?.rol === 4) {
      setShowOverlay(true);
    } else {
      setShowOverlay(false);
    }
  }, [user?.rol]);

  // Calcula el maskStyle para el botón
  useEffect(() => {
    function updateMask() {
      if (showOverlay && insButtonRef.current) {
        const rect = insButtonRef.current.getBoundingClientRect();
        const radius = Math.max(rect.width, rect.height) * 0.8; // Aumenté el radio para mejor efecto
        const isMobile = window.innerWidth <= 700;
        const x = rect.left + rect.width / (isMobile ? 2 : 1.7);
        const y = rect.top + rect.height / 2;
        setMaskStyle({
          WebkitMaskImage: `radial-gradient(circle ${radius}px at ${x}px ${y}px, transparent 99%, black 100%)`,
          maskImage: `radial-gradient(circle ${radius}px at ${x}px ${y}px, transparent 99%, black 100%)`
        });
      } else {
        setMaskStyle({});
      }
    }
    
    if (showOverlay) {
      // Pequeño delay para asegurar que el botón esté renderizado
      setTimeout(updateMask, 100);
    }
    
    updateMask();
    window.addEventListener('resize', updateMask);
    window.addEventListener('scroll', updateMask);
    return () => {
      window.removeEventListener('resize', updateMask);
      window.removeEventListener('scroll', updateMask);
    };
  }, [showOverlay]);

  // Bloquear scroll cuando el overlay está activo
  useEffect(() => {
    if (showOverlay) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [showOverlay]);

  const content = user?.rol === 3 ? <BandejaMSG /> : null;

  const validateSidebar = user?.rol === 4 
    ? <div className='cerrarGuest'>
        <h3 onClick={handleLogout}>Cerrar Sesión</h3>
        <button
          ref={insButtonRef}
          className="btn btn-left ins-button highlighted-button"
          onClick={() => {
            setShowOverlay(false);
            navigate('/Inscription');
          }}
        >
          Inscribirme
        </button>
      </div>
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
    <h3 
      ref={insButtonRef}
      className="btn btn-left ins-button highlighted-button"
    >
      <Link 
        to='/Inscription' 
        className='linkStyle'
        onClick={() => setShowOverlay(false)}
      >
        Inscribirme
      </Link>
    </h3>
  ) : null;

  return (
    <div className="header-content-ST-Thomas">
      <div className="header-top-ST-Thomas">
        <div className="header-title-ST-Thomas">
          <img alt="logo" src={logo} />
          <div className="Title-ST-Thomas">
            <div className="Word-ST-Thomas">
              <p id="Blue">S</p>
              <p id="Red">t</p>
            </div>
            <div className="Word-ST-Thomas">
              <p id="Blue">T</p>
              <p id="Red">h</p>
              <p id="Blue">o</p>
              <p id="Red">m</p>
              <p id="Blue">a</p>
              <p id="Blue">s</p>
            </div>
          </div>
        </div>

        <div className="login-container-buttons">
          {token ? (
            user?.rol !== 4 ? (
              <div className="log-perf">
                {user?.rol === 3 && (
                  <div className='BTNAvisos'>
                    <BandejaMSG />
                  </div>
                )}
                <div className='BotonSidebar'>{validateSidebar}</div>
              </div>
            ) : (
              <div className="cerrarGuest">
                <button
                  ref={insButtonRef}
                  className="btn btn-left ins-button highlighted-button"
                  onClick={() => {
                    setShowOverlay(false);
                    navigate('/Inscription');
                  }}
                >
                  Inscribirme
                </button>
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
      <Navbar showNavbar={showNavbar} />
      
      {/* Overlay solo para rol 4 */}
      {showOverlay && user?.rol === 4 && ReactDOM.createPortal(
        <div
          className="overlay"
          style={maskStyle}
        >
          <div className="overlay-content">
            <p className='suggestion-overlay'>Completa el formulario de inscripción ubicado en la parte superior.</p>
            <button 
              className="close-overlay" 
              onClick={() => setShowOverlay(false)}
            >
              <IoMdClose size={28} />
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Header;