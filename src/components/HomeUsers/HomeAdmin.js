import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import transition from "../../transition";

const HomeAdmin = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const checkRole = useCallback(() => {
        if (!user) {
            console.error('Usuario no encontrado');
            navigate('/'); 
            return;
        }

        if (user.rol === 1) {
        } else if (user.rol === 2) {
            navigate('/');
        } else if (user.rol === 3) {
            navigate('/');
        } else {
            navigate('/');
        }
    }, [navigate,user]);

    
    useEffect(() => {
        checkRole();
    }, [checkRole]); 

    return (
        <div>
            <h1 className='nombreUsuario'>Bienvenido, Administrador {user?.nombre}!</h1>
            
        </div>
    );
};

export default transition(HomeAdmin);
