import React from "react";
import img1 from "../../images/Gente1.jpeg";
import img2 from "../../images/Gente2.jpeg";
import img3 from "../../images/Gente3.jpeg";
import "./Gallery.css"

const Gallery = () => {
    return ( 
        <div className="ContentGallery">
            <div className="TextGallery">
                <h2>Eventos Recientes</h2>
                <h3>Viajes de fin de curso a Brazil/Reino Unido</h3>
                <h3>Campamentos para los mas chicos</h3>
                <h3>Festejamos festividades juntos</h3>
            </div>
            <div className="slider" >
                <div className="slide-track">
                    <div className="slide"><img src={img1} alt=""/></div>
                    <div className="slide"><img src={img2} alt=""/></div>
                    <div className="slide"><img src={img3} alt=""/></div>
                    <div className="slide"><img src={img1} alt=""/></div>
                    <div className="slide"><img src={img2} alt=""/></div>
                    <div className="slide"><img src={img3} alt=""/></div>
                    <div className="slide"><img src={img1} alt=""/></div>
                    <div className="slide"><img src={img2} alt=""/></div>
                    <div className="slide"><img src={img3} alt=""/></div>
                </div>
            </div>
        </div>
    );
};

export default Gallery;

