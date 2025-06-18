import React, {useState} from "react";
import transition from '../../../transition';
import CrearUsuarioNuevo from "./StudentRegister";
import UserRegistration from "./TeacherRegister";
import './UserCreatePage.css';

const UsersCreation = () => {
    const [target, setTarget] = useState("");

    const handleTargetChange = (event) => {
        setTarget(event.target.value);
    };
    return (
        <div className="user-creation">
            <h2>Crear Nuevo Usuario</h2>
            <form>
                <div>
                    <div className="Select-crear">
                    <select value={target} onChange={handleTargetChange} className="OpcionSelect">
                        <option value="">Seleccione que quiere crear</option>
                        <option value="alumno">Nuevo alumno</option>
                        <option value="profesor">Nuevo profesor</option>
                    </select>
                    </div>
                     {/* Mostrar opciones condicionalmente */}
                {target === "profesor" && (
                    <div>
                         <UserRegistration/>
                    </div>
                )}
                {/* Mostrar opciones condicionalmente */}
                {target === "alumno" && (
                    <div>
                         <CrearUsuarioNuevo />
                    </div>
                )}
                </div>
            </form>
        </div>
    );
}
export default transition(UsersCreation);