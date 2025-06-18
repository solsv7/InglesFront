import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Profile from '../Profile/Profile';
import transition from '../../transition';

const HomeStudent = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const checkRole = useCallback(() => {
        if (!user) {
            console.error('Usuario no encontrado');
            navigate('/'); 
            return;
        }

        if (user.rol === 1) {
            navigate('/');
        } else if (user.rol === 2) {
            navigate('/');
        } else if (user.rol === 3) {
            
        } else {
            navigate('/');
        }
    }, [navigate,user]);

    
    useEffect(() => {
        checkRole();
    }, [checkRole]); 

    return (
        <div>
            <Profile />
        </div>
        
    );
};

export default transition(HomeStudent);