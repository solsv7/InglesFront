import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setUserName(user.nombre);
        }
    }, []);

    return (
        <UserContext.Provider value={{ userName, setUserName}}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;