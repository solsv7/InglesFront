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
            <div className="schedules-page-loading">
                <div className="schedules-loading-spinner"></div>
                <p>Cargando horarios...</p>
            </div>
        );
    }

    return (
        <div className="schedules-page">
            <div className="schedules-page-header">
                <FaCalendarAlt className="schedules-header-icon" />
                <h2>Nuestros Horarios</h2>
                <p>Encuentra el horario que mejor se adapte a tus necesidades</p>
            </div>

            <div className="schedules-table-wrapper">
                <table className="schedules-page-table">
                    <thead>
                        <tr>
                            <th className="schedules-time-header">
                                <FaClock className="schedules-th-icon" />
                                Horario
                            </th>
                            {diasSemana.map((dia, index) => (
                                <th key={index} className="schedules-day-header">
                                    {dia}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {intervalosTiempo.length > 0 ? (
                            intervalosTiempo.map((intervalo, index) => (
                                <tr key={index} className="schedules-page-row">
                                    <td className="schedules-time-slot">{intervalo}</td>
                                    {diasSemana.map((dia, idx) => (
                                        <td 
                                            key={idx} 
                                            className={`schedules-level-cell ${obtenerNivelClase(dia, intervalo) !== '-' ? 'schedules-has-class' : 'schedules-no-class'}`}
                                        >
                                            {obtenerNivelClase(dia, intervalo)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="schedules-no-data">
                                    No hay horarios disponibles en este momento
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Vista móvil alternativa */}
            <div className="schedules-mobile-view">
                {intervalosTiempo.map((intervalo, index) => (
                    <div key={index} className="schedules-mobile-time-slot">
                        <div className="schedules-mobile-time">{intervalo}</div>
                        <div className="schedules-mobile-days">
                            {diasSemana.map((dia, idx) => {
                                const nivel = obtenerNivelClase(dia, intervalo);
                                return (
                                    <div key={idx} className="schedules-mobile-day">
                                        <span className="schedules-day-name">{dia.substring(0, 3)}</span>
                                        <span className={`schedules-day-level ${nivel !== '-' ? 'schedules-has-class' : 'schedules-no-class'}`}>
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