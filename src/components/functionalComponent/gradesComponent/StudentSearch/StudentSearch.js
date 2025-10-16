import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  FaSearch, 
  FaTrashAlt, 
  FaUser, 
  FaTimes, 
  FaUsers,
  FaSpinner,
  FaExclamationTriangle,
  FaInfoCircle
} from 'react-icons/fa';
import './StudentSearch.css';

const StudentSearch = ({ onSelectStudent }) => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Debounce para búsqueda
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/obtenerAlumnos`, {
          params: { option: 'existente' },
          timeout: 10000
        });
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
        setError('Error al cargar la lista de estudiantes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Búsqueda con debounce
  const handleSearch = useCallback(
    debounce((term) => {
      setIsSearching(term.length > 0);
      if (term === '') {
        setFilteredStudents([]);
      } else {
        const filtered = students.filter(student =>
          student.nombre.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredStudents(filtered);
      }
    }, 300),
    [students]
  );

  const handleInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    handleSearch(term);
  };

  const handleSelectStudent = (student) => {
    if (onSelectStudent) {
      onSelectStudent(student.id_alumno);
    }
    setSelectedStudent(student);
    setSearchTerm('');
    setFilteredStudents([]);
    setIsSearching(false);
  };

  const handleReset = () => {
    if (onSelectStudent) {
      onSelectStudent(null);
    }
    setSelectedStudent(null);
    setSearchTerm('');
    setFilteredStudents([]);
    setIsSearching(false);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setFilteredStudents([]);
    setIsSearching(false);
  };

  return (
    <div className="student-search-wrapper">
      <div className="student-search-header">
        <div className="header-icon">
          <FaUsers />
        </div>
        <h2 className="search-main-title">Buscador de Estudiantes</h2>
        <p className="search-subtitle">Encuentra y selecciona estudiantes del sistema</p>
      </div>

      <div className="student-search-content">
        {/* Búsqueda */}
        <div className="search-section">
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar estudiante por nombre..."
              value={searchTerm}
              onChange={handleInputChange}
              className="search-input"
              disabled={isLoading}
            />
            {searchTerm && (
              <button 
                className="clear-search-btn"
                onClick={clearSearch}
                title="Limpiar búsqueda"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        {/* Estado de carga */}
        {isLoading && (
          <div className="loading-state">
            <FaSpinner className="loading-spinner" />
            <p>Cargando lista de estudiantes...</p>
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <div className="error-state">
            <FaExclamationTriangle className="error-icon" />
            <div className="error-content">
              <h3>Error de carga</h3>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Estudiante seleccionado */}
        {selectedStudent && (
          <div className="selected-student-card">
            <div className="selected-header">
              <FaUser className="selected-icon" />
              <h3>Estudiante Seleccionado</h3>
              <button 
                onClick={handleReset}
                className="change-student-btn"
                title="Cambiar estudiante"
              >
                <FaTrashAlt />
              </button>
            </div>
            <div className="selected-content">
              <div className="student-avatar">
                <FaUser className="avatar-icon" />
              </div>
              <div className="student-details">
                <span className="student-name">{selectedStudent.nombre}</span>
                <span className="student-id">ID: {selectedStudent.id_alumno}</span>
              </div>
            </div>
          </div>
        )}

        {/* Resultados de búsqueda */}
        {!selectedStudent && isSearching && (
          <div className="results-section">
            <div className="results-header">
              <FaUsers className="results-icon" />
              <span className="results-count">
                {filteredStudents.length} estudiante{filteredStudents.length !== 1 ? 's' : ''} encontrado{filteredStudents.length !== 1 ? 's' : ''}
              </span>
            </div>

            {filteredStudents.length > 0 ? (
              <div className="students-list">
                {filteredStudents.map(student => (
                  <div key={student.id_alumno} className="student-card">
                    <div className="student-info">
                      <div className="student-avatar-small">
                        <FaUser className="avatar-icon" />
                      </div>
                      <div className="student-details">
                        <span className="student-name">{student.nombre}</span>
                        <span className="student-id">ID: {student.id_alumno}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSelectStudent(student)}
                      className="select-student-btn"
                    >
                      Seleccionar
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <FaSearch className="no-results-icon" />
                <h3>No se encontraron resultados</h3>
                <p>No hay estudiantes que coincidan con "{searchTerm}"</p>
              </div>
            )}
          </div>
        )}

        {/* Estado inicial - instrucciones */}
        {!selectedStudent && !isSearching && !isLoading && !error && (
          <div className="initial-state">
            <FaInfoCircle className="initial-icon" />
            <h3>Comienza a buscar</h3>
            <p>Escribe el nombre de un estudiante en el campo de búsqueda para empezar</p>
            {students.length > 0 && (
              <div className="total-students">
                <FaUsers className="total-icon" />
                <span>{students.length} estudiantes en el sistema</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentSearch;