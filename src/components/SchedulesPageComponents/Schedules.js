import React, { useEffect, useState } from "react";
import './Schedules.css';

const Schedules = () => {
    const [clases, setClases] = useState([]);
    const diasSemana = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"];

    useEffect(() => {
        fetch("http://localhost:3001/api/clases")
            .then(response => response.json())
            .then(data => setClases(data))
            .catch(error => console.error("Error al obtener las clases:", error));
    }, []);

    // Obtener los intervalos de tiempo únicos y ordenarlos
    const intervalosTiempo = Array.from(new Set(clases.map(c => `${c.hora_inicio} - ${c.hora_fin}`))).sort();

    // Función para obtener los niveles de clase según el día y el intervalo de tiempo
    const obtenerNivelClase = (dia, intervalo) => {
        const [horaInicio] = intervalo.split(" - ");
        
        // Filtrar clases que coincidan con el día y la hora
        const clasesPorDia = clases.filter(c => c.dia_nombre === dia && c.hora_inicio === horaInicio);
        
        if (clasesPorDia.length > 0) {
            // Obtener los niveles disponibles para ese horario
            const niveles = clasesPorDia.map(c => c.nivel_nombre).join(", ");
            return niveles;
        } else {
            return "-"; // Si no hay clases, mostrar "-"
        }
    };

    return (
        <div className="Horarios">
            <h3>Nuestros Horarios</h3>
            <div className="SeparadorTabla">
                <table className="TablaHorarios">
                    <thead>
                        <tr>
                            <th>Hora</th>
                            {diasSemana.map((dia, index) => (
                                <th key={index}>{dia}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {intervalosTiempo.map((intervalo, index) => (
                            <tr key={index}>
                                <td className="Horas">{intervalo}</td>
                                {diasSemana.map((dia, idx) => (
                                    <td className="niveles" key={idx}>
                                        {obtenerNivelClase(dia, intervalo)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Schedules;
