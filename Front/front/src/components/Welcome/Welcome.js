import React from 'react';
import './welcome.css';

const Welcome = ({ studentName }) => {
    return (
        <div>
            <h1>Bienvenido, {studentName ? studentName : 'usuario'}!</h1>
        </div>
    );
};

export default Welcome; 
