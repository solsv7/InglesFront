import React from "react";
import './homepage.css';
import './fondo.png';
import profesor from './Persona.png';
import {Fade} from 'react-reveal';

const Homepag = () => {
    return(
        <div className="todo">
        <div className="contenedor">
            <Fade>
            <h2 className="Texto">
                "A different way to learn Languages"
            </h2>
            </Fade>
            <img src={profesor} alt="" className="profe"></img>
        </div>
        </div>
    )
}

export default Homepag;