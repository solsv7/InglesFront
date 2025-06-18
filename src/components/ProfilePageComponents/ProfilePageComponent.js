import React, { useContext, useState } from 'react';
import { UserContext } from '../functionalComponent/UserContext/UserContext'; // Asegúrate de que tu contexto esté bien configurado.
import './ProfilePageComponent.css';
import edit from '../../images/iconos/lapiz.png';
import save from '../../images/iconos/disco.png';
import { img } from 'framer-motion/client';

const ProfilePageComponent = () => {
  const { userName, setUserName } = useContext(UserContext); // Obtener y actualizar el nombre de usuario desde el contexto.
  const [isEditing, setIsEditing] = useState(false); // Estado local para controlar si estamos editando o no.

  // Función para alternar entre modo de edición y vista previa.
  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  // Función que maneja los cambios en el input de nombre.
  const handleInputChange = (event) => {
    setUserName(event.target.value); // Actualiza el valor del nombre de usuario.
  };

  return (
    <div className="ContainerProfilePage">
      <div className="ContenidoProfilePage">
        <h1>Perfil de {userName}</h1>
        <div className="Option">
          <label>Nombre</label>
          <input
            type="text"
            value={userName}
            onChange={handleInputChange}
            readOnly={!isEditing} // Si no estamos editando, el campo es solo lectura.
            maxLength={20}
          />
          <button onClick={handleEditClick} className='BotonEdit'>
            {isEditing ? <img src={save} className='OptionIcon'/> : <img src={edit} className='OptionIcon'/>} {/* Cambia el texto según el estado de edición */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageComponent;

