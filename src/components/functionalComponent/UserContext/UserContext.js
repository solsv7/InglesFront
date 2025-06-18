import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setUserName(user.nombre);
        }
    }, []);

    // Función handleLogout
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUserName(''); // Limpiar el estado del nombre del usuario
        navigate('/'); // Redirigir al inicio o página de login
    };

    return (
        <UserContext.Provider value={{ userName, setUserName, handleLogout }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
