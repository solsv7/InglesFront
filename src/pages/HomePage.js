import React from "react";
import { useNavigate } from "react-router-dom";
import gente1 from '../assets/Gente1.jpeg';
import gente2 from '../assets/Gente2.jpeg';
import gente3 from '../assets/Gente3.jpeg';
import b from '../assets/a.jpg';
import c from '../assets/b.jpg';
import a from '../assets/c.jpg';
import new1 from '../images/new (1).jpg';
import new2 from '../images/new (2).jpg';
import new3 from '../images/new (3).jpg';

import './styles/HomePage.css';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import transition from '../transition';

// Importar SweetAlert2
import Swal from 'sweetalert2';

const overlayText = [
  "Creando il futuro!",
  "Criando o futuro!",
  "Creating future!",
];

const HomePage = () => {
  const navigate = useNavigate();

  const handleInscripcionClick = () => {
    Swal.fire({
      title: 'Inscripción requerida',
      text: 'Si deseas inscribirte debes crear una cuenta y completar el formulario de inscripción',
      icon: '',
      showCancelButton: true,
      confirmButtonText: '¡Está bien!',
      cancelButtonText: 'No, gracias',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        // Navegar a la página de registro
        navigate('/Register');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
          'Puedes inscribirte en cualquier momento',
          'info' 
        );
      }
    });
  };

  return(
      <div className="contenido-home">
          <div className="home-lenguajes">
              <div className="texto-inicio">
                  <h1>Clases de varios idiomas</h1>
                  <p>En St. Thomas, contamos con clases de Inglés, Portugués y ahora Italiano!</p>
                  <p>Es una manera diferente de aprender idiomas</p>
                  {/* Agregar onClick al botón */}
                  <button onClick={handleInscripcionClick}>Inscribirme</button>
              </div>
              <div className="slid-inicio">
              <Swiper
                  modules={[Autoplay, Pagination]}
                  loop={true}
                  autoplay={{ delay: 3000 }}
                  >

                  {[new1,new2,new3].map((src, idx) => (
                  <SwiperSlide key={idx}>
                  <img src={src} alt={`slide-${idx}`} />
                  <div className="slide-overlay">{overlayText[idx]}</div>
                  </SwiperSlide>
              ))}
              </Swiper>
                  {/*<Slider images={[img1, img2, img3]} className="slider-lenguajes" />*/}
              </div>
          </div>
          <div className="formas-aprender">
              <div className="formas-titulo">
                  <div>
                  <h1>Nos adaptamos a tus necesidades</h1>
                  <button>Saber más</button>
                  </div>
                  <div>
                  
                  <p>En St. Thomas puedes optar el como puedes aprender, brindamos acceso a clases tanto de manera presencial como virtual o mixtas.</p>
                  </div>
              </div>
              <div className="cuadros">
                  <div className="presencial"> 
                      <div>
                          <h2>Presencial</h2>
                          <p id="sub-title">- Instituto St.Thomas</p>
                      </div>
                      <img src={a} alt=""></img>
                      <p id="Info-Clases">Tenemos una institucion donde puedes asistir de manera presencial acordando los horarios con nuestros profesores</p>  
                      <button className="contact-button">Contactarse</button>
                  </div>
                  <div className="mixto">
                      <div>
                          <h2>Mixta</h2>  
                          <p id="sub-title">- Instituto & Reuniones Virtuales</p>
                      </div> 
                      <img src={b} alt=""></img>
                      <p id="Info-Clases">Si se dificulta el poder asistir a clases, podemos concretar clases mixtas, alternando la virtualidad con la presencialidad</p>  
                      <button className="contact-button">Contactarse</button>
                  </div>
                  <div className="virtual"> 
                      <div>
                          <h2>Virtual</h2> 
                          <p id="sub-title">- Reuniones via Zoom/Meet</p>
                      </div>
                      <img src={c} alt=""></img>
                      <p id="Info-Clases">La distancia no es un problema. Tenemos opciones de brindar clases mediante la virtualidad</p>  
                      <button className="contact-button">Contactarse</button>
                  </div>
              </div>
          </div>
          <div className="contenedor-ubicacion">
              <div className="titulo-ubicacion">
                  <h1>Donde esta nuestra institucion?</h1>
                  <p>Está ubicada en Batilana 11, Junín, Provincia de Buenos Aires</p>
              </div>
              <div className="frame-ubicacion">
                  <iframe title="ubicacion" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.982241708955!2d-60.959887083531974!3d-34.57931588970195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b895b362444c09%3A0xa818af599dd5adc7!2s%22St%20Thomas%22%20Centro%20de%20Idiomas%3A%20Ingl%C3%A9s%20y%20Portugu%C3%A9s!5e0!3m2!1ses!2sar!4v1750291895745!5m2!1ses!2sar"  loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
              </div>
          </div>
          <div className="home-eventos">
              <div className="slid-eventos">
                  <Swiper
                      modules={[Autoplay, Pagination]}
                      loop={true}
                      autoplay={{ delay: 3000 }}
                      >

                      {[gente1, gente2, gente3].map((src, idx) => (
                      <SwiperSlide key={idx}>
                      <img src={src} alt={`slide-${idx}`} />
                      </SwiperSlide>
                  ))}
                  </Swiper>
                  {/*<Slider images={[gente1, gente2, gente3]} className="slider-eventos" />*/}
              </div>
              <div className="texto-eventos">
                  <h1>Nosotros tambien nos divertimos!</h1>
                  <p>Compartimos con nuestros estudiantes viajes al extranjero, donde podemos explorar y romper las del barreras idioma utilizando los conocimientos adquiridos!</p>
                  <p>Sumado a los viajes realizamos actividades o eventos con los cursos para buscar integrar de mejor manera al grupo, invitandolos a participar en distintas actividades como campamentos, recolecta de caramelos durante Halloween y más.</p>
                  {/* Agregar onClick al botón */}
                  <button onClick={handleInscripcionClick}>Inscribirme</button>
              </div>  
          </div>
      </div>
  )
}

export default transition(HomePage);