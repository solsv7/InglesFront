import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StudentSearch from '../functionalComponent/gradesComponent/StudentSearch/StudentSearch.js';
import './Inscripciones.css';

const Inscripciones = () => {
  const [clases, setClases] = useState([]);
  const [inscriptos, setInscriptos] = useState([]);
  const [claseSeleccionada, setClaseSeleccionada] = useState('');
  const [nuevoAlumno, setNuevoAlumno] = useState('');
  const [editandoAlumnoId, setEditandoAlumnoId] = useState(null);
  const [claseNueva, setClaseNueva] = useState('');

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/clases`)
      .then(res => setClases(res.data))
      .catch(err => console.error('Error al obtener clases:', err));
  }, []);

  useEffect(() => {
    if (claseSeleccionada) {
      axios.get(`${process.env.REACT_APP_API_URL}/api/clases-alumnos/por-clase/${claseSeleccionada}`)
        .then(res => setInscriptos(res.data))
        .catch(err => console.error('Error al obtener inscriptos:', err));
    } else {
      setInscriptos([]);
    }
  }, [claseSeleccionada]);

  const inscribirAlumno = () => {
    if (!nuevoAlumno || !claseSeleccionada) return;
    axios.post(`${process.env.REACT_APP_API_URL}/api/clases-alumnos`, {
      id_alumno: parseInt(nuevoAlumno),
      id_clase: parseInt(claseSeleccionada)
    })
      .then(() => {
        setNuevoAlumno('');
        setClaseNueva('');
        setTimeout(() => {
          axios.get(`${process.env.REACT_APP_API_URL}/api/clases-alumnos/por-clase/${claseSeleccionada}`)
            .then(res => setInscriptos(res.data));
        }, 300);
      })
      .catch(err => console.error('Error al inscribir:', err));
  };

  const cambiarAlumnoDeClase = (id_alumno) => {
    if (!claseNueva) return;
    axios.put(`${process.env.REACT_APP_API_URL}/api/clases-alumnos`, {
      id_alumno,
      id_clase_actual: parseInt(claseSeleccionada),
      id_clase_nueva: parseInt(claseNueva)
    })
      .then(() => {
        setClaseNueva('');
        setEditandoAlumnoId(null);
        axios.get(`${process.env.REACT_APP_API_URL}/api/clases-alumnos/por-clase/${claseSeleccionada}`)
          .then(res => setInscriptos(res.data));
      })
      .catch(err => console.error('Error al cambiar alumno:', err));
  };

  const eliminarInscripcion = (id_alumno) => {
    axios.delete(`${process.env.REACT_APP_API_URL}/api/clases-alumnos`, {
      data: { id_alumno, id_clase: parseInt(claseSeleccionada) }
    })
      .then(() => {
        setInscriptos(prev => prev.filter(a => a.id_alumno !== id_alumno));
      })
      .catch(err => console.error('Error al eliminar inscripción:', err));
  };

  return (
    <div className="ContenedorNiveles">
      <div className="FormularioNivel">
        <h2>Gestión de Inscripciones</h2>

        <label>Seleccionar Clase:</label>
        <select value={claseSeleccionada} onChange={(e) => setClaseSeleccionada(e.target.value)}>
          <option value="">-- Seleccionar --</option>
          {clases.map(clase => (
            <option key={clase.id_clase} value={clase.id_clase}>
              Clase {clase.id_clase} - {clase.nivel_nombre} ({clase.dia_nombre})
            </option>
          ))}
        </select>

        <StudentSearch onSelectStudent={(id) => setNuevoAlumno(id)} />

        <button onClick={inscribirAlumno}>Inscribir</button>
      </div>

      {claseSeleccionada && (
        <div className="ListaNiveles">
          <h3>Alumnos Inscriptos</h3>
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Cambiar a clase</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {inscriptos.map(alumno => (
                <tr key={alumno.id_alumno}>
                  <td>{alumno.nombre_alumno}</td>
                  <td>
                    {editandoAlumnoId === alumno.id_alumno && (
                      <select value={claseNueva} onChange={(e) => setClaseNueva(e.target.value)}>
                        <option value="">-- Clase nueva --</option>
                        {clases
                          .filter(c => c.id_clase !== parseInt(claseSeleccionada))
                          .map(c => (
                            <option key={c.id_clase} value={c.id_clase}>
                              Clase {c.id_clase} - {c.nivel_nombre} ({c.dia_nombre})
                            </option>
                          ))}
                      </select>
                    )}
                  </td>
                  <td>
                    {editandoAlumnoId === alumno.id_alumno ? (
                      <>
                        <button onClick={() => cambiarAlumnoDeClase(alumno.id_alumno)}>Guardar</button>
                        <button onClick={() => setEditandoAlumnoId(null)}>Cancelar</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => setEditandoAlumnoId(alumno.id_alumno)}>Editar</button>
                        <button onClick={() => eliminarInscripcion(alumno.id_alumno)}>Eliminar</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {inscriptos.length === 0 && (
                <tr>
                  <td colSpan="3">No hay alumnos inscriptos en esta clase</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Inscripciones;
