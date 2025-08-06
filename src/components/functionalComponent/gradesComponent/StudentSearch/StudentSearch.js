import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaTrashAlt } from 'react-icons/fa';
import './StudentSearch.css';

const StudentSearch = ({ onSelectStudent }) => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/obtenerAlumnos`, {
          params: { option: 'existente' }
        });
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (term === '') {
      setFilteredStudents([]);
    } else {
      setFilteredStudents(
        students.filter(student =>
          student.nombre.toLowerCase().includes(term)
        )
      );
    }
  };

  const handleSelectStudent = (id, name) => {
    onSelectStudent(id);
    setSelectedStudent(name);
    setSearchTerm('');
    setFilteredStudents([]);
  };

  const handleReset = () => {
    onSelectStudent(null);
    setSelectedStudent(null);
  };

  return (
    <div className="content-StudentSearch">
      <h2 className="buscador-titulo">Buscador de Alumnos <FaSearch /></h2>

      <input
        type="text"
        placeholder="Buscar alumno por nombre"
        value={searchTerm}
        onChange={handleSearch}
        className="Input-Buscar"
      />

      {selectedStudent && (
        <div className="seleccionado-box">
          <p className="Mensaje-Seleccionado2">{selectedStudent}</p>
        </div>
      )}

      <button
        className={`boton-borrar ${selectedStudent ? 'activo' : 'inactivo'}`}
        onClick={handleReset}
        disabled={!selectedStudent}
      >
        <FaTrashAlt /> Borrar
      </button>


      {!selectedStudent && filteredStudents.length > 0 && (
        <ul className="lista-Estudiantes">
          {filteredStudents.map(student => (
            <li key={student.id_alumno} className="student-item">
              {student.nombre}
              <button
                onClick={() => handleSelectStudent(student.id_alumno, student.nombre)}
                className="select-button"
              >
                Seleccionar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentSearch;
