import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StudentSearch.css';


const StudentSearch = ({ onSelectStudent }) => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null); // Para guardar el alumno seleccionado
  const option = "";


  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/obtenerAlumnos',{
          params:{option:"existente"}
        }
        );
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
    if (term === ''){
      setFilteredStudents(['']); 
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

  return (
    <div className="content-StudentSearch">
      <input
        type="text"
        placeholder="Buscar alumno por nombre"
        value={searchTerm}
        onChange={handleSearch}
        className="Input-Buscar"
      />
      <p className='Mensaje-Seleccionado'>Alumno Seleccionado</p>
      <h3 onClick={() => setSelectedStudent(null)} className='erase-button'>↻ Borrar</h3>
      {selectedStudent ? (
        <div className='a'>
          <p className='Mensaje-Seleccionado2'>{selectedStudent}</p>
        </div>
      ) : (
        filteredStudents.length > 0 && (
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
        )
      )}
    </div>
  );
};

export default StudentSearch;

