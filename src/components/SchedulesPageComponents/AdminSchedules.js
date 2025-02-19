import React, { useEffect, useState } from "react";
import './AdminSchedules.css';
import { FaEdit, FaTrashAlt, FaSave, FaPlus } from 'react-icons/fa';

const AdminSchedules = () => {
    const [horarios, setHorarios] = useState([]);
    const [niveles, setNiveles] = useState([]);
    const [editando, setEditando] = useState(null);
    const [nuevaClase, setNuevaClase] = useState({ dia: '', hora_inicio: '', hora_fin: '', id_nivel: '' });
    const diasSemana = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"];

    useEffect(() => {
        fetch("http://localhost:3001/api/clases")
            .then(response => response.json())
            .then(data => setHorarios(data))
            .catch(error => console.error("Error al obtener los horarios:", error));

        fetch("http://localhost:3001/api/niveles")
            .then(response => response.json())
            .then(data => setNiveles(data))
            .catch(error => console.error("Error al obtener los niveles:", error));
    }, []);

    const intervalosTiempo = Array.from(new Set(horarios.map(h => `${h.hora_inicio} - ${h.hora_fin}`))).sort();

    const obtenerClasesPorDiaYHora = (dia, intervalo) => {
        const [horaInicio] = intervalo.split(" - ");
        return horarios.filter(h => h.dia === dia && h.hora_inicio === horaInicio);
    };

    const obtenerNombreNivel = (idNivel) => {
        const nivel = niveles.find(n => n.id_nivel === idNivel);
        return nivel ? nivel.nombre : '';
    };

    const manejarEditar = (clase) => {
        setEditando({ ...clase });
    };

    const manejarEliminar = (claseId) => {
        fetch(`http://localhost:3001/api/clases/${claseId}`, {
            method: 'DELETE',
        })
        .then(() => {
            setHorarios(horarios.filter(h => h.id_clase !== claseId));
        })
        .catch(error => console.error("Error al eliminar la clase:", error));
    };

    const manejarGuardar = () => {
        fetch(`http://localhost:3001/api/clases/${editando.id_clase}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editando),
        })
        .then(response => response.json())
        .then(data => {
            setHorarios(horarios.map(h => h.id_clase === data.id_clase ? data : h));
            setEditando(null);
        })
        .catch(error => console.error("Error al guardar la clase:", error));
    };

    const manejarAgregar = () => {
        fetch("http://localhost:3001/api/clases", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nuevaClase),
        })
        .then(response => response.json())
        .then(data => {
            setHorarios([...horarios, data]);
            setNuevaClase({ dia: '', hora_inicio: '', hora_fin: '', id_nivel: '' });
        })
        .catch(error => console.error("Error al agregar la clase:", error));
    };

    return (
        <div className="Horarios">
            <h3>Gestion de Horarios</h3>
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
                                {diasSemana.map((dia, idx) => {
                                    const clases = obtenerClasesPorDiaYHora(dia, intervalo);
                                    return (
                                        <td key={idx} className="niveles">
                                            {clases.length > 0 ? (
                                                clases.map((clase) => (
                                                    <div key={clase.id_clase}>
                                                        {editando && editando.id_clase === clase.id_clase ? (
                                                            <div>
                                                                <select
                                                                    value={editando.id_nivel}
                                                                    onChange={(e) => setEditando({ ...editando, id_nivel: e.target.value })}
                                                                >
                                                                    {niveles.map((nivel) => (
                                                                        <option key={nivel.id_nivel} value={nivel.id_nivel}>
                                                                            {nivel.nombre}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                <button onClick={manejarGuardar}><FaSave /></button>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                {obtenerNombreNivel(clase.id_nivel)}
                                                                <FaEdit onClick={() => manejarEditar(clase)} />
                                                                <FaTrashAlt onClick={() => manejarEliminar(clase.id_clase)} />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <div>
                                                    <FaPlus onClick={() => setNuevaClase({ ...nuevaClase, dia, hora_inicio: intervalo.split(' - ')[0], hora_fin: intervalo.split(' - ')[1] })} />
                                                </div>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="AgregarClase">
                <h4>Agregar Nueva Clase</h4>
                <select value={nuevaClase.dia} onChange={(e) => setNuevaClase({ ...nuevaClase, dia: e.target.value })}>
                    <option value="">Selecciona un día</option>
                    {diasSemana.map((dia, index) => (
                        <option key={index} value={dia}>{dia}</option>
                    ))}
                </select>
                <input type="time" value={nuevaClase.hora_inicio} onChange={(e) => setNuevaClase({ ...nuevaClase, hora_inicio: e.target.value })} />
                <input type="time" value={nuevaClase.hora_fin} onChange={(e) => setNuevaClase({ ...nuevaClase, hora_fin: e.target.value })} />
                <select value={nuevaClase.id_nivel} onChange={(e) => setNuevaClase({ ...nuevaClase, id_nivel: e.target.value })}>
                    <option value="">Selecciona un nivel</option>
                    {niveles.map((nivel) => (
                        <option key={nivel.id_nivel} value={nivel.id_nivel}>{nivel.nombre}</option>
                    ))}
                </select>
                <button onClick={manejarAgregar}><FaPlus /> Agregar</button>
            </div>
        </div>
    );
};

export default AdminSchedules;
