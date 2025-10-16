import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import transition from "../../transition";
import axios from "axios";
import Swal from "sweetalert2";
import './Inscribe.css';

const Inscribe = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [isAdultRequired, setIsAdultRequired] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        programa: "",
        conoce_por: "",
        nombre: "",
        dni: "",
        fecha_nacimiento: "",
        whatsapp: "",
        nombre_adulto: "" || null,
        whatsapp_adulto: "" || null,
        calle: "",
        barrio: "",
        ciudad: "",
        estado_provincia: "",
        codigo_postal: "",
        mail: "",
        ocupacion: "",
        horarios_disponibles: "",
        nivel_estudio: "",
        pago: "",
        afeccion: "",
        id_usuario: user?.id || "",
    });

    const handleExportExcel = async () => {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/export-excel`, formData);
    };

    const handeForm = async () => {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/upload-form`, formData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await handleExportExcel();
            await handeForm();
            Swal.fire({
                icon: 'success',
                title: 'Formulario Enviado',
                text: 'El formulario fue enviado con éxito. Te enviaremos un correo cuando sea revisado.',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#29154e'
            }).then(() => navigate("/"));
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Algo salió mal',
                text: 'Hubo un problema al intentar enviar el formulario, intenta nuevamente.',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#d33'
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "fecha_nacimiento") {
            const birthDate = new Date(value);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();

            if (age < 5 || age > 40) {
                Swal.fire({
                    icon: 'warning',
                    title: '¿Cuál es tu edad?',
                    text: 'Necesitas poner tu edad real (entre 5 y 40)',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#29154e'
                });
                setFormData((prev) => ({ ...prev, fecha_nacimiento: "" }));
                return;
            }

            setIsAdultRequired(age >= 5 && age < 18);
        }
        let newValue = value;

        if (name === "nombre" || name === "apellido" || name === "ciudad" || name === "nombre_adulto" || name === "calle" || name === "barrio" || name === "estado_provincia") {
            newValue = value
                .split(" ")
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(" ");
        }

        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    return (
        <div className="Formulario-Wrapper">
            <div className="Contenido-Formulario">
                <h1>Formulario de Inscripcion</h1>
                <form onSubmit={handleSubmit}>
                    <div className="separadores-formulario">
                        <label>Programa</label>
                        <select name="programa" value={formData.programa} onChange={handleChange} required>
                        <option value="">Seleccione un programa</option>
                        <option value="Ingles interactivo para adultos">Ingles interactivo para adultos</option>
                        <option value="Ingles academico cursos regulares(a partir de los 4 años)">Ingles academico cursos regulares(a partir de los 4 años)</option>
                        <option value="Ingles chat">Ingles chat</option>
                        <option value="Ingles Universitario">Ingles Universitario</option>
                        <option value="Ingles Tecnico">Ingles Tecnico</option>
                        <option value="Portugues interactivo para adultos">Portugues interactivo para adultos</option>
                        <option value="Portugues academico cursos regulares(a partir de los 4 años)">Portugues academico cursos regulares(a partir de los 4 años)</option>
                        <option value="Portugues chat">Portugues chat</option>
                        <option value="Portugues Universitario">Portugues Universitario</option>
                        <option value="Portugues Tecnico">Portugues Tecnico</option>
                        <option value="Traducciones">Traducciones</option>
                        <option value="Acompañamiento escolar/tutorias">Acompañamiento escolar/tutorias</option>
                        </select>
                    </div>

                    <div className="separadores-formulario">
                        <label>¿Como se entero de nuestro centro de idiomas?</label>
                        <select name="conoce_por" value={formData.conoce_por} onChange={handleChange} required>
                            <option value="">Seleccione una opción</option>
                            <option value="Facebook">Facebook</option>
                            <option value="Instagram">Instagram</option>
                            <option value="Google">Google</option>
                            <option value="Pagina Web">Pagina Web</option>
                            <option value="Recomendacion">Recomendación</option>
                            <option value="Poster o Flyer">Poster o Flyer</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>

                    <div className="separadores-formulario">
                        <label>Nombre y apellido del estudiante</label>
                        <input
                            type="text"
                            name="nombre"
                            placeholder="Ej: Juan Perez"
                            value={formData.nombre}
                            onChange={handleChange}
                            id="Campo-Nombre"
                            required
                        />
                    </div>
                    <div className="separadores-formulario">
                        <label>N° de Documento del estudiante</label>
                        <input
                            type="number"
                            name="dni"
                            placeholder="Ej: 40192394"
                            value={formData.dni}
                            onChange={handleChange}
                            required
                            maxLength={8}
                        />
                    </div>

                    <div className="separadores-formulario">
                        <label>Fecha de nacimiento</label>
                        <input
                            type="date"
                            name="fecha_nacimiento"
                            value={formData.fecha_nacimiento}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="separadores-formulario">
                        <label>WhatsApp del estudiante</label>
                        <input
                            type="number"
                            name="whatsapp"
                            placeholder="Ej : 02364XXXXXX"
                            value={formData.whatsapp}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    
                    {/* Campos del adulto responsable (Solo aparecen si es menor de 18 años) */}
                    {isAdultRequired && (
                        <>
                            <div className="separadores-formulario">
                                <label>Nombre del adulto responsable</label>
                                <input
                                    type="text"
                                    name="nombre_adulto"
                                    placeholder="Ej: Juan Gómez"
                                    value={formData.nombre_adulto}
                                    onChange={handleChange}
                                    required={isAdultRequired}
                                />
                            </div>

                            <div className="separadores-formulario">
                                <label>WhatsApp del adulto responsable</label>
                                <input
                                    type="number"
                                    name="whatsapp_adulto"
                                    placeholder="Ej: 02364XXXXXX"
                                    value={formData.whatsapp_adulto}
                                    onChange={handleChange}
                                    required={isAdultRequired}
                                />
                            </div>
                        </>
                    )}
                    <div className="separadores-formulario">
                        <label>Direccion</label>
                        <input
                            type="text"
                            name="calle"
                            placeholder="Ej: Av. Calle 123"
                            value={formData.calle}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="barrio"
                            placeholder="Barrio"
                            value={formData.barrio}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="ciudad"
                            placeholder="Ciudad"
                            value={formData.ciudad}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="estado_provincia"
                            placeholder="Estado / Provincia"
                            value={formData.estado_provincia}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="number"
                            name="codigo_postal"
                            placeholder="Código postal"
                            value={formData.codigo_postal}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="separadores-formulario">
                        <label>Correo electronico</label>
                        <input
                            type="email"
                            name="mail"
                            placeholder="Ej:example@gmail.com"
                            value={formData.mail}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="separadores-formulario">
                        <label>Ocupacion</label>
                        <select name="ocupacion" value={formData.ocupacion} onChange={handleChange} required>
                            <option value="">Seleccione una opción</option>
                            <option value="Trabajo">Trabajo</option>
                            <option value="Estudio">Estudio</option>
                            <option value="Ambas">Ambas</option>
                            <option value="Ninguna">Ninguna</option>
                        </select>
                    </div>

                    <div className="separadores-formulario">
                        <label>Horarios disponibles</label>
                        <textarea
                            name="horarios_disponibles"
                            placeholder="Describe tus horarios disponibles por ejemplo: 
                            8am a 10am o 1pm a 5pm"
                            value={formData.horarios_disponibles}
                            onChange={handleChange} required
                        ></textarea>
                    </div>

                    <div className="separadores-formulario">
                        <label>Nivel de estudio</label>
                        <select name="nivel_estudio" value={formData.nivel_estudio} onChange={handleChange} required>
                            <option value="">Seleccione un nivel</option>
                            <option value="Ninguno">Ninguno</option>
                            <option value="Básico">Básico</option>
                            <option value="Intermedio">Intermedio</option>
                            <option value="Avanzado">Avanzado</option>
                        </select>
                    </div>

                    <div className="separadores-formulario">
                    <label>Forma de pago</label>
                    <h4>Abonar en efectivo tiene bonificacion</h4>
                    <h4>Se debe dar en un sobre con nombre y apellido del estudiante, monton justo y se entrega a Gaby o Lucre</h4>
                        <select name="pago" value={formData.pago} onChange={handleChange} required>
                            <option value="">Seleccione un metodo de pago</option>
                            <option value="Transferencia/Billetera Virtual">Transferencia/Billetera Virtual</option>
                            <option value="Efectivo">Efectivo</option>
                            <option value="Otro Medio de pago">Otro medio de pago</option>
                            <option value="Acordar encuentros">Acordar encuentros</option>
                        </select>
                    </div>

                    <div className="separadores-formulario">
                        <label>Alguna afeccion medica de la que debamos tener conocimiento</label>
                        <textarea
                            name="afeccion"
                            placeholder="Si no posee ninguna no es necesario rellenar este campo"
                            value={formData.afeccion}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <input type="submit" value="Enviar formulario" className="enviar-btn" />
                </form>
            </div>
        </div>
    );
};

export default transition(Inscribe);

