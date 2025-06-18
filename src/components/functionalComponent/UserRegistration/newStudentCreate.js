import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BuscadorAlumnos = ({}) => {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null); // Para guardar el alumno seleccionado
    const user = JSON.parse(localStorage.getItem('user'));
    const option = "";
    useEffect(() => {
      const fetchStudents = async () => {
        try {
          const response = await axios.get('http://localhost:3001/api/obtenerAlumnos',{
            params:{option:"nuevo"}
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
        setFilteredStudents(['']); // Si el campo está vacío, no mostrar nada
      } else {
        setFilteredStudents(
          students.filter(student =>
            student.nombre.toLowerCase().includes(term)
          )
        );
      }
    };
    const resetSelectStudent = () => {
      setSelectedStudent('');
    }
    const handleSelectStudent = (id, name) => {
      onSelectStudent(id); // Llamar la función pasada por props
      setSelectedStudent(name); // Mostrar el nombre del alumno seleccionado
      setSearchTerm(''); // Limpiar el campo de búsqueda
      setFilteredStudents([]); // Limpiar la lista de resultados
    };
  
    return (
      <div className="content-StudentSearch">
        <h2>Alumnos por aprobar formulario</h2>
        <input
          type="text"
          placeholder="Buscar alumno por nombre"
          value={searchTerm}
          onChange={handleSearch}
          className="Input-Buscar"
        />
        {/* Si hay un alumno seleccionado, mostrarlo */}
        {selectedStudent ? (
          <div className='a'>
            <p className='Mensaje-Seleccionado2'>{selectedStudent}</p>
          </div>
        ) : (
          // Mostrar la lista de resultados solo si hay resultados
          filteredStudents.length > 0 && (
            <ul className="lista-Estudiantes">
              {filteredStudents.map(student => (
                <li key={student.id_alumno} className="student-item">
                  {student.nombre}
                  <button
                    onClick={() => handleSelectStudent(student.id_alumno, student.nombre)}
                    className="select-button"
                  >
                    Permitir
                  </button>
                </li>
              ))}
            </ul>
          )
        )}
      </div>
    );
  };
  
  export default BuscadorAlumnos;
  