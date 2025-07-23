import React from "react";
import img1 from '../assets/pizza.jpeg';
import img2 from '../assets/cristo.jpg';
import img3 from '../assets/puente.jpg';
import gente1 from '../assets/Gente1.jpeg';
import gente2 from '../assets/Gente2.jpeg';
import gente3 from '../assets/Gente3.jpeg';
import Slider from "../components/SliderInicio/SliderInicio";
import b from '../assets/a.jpg';
import c from '../assets/b.jpg';
import a from '../assets/c.jpg';
import './styles/HomePage.css';
import transition from '../transition';

const HomePage = () => {
    return(
        <div className="contenido-home">
            <div className="home-lenguajes">
                <div className="texto-inicio">
                    <h1>Clases de varios idiomas</h1>
                    <p>En St. Thomas, contamos con clases de Inglés, Portugués y ahora Italiano!</p>
                    <p>Es una manera diferente de aprender idiomas</p>
                    <button>Inscribirme</button>
                </div>
                <div className="slid-inicio">
                    <Slider images={[img1, img2, img3]} className="slider-lenguajes" />
                </div>
            </div>
            <div className="formas-aprender">
                <div className="formas-titulo">
                    <div>
                    <h1>Nos adaptamos a tus necesidades</h1>
                    <button>Saber más</button>
                    </div>
                    <div>
                    
                    <h3>En St. Thomas puedes optar el como puedes aprender, brindamos acceso a clases tanto de manera presencial como virtual o mixtas.</h3>
                    </div>
                </div>
                <div className="cuadros">
                    <div className="presencial"> 
                        <div>
                            <h2>Presencial</h2>
                            <p id="sub-title">- Instituto St.Thomas</p>
                        </div>
                        <img src={a} alt=""></img>
                        <p>Tenemos una institucion donde puedes asistir de manera presencial acordando los horarios con nuestros profesores</p>  
                        <button className="contact-button">Contactarse</button>
                    </div>
                    <div className="mixto">
                        <div>
                            <h2>Mixta</h2>  
                            <p id="sub-title">- Instituto & Reuniones Virtuales</p>
                        </div> 
                        <img src={b} alt=""></img>
                        <p>Si se dificulta el poder asistir a clases, podemos concretar clases mixtas, alternando la virtualidad con la presencialidad</p>  
                        <button className="contact-button">Contactarse</button>
                    </div>
                    <div className="virtual"> 
                        <div>
                            <h2>Virtual</h2> 
                            <p id="sub-title">- Reuniones via Zoom/Meet</p>
                        </div>
                        <img src={c} alt=""></img>
                        <p>La distancia no es un problema. Tenemos opciones de brindar clases mediante la virtualidad</p>  
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
                    <iframe title="ubicacion" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.982241708955!2d-60.959887083531974!3d-34.57931588970195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b895b362444c09%3A0xa818af599dd5adc7!2s%22St%20Thomas%22%20Centro%20de%20Idiomas%3A%20Ingl%C3%A9s%20y%20Portugu%C3%A9s!5e0!3m2!1ses!2sar!4v1750291895745!5m2!1ses!2sar"  loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                </div>
            </div>
            <div className="home-eventos">
                <div className="slid-eventos">
                    <Slider images={[gente1, gente2, gente3]} className="slider-eventos" />
                </div>
                <div className="texto-eventos">
                    <h1>Nosotros tambien nos divertimos!</h1>
                    <p>Compartimos con nuestros estudiantes viajes al extranjero, donde podemos explorar y romper las del barreras idioma utilizando los conocimientos adquiridos!</p>
                    <p>Sumado a los viajes realizamos actividades o eventos con los cursos para buscar integrar de mejor manera al grupo, invitandolos a participar en distintas actividades como campamentos, recolecta de caramelos durante Halloween, etc.</p>
                    <button>Inscribirme</button>
                </div>  
            </div>
        </div>
    )
}

export default transition(HomePage);