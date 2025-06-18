import React from "react";
import Robot from '../../images/ImgRobot.png';
import './WorkInProgress.css';

const WorkInProgress = () => {
    return(
        <div>
            <h3 className="TextoMantenimiento">Ups... Este apartado aun sigue en desarrollo, vuelve en otro momento</h3>
            <img src={Robot} alt="" className="ImagenRobot"/>
        </div>
    )
}

export default WorkInProgress;