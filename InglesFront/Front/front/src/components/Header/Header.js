import React, { useState } from 'react';
import './header.css';
import Login from '../Login/LoginComponent';
import logo from './logo.png';
import perfil from './perfil.png'
import { useNavigate } from 'react-router-dom'; 

const Header = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token'); 

    const handleLogout = () => {
        localStorage.removeItem('token'); 
        navigate('/'); 
    };
    const [show, setShow] = useState(false);


    function changeVis(){
        setShow(!show);
        console.log('estado es : ', {show})
        if (show === true){
            document.getElementById('formulario').style.animation = 'leave 1s ease-in-out'
            document.getElementById('formulario').style.display = 'none'
        } else{
            document.getElementById('formulario').style.animation = 'enter 1s ease-in-out'
            document.getElementById('formulario').style.display = 'block'
        }
    }
   

    return (
        <div>
            <header className="header">
                <div className="logo">
                    <img src={logo} alt="Logo" />
                </div>
                <nav className="nav-links">
                    <a href='./about.js'>Home</a>
                    <a href="#schedules">Schedules</a>
                    <a href="#about">About</a>
                    <a href="#blog">Blog</a>
                    <div className="login-container">
                        {token ? (
                            <div className='log-perf'>
                                <button className="logout-button" onClick={handleLogout}>"Nombre de Usuario"</button>
                                <img src={perfil} className='ftPerfil'></img>
                                
                            </div>
                        ) : (
                            <>
                                <button className="login-button" onClick={changeVis}>Login</button>
                                <div className="login-form" id='formulario' >
                                    <Login />
                                </div>
                            </>
                        )}
                    </div>
                    <div className="boton">
                        <input type="checkbox" id="btn-switch">
                        </input>
                        <label for="btn-switch" className='lbl-switch'></label>
                    </div>
                </nav>
            </header>
        </div>
    );
};

export default Header;