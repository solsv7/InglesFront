import React,{useState} from "react";
import { Link } from "react-router-dom";
import './Register.css';
import axios from "axios";

const Register = () => {
    const [nombre, setNombre] = useState('');
    const [dni, setDni] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/api/auth/register', { dni, password, nombre });
        } catch (err) {
            setError('Error al registrarse');
            console.log(err);
        }
    };

    return(
        <div>
            <form className="formularioRegister" onSubmit={handleRegister}>
                <div className='ContentRegister'>
                <h2>Registrarse</h2>
                <label>Ingrese su Nombre</label>
                <input
                className='NameInput'
                    type="text"
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: Juan Perez"
                    required
                />
                <label>Ingrese su DNI</label>
                <input
                className='DniInput'
                    type="text"
                    onChange={(e) => setDni(e.target.value)}
                    placeholder="DNI"
                    required
                />
                <label>Ingrese una contraseña</label>
                <input
                className='PasswordInput'
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    required
                />
                {error && <div className="msgError">{error}</div>}
                <button type="submit" className='BTNRegister'>Registrar Usuario</button>
                </div>
            </form>
        </div>
    )
}
export default Register;