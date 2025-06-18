import React, { useEffect, useState } from "react";
import './AdminSchedules.css';
import { FaEdit, FaSave, FaPlus, FaTrashAlt } from 'react-icons/fa';

const diasSemana = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"];

const AgregarClase = ({ niveles, cargarHorarios }) => {
  const [nuevoNivel, setNuevoNivel] = useState("");
  const [idDia, setIdDia] = useState(1);
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");

  const agregarClase = () => {
    if (!nuevoNivel || !idDia || !horaInicio || !horaFin) {
      alert("Todos los campos son obligatorios");
      return;
    }

    fetch("http://localhost:3001/api/clases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_nivel: nuevoNivel,
        id_dia: idDia,
        hora_inicio: horaInicio,
        hora_fin: horaFin
      })
    })
      .then(response => response.json())
      .then(() => {
        cargarHorarios();
        setNuevoNivel("");
        setIdDia(1);
        setHoraInicio("");
        setHoraFin("");
      })
      .catch(error => console.error("Error al agregar la clase:", error));
  };

  return (
    <div className="AgregarClase">
      <h3>Agregar Nueva Clase</h3>
      <select value={nuevoNivel} onChange={(e) => setNuevoNivel(e.target.value)}>
        <option value="">Selecciona un nivel</option>
        {niveles.map(nivel => (
          <option key={nivel.id_nivel} value={nivel.id_nivel}>{nivel.nombre}</option>
        ))}
      </select>
      <select value={idDia} onChange={(e) => setIdDia(e.target.value)}>
        {diasSemana.map((dia, index) => (
          <option key={index} value={index + 1}>{dia}</option>
        ))}
      </select>
      <input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />
      <input type="time" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} />
      <button onClick={agregarClase}><FaPlus /> Agregar Clase</button>
    </div>
  );
};

const EditarClase = ({ horarios, niveles, cargarHorarios }) => {
  const [editandoCelda, setEditandoCelda] = useState(null);
  const [nuevoNivel, setNuevoNivel] = useState("");
  const [nuevoInicio, setNuevoInicio] = useState("");
  const [nuevoFin, setNuevoFin] = useState("");

  const intervalosTiempo = Array.from(
    new Set(horarios.map(c => `${c.hora_inicio} - ${c.hora_fin}`))
  ).sort();

  const obtenerClase = (dia, intervalo) => {
    const [horaInicio] = intervalo.split(" - ");
    return horarios.find(c => c.dia_nombre === dia && c.hora_inicio === horaInicio);
  };

  const manejarEditarCelda = (dia, intervalo) => {
    const clase = obtenerClase(dia, intervalo);
    if (clase) {
      setEditandoCelda({
        dia,
        intervalo,
        id_clase: clase.id_clase,
        id_dia: clase.id_dia,
      });
      setNuevoNivel(clase.id_nivel);
      setNuevoInicio(clase.hora_inicio);
      setNuevoFin(clase.hora_fin);
    }
  };

  const manejarGuardarEdicion = () => {
    if (!editandoCelda || !nuevoNivel || !nuevoInicio || !nuevoFin) return;

    fetch("http://localhost:3001/api/clases", {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_clase: editandoCelda.id_clase,
        id_dia: editandoCelda.id_dia,
        id_nivel: nuevoNivel,
        hora_inicio: nuevoInicio,
        hora_fin: nuevoFin
      }),
    })
      .then(response => response.json())
      .then(() => {
        setEditandoCelda(null);
        setNuevoNivel("");
        setNuevoInicio("");
        setNuevoFin("");
        cargarHorarios();
      })
      .catch(error => console.error("Error al actualizar la clase:", error));
  };

  const eliminarClase = (id_clase) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta clase?")) {
      fetch("http://localhost:3001/api/clases/eliminar", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_clase }),
      })
        .then(response => response.json())
        .then(() => cargarHorarios())
        .catch(error => console.error("Error al eliminar la clase:", error));
    }
  };

  return (
    <div className="TablaHorarios">
      <h3>Clases Registradas</h3>
      <table>
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
              <td>{intervalo}</td>
              {diasSemana.map((dia, idx) => {
                const clase = obtenerClase(dia, intervalo);
                return (
                  <td key={idx}>
                    {editandoCelda && editandoCelda.dia === dia && editandoCelda.intervalo === intervalo ? (
                      <>
                        <select value={nuevoNivel} onChange={(e) => setNuevoNivel(e.target.value)}>
                          <option value="">Nivel</option>
                          {niveles.map(n => (
                            <option key={n.id_nivel} value={n.id_nivel}>{n.nombre}</option>
                          ))}
                        </select>
                        <input type="time" value={nuevoInicio} onChange={(e) => setNuevoInicio(e.target.value)} />
                        <input type="time" value={nuevoFin} onChange={(e) => setNuevoFin(e.target.value)} />
                        <button onClick={manejarGuardarEdicion}><FaSave /></button>
                      </>
                    ) : (
                      <>
                        {clase ? clase.nivel_nombre : "-"}
                        {clase && (
                          <>
                            <FaEdit onClick={() => manejarEditarCelda(dia, intervalo)} style={{ marginLeft: 8, cursor: 'pointer' }} />
                            <FaTrashAlt onClick={() => eliminarClase(clase.id_clase)} style={{ marginLeft: 8, cursor: 'pointer' }} />
                          </>
                        )}
                      </>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AdminSchedules = () => {
  const [horarios, setHorarios] = useState([]);
  const [niveles, setNiveles] = useState([]);

  const cargarHorarios = () => {
    fetch("http://localhost:3001/api/clases")
      .then(response => response.json())
      .then(data => setHorarios(data))
      .catch(error => console.error("Error al obtener los horarios:", error));
  };

  useEffect(() => {
    cargarHorarios();
    fetch("http://localhost:3001/api/niveles")
      .then(response => response.json())
      .then(data => setNiveles(data))
      .catch(error => console.error("Error al obtener los niveles:", error));
  }, []);

  return (
    <div className="Horarios">
      <AgregarClase niveles={niveles} cargarHorarios={cargarHorarios} />
      <EditarClase horarios={horarios} niveles={niveles} cargarHorarios={cargarHorarios} />
    </div>
  );
};

export default AdminSchedules;
