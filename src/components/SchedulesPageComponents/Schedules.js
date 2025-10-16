import React, { useEffect, useState } from "react";
import './Schedules.css';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';

const Schedules = () => {
    const [clases, setClases] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

    useEffect(() => {
        const fetchClases = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/clases`);
                const data = await response.json();
                setClases(data);
            } catch (error) {
                console.error("Error al obtener las clases:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClases();
    }, []);

    // Obtener los intervalos de tiempo únicos y ordenarlos
    const intervalosTiempo = Array.from(new Set(clases.map(c => `${c.hora_inicio} - ${c.hora_fin}`))).sort();

    // Función para obtener los niveles de clase según el día y el intervalo de tiempo
    const obtenerNivelClase = (dia, intervalo) => {
        const [horaInicio] = intervalo.split(" - ");
        
        const clasesPorDia = clases.filter(c => c.dia_nombre === dia && c.hora_inicio === horaInicio);
        
        if (clasesPorDia.length > 0) {
            const niveles = clasesPorDia.map(c => c.nivel_nombre).join(", ");
            return niveles;
        } else {
            return "-";
        }
    };

    if (isLoading) {
        return (
            <div className="schedules-loading">
                <div className="loading-spinner"></div>
                <p>Cargando horarios...</p>
            </div>
        );
    }

    return (
        <div className="schedules-container">
            <div className="schedules-header">
                <FaCalendarAlt className="header-icon" />
                <h2>Nuestros Horarios</h2>
                <p>Encuentra el horario que mejor se adapte a tus necesidades</p>
            </div>

            <div className="table-wrapper">
                <table className="schedules-table">
                    <thead>
                        <tr>
                            <th className="time-header">
                                <FaClock className="th-icon" />
                                Horario
                            </th>
                            {diasSemana.map((dia, index) => (
                                <th key={index} className="day-header">
                                    {dia}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {intervalosTiempo.length > 0 ? (
                            intervalosTiempo.map((intervalo, index) => (
                                <tr key={index} className="schedule-row">
                                    <td className="time-slot">{intervalo}</td>
                                    {diasSemana.map((dia, idx) => (
                                        <td 
                                            key={idx} 
                                            className={`level-cell ${obtenerNivelClase(dia, intervalo) !== '-' ? 'has-class' : 'no-class'}`}
                                        >
                                            {obtenerNivelClase(dia, intervalo)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="no-data">
                                    No hay horarios disponibles en este momento
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Vista móvil alternativa */}
            <div className="mobile-schedules">
                {intervalosTiempo.map((intervalo, index) => (
                    <div key={index} className="mobile-time-slot">
                        <div className="mobile-time">{intervalo}</div>
                        <div className="mobile-days">
                            {diasSemana.map((dia, idx) => {
                                const nivel = obtenerNivelClase(dia, intervalo);
                                return (
                                    <div key={idx} className="mobile-day">
                                        <span className="day-name">{dia.substring(0, 3)}</span>
                                        <span className={`day-level ${nivel !== '-' ? 'has-class' : 'no-class'}`}>
                                            {nivel}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Schedules;