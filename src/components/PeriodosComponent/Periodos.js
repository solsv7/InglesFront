import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../NivelesPage/Niveles.css';

const Periodos = () => {
  const [periodos, setPeriodos] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [editandoNombre, setEditandoNombre] = useState('');

  const obtenerPeriodos = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/periodos`);
      setPeriodos(res.data);
    } catch (error) {
      console.error('Error al obtener periodos:', error);
    }
  };

  const crearPeriodo = async () => {
    if (!nuevoNombre) return;
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/periodos`, { nombre: nuevoNombre });
      setNuevoNombre('');
      obtenerPeriodos();
    } catch (error) {
      console.error('Error al crear periodo:', error);
    }
  };

  const editarPeriodo = async (id) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/periodos/${id}`, { nombre: editandoNombre });
      setEditandoId(null);
      setEditandoNombre('');
      obtenerPeriodos();
    } catch (error) {
      console.error('Error al editar periodo:', error);
    }
  };

  const eliminarPeriodo = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/periodos/${id}`);
      obtenerPeriodos();
    } catch (error) {
      console.error('Error al eliminar periodo:', error);
    }
  };

  useEffect(() => {
    obtenerPeriodos();
  }, []);

  return (
    <div className="ContenedorNiveles">
      <form className="FormularioNivel" onSubmit={(e) => { e.preventDefault(); crearPeriodo(); }}>
        <h2>Agregar Período</h2>
        <input
          type="text"
          placeholder="Nombre del período"
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
        />
        <button type="submit">Agregar</button>
      </form>

      <div className="ListaNiveles">
        <h3>Lista de Períodos</h3>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {periodos.map((periodo) => (
              <tr key={periodo.id_periodo}>
                <td>
                  {editandoId === periodo.id_periodo ? (
                    <input
                      type="text"
                      value={editandoNombre}
                      onChange={(e) => setEditandoNombre(e.target.value)}
                    />
                  ) : (
                    periodo.nombre
                  )}
                </td>
                <td>
                  {editandoId === periodo.id_periodo ? (
                    <>
                      <button onClick={() => editarPeriodo(periodo.id_periodo)}>Guardar</button>
                      <button onClick={() => setEditandoId(null)}>Cancelar</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => {
                        setEditandoId(periodo.id_periodo);
                        setEditandoNombre(periodo.nombre);
                      }}>
                        Editar
                      </button>
                      <button onClick={() => eliminarPeriodo(periodo.id_periodo)}>Eliminar</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {periodos.length === 0 && (
              <tr><td colSpan="2">No hay períodos registrados</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Periodos;
