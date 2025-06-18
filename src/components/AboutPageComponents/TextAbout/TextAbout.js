import React from "react";
import './TextAbout.css'

const TextAbout = () => {
    return(
        <div className="ContenedorAbout">
            <div className="Contenido">
                <div className="TituloInstituto">
                    <h2>St Thomas</h2>         
                    <h4>Ingles y Portugues</h4>
                </div>

                <div className="Years">
                    <h1>+30 Años</h1>
                    <h3>Ayudando a la gente a mejorar sus habilidades en idiomas</h3>
                </div>
            </div>
        </div>
    );
};

export default TextAbout;