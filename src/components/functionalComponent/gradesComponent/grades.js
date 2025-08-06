import React, { useState, useEffect } from 'react';
import transition from "../../../transition";
import axios from 'axios';
import './grade.css';

const GradesTable = () => {
    const [studentId, setStudentId] = useState(null);
    const [grades, setGrades] = useState([]);
    const [organizedGrades, setOrganizedGrades] = useState({});
    const [periods, setPeriods] = useState([]);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const currentYear = new Date().getFullYear().toString();
    const [selectedYear, setSelectedYear] = useState(currentYear);


    const years = ['2023', '2024', '2025', '2026']; // Lista de años (ciclo lectivo)

    useEffect(() => {
        // Obtener el ID del estudiante desde el localStorage
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const studentId = storedUser ? storedUser.id_alumno : null;

        if (studentId) {
            setStudentId(studentId);
        }
    }, []);

    // Obtener los periodos
    useEffect(() => {
        const fetchPeriods = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/periodos`);
                console.log('Se han solicitado los periodos');
                setPeriods(response.data);
            } catch (error) {
                console.error('Error al obtener los periodos:', error.response || error.message);
                setError('Hubo un error al obtener los periodos.');
            }
            
        };
        fetchPeriods();
    }, []);

    // Obtener las categorías
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/categories`);
                console.log('Se ha solicitado las categorias');
                setCategories(response.data);
            } catch (error) {
                console.error('Error al obtener las categorías:', error);
                setError('Hubo un error al obtener las categorías.');
            }
        };
        fetchCategories();
    }, []);

    // Obtener las calificaciones del estudiante para el ciclo lectivo seleccionado
    useEffect(() => {
  if (studentId && periods.length > 0 && categories.length > 0) {
    const fetchGrades = async () => {
      try {
        console.log('Se han solicitado las notas');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/grades/${studentId}/${selectedYear}`);
        console.log('Parámetros enviados:', { studentId, selectedYear });
        const fetchedGrades = response.data;

        if (fetchedGrades.length === 0) {
          setError('No se encontraron calificaciones para este estudiante en este ciclo lectivo.');
          setGrades([]);
          setOrganizedGrades({});
          return;
        }

        setError(null);
        setGrades(fetchedGrades);

        const gradesByPeriod = fetchedGrades.reduce((acc, grade) => {
          const { periodo, tipo_nota, nota } = grade;
          const periodName = periods.find(p => p.nombre === periodo);
          const categoryName = categories.find(c => c.nombre === tipo_nota);

          if (periodName && categoryName) {
            if (!acc[periodName.id_periodo]) {
              acc[periodName.id_periodo] = {};
            }
            acc[periodName.id_periodo][categoryName.nombre] = nota;
          }

          return acc;
        }, {});

        setOrganizedGrades(gradesByPeriod);

      } catch (error) {
        console.error('Error al obtener las calificaciones:', error);
        setError('Hubo un error al obtener las calificaciones.');
      }
    };

    fetchGrades();
  }
}, [studentId, selectedYear, periods, categories]);


    // Manejar el cambio del ciclo lectivo
    const handleYearChange = (event) => {
        setSelectedYear(event.target.value); // Actualizamos el ciclo lectivo seleccionado
    };

    return (
        <div className="table-container">
            <h2>Notas del Estudiante</h2>
            {error && <p className='mensajeError'>{error}</p>}

            {/* Selector de ciclo lectivo */}
            <div className='contenidoSelect'>
                <label htmlFor="yearSelect">Ciclo Lectivo:</label>
                <input
                    type="number"
                    id="yearSelect"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    min="2020"
                    max="2030"
                    />

            </div>
            {Object.keys(organizedGrades).length > 0 && (
                <div className="grades-vertical-table">
                    <div className="table-header">
                    <div className="header-cell category-cell"></div> {/* Ruptura esquina */}
                    {periods.map((p) => (
                        <div key={p.id_periodo} className="header-cell">
                        {p.nombre}
                        </div>
                    ))}
                    </div>
                    {categories.map((cat) => (
                    <div key={cat.id_tipo} className="table-row">
                        <div className="category-cell">{cat.nombre}</div>
                        {periods.map((p) => (
                        <div key={p.id_periodo} className="cell">
                            {organizedGrades[p.id_periodo]?.[cat.nombre] ?? '-'}
                        </div>
                        ))}
                    </div>
                    ))}
                </div>
                )}

        </div>
    );
};

export default transition(GradesTable);

