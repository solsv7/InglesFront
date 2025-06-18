// Niveles.jsx
import React, { useState, useEffect } from 'react';
import './Niveles.css';

const Niveles = () => {
  const [niveles, setNiveles] = useState([]);
  const [nombre, setNombre] = useState('');
  const [idioma, setIdioma] = useState('');
  const [editando, setEditando] = useState(null);

  const cargarNiveles = () => {
    fetch('http://localhost:3001/api/niveles')
      .then(res => res.json())
      .then(data => setNiveles(data))
      .catch(err => console.error('Error al obtener niveles:', err));
  };

  useEffect(() => {
    cargarNiveles();
  }, []);

  const agregarNivel = () => {
    if (!nombre || !idioma) return alert('Todos los campos son obligatorios');

    fetch('http://localhost:3001/api/niveles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, idioma })
    })
      .then(res => res.json())
      .then(() => {
        setNombre('');
        setIdioma('');
        cargarNiveles();
      });
  };

  const actualizarNivel = () => {
    if (!nombre || !idioma || !editando) return;

    fetch(`http://localhost:3001/api/niveles/${editando}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, idioma })
    })
      .then(res => res.json())
      .then(() => {
        setEditando(null);
        setNombre('');
        setIdioma('');
        cargarNiveles();
      });
  };

const eliminarNivel = (id_nivel) => {
  if (!window.confirm('¿Eliminar este nivel?')) return;

  fetch('http://localhost:3001/api/niveles/eliminar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id_nivel })
  })
    .then(res => res.json())
    .then(() => cargarNiveles())
    .catch(err => console.error('Error al eliminar nivel:', err));
};


  const seleccionarParaEditar = (nivel) => {
    setEditando(nivel.id_nivel);
    setNombre(nivel.nombre);
    setIdioma(nivel.idioma);
  };

  return (
    <div className="ContenedorNiveles">
      <section className="FormularioNivel">
        <h2>{editando ? 'Editar Nivel' : 'Agregar Nivel'}</h2>
        <input
          type="text"
          placeholder="Nombre del nivel"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="text"
          placeholder="Idioma"
          value={idioma}
          onChange={(e) => setIdioma(e.target.value)}
        />
        <button onClick={editando ? actualizarNivel : agregarNivel}>
          {editando ? 'Actualizar' : 'Agregar'}
        </button>
      </section>

      <section className="ListaNiveles">
        <h3>Niveles Registrados</h3>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Idioma</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {niveles.map(nivel => (
              <tr key={nivel.id_nivel}>
                <td>{nivel.nombre}</td>
                <td>{nivel.idioma}</td>
                <td>
                  <button onClick={() => seleccionarParaEditar(nivel)}>Editar</button>
                  <button onClick={() => eliminarNivel(nivel.id_nivel)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Niveles;