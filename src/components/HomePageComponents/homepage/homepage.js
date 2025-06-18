import React from "react";
import './homepage.css';
import ImageLoader from "../../functionalComponent/imageLoader/imageLoader";

const Homepag = () => {
    return(
        <div className="todo">
            <div className="TextoHome">
                <h2>Una manera diferente de aprender idiomas</h2>
                <h3>"Creando Futuro"</h3>
            </div>
            <ImageLoader />
        </div>
    )
}

export default Homepag;