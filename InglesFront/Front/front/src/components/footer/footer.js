import React from "react";
import './footer.css';
import facebook from '../iconos/facebook.png';
import instagram from '../iconos/instagram.png';
import phone from '../iconos/phone.png';
import mail from '../iconos/mail.png';

const Footer = () => {
    return(
        <div className="contenido">
            <div className="Redes">
                <div className="red"><img src={instagram} className="imagenes" alt=""></img></div>
                <div className="red"><img src={facebook} className="imagenes" alt=""></img></div>
                <div className="red"><img src={phone} className="imagenes" alt=""></img></div>
                <div className="red"><img src={mail} className="imagenes" alt=""></img></div>
            </div>
            <h4>All rights reserved St. Thomas Enlgish and Portguese®</h4>
        </div>
    )
}
export default Footer;