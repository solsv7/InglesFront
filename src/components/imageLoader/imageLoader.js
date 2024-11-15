import React, { useState, useEffect } from 'react';
import Imagen1 from '../../images/imgsCarrousell/img1.png';
import Imagen2 from '../../images/imgsCarrousell/img2.png';
import Imagen3 from '../../images/imgsCarrousell/img3.png';
import Imagen4 from '../../images/imgsCarrousell/img4.png';
import Imagen5 from '../../images/imgsCarrousell/img5.png';
import Imagen6 from '../../images/imgsCarrousell/img6.png';
import Imagen7 from '../../images/logo.png';

// Lista de las imágenes
const images = [
  Imagen1, 
  Imagen2, 
  Imagen3, 
  Imagen4, 
  Imagen5, 
  Imagen6,
  Imagen7
];

const ImageLoader = () => {
  const [randomImage, setRandomImage] = useState('');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Seleccionar una imagen aleatoria al cargar el componente
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * images.length);
    setRandomImage(images[randomIndex]);

    // Actualizar el tamaño de la ventana en caso de cambio
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Estilos responsivos para Imagen7
  const responsiveStyles = windowWidth < 768 
    ? { height: '200px', padding: '10px' } 
    : { height: '400px', padding: '30px' };

  // Definir el estilo de la imagen
  const imageStyle = randomImage === Imagen7 
    ? responsiveStyles  // Estilo específico para Imagen7
    : { height: windowWidth < 768 ? '250px' : '460px' };  // Estilo para las demás imágenes

  return (
    <div>
      {randomImage && <img src={randomImage} alt="Imagen aleatoria" style={imageStyle} />}
    </div>
  );
}

export default ImageLoader;
