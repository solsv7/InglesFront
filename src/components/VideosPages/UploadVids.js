import React,{useState} from "react";
import transition from "../../transition";
import axios from "axios";
import './UploadVids.css';

const UploadVids = () => {
    const [formData, setFormData] = useState({
            titulo: "",
            idioma: "",
            url: "",
        });
        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
    
        
            console.log('Datos enviados al backend:', formData);
        
            try {
                const response = await axios.post("http://localhost:3001/api/upload-vids", formData);
                console.log("Informacion de video enviado con éxito:", response.data);
                alert("Informacion de video enviado con éxito");
            } catch (error) {
                console.error("Error al enviar la informacion del video:", error);
                alert("Hubo un error al enviar la informacion del video");
            }
        };
    return(
        <div>
            <form className="Formulario-Videos" onSubmit={handleSubmit}>
                <h1>Subir Videos</h1>
                <div  className="separador-form">
                <label>Ingrese el titulo</label>
                <input name="titulo" value={formData.titulo} onChange={handleChange} type="text" className="campo-texto" placeholder="Ej: Practica verbo to be - ejercicios"></input>
                </div>
                <div className="separador-form">
                <label>Ingrese el idioma</label>
                <select name="idioma" value={formData.idioma} onChange={handleChange} className="Options">
                        <option value="">Seleccione una opción</option>
                        <option value="Ingles">Inglés</option>
                        <option value="Portugues">Portugués</option>
                </select>
                </div>
                <div  className="separador-form">
                <label>Ingrese la URL (enlace del video de youtube)</label>
                <input name="url" value={formData.url} onChange={handleChange} type="text" placeholder="Ej: https://www.youtube.com/watch?v=AbCdeFghiJk" className="campo-texto"></input>
                </div>
                <input type="submit" value="Subir Video" className="enviar-boton" />
            </form>
        </div>
    )
}

export default transition(UploadVids);