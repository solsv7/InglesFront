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
    const [selectedYear, setSelectedYear] = useState('2024');  // Año seleccionado

    const years = ['2023', '2024', '2025']; // Lista de años (ciclo lectivo)

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
                const response = await axios.get('http://localhost:3001/api/periodos');
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
                const response = await axios.get('http://localhost:3001/api/categories');
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
        if (studentId) {
            const fetchGrades = async () => {
                try {
                    console.log('Se han solicitado las notas');
                    const response = await axios.get(`http://localhost:3001/api/grades/${studentId}/${selectedYear}`);
                    console.log('Parámetros enviados:', { studentId, selectedYear });
                    const fetchedGrades = response.data;

                    if (fetchedGrades.length === 0) {
                        setError('No se encontraron calificaciones para este estudiante en este ciclo lectivo.');
                        setGrades([]);
                        setOrganizedGrades({});
                        return;
                    }

                    setError(null); // Limpiar el error
                    setGrades(fetchedGrades);

                    // Organizar las calificaciones por periodo y categoría
                    const gradesByPeriod = fetchedGrades.reduce((acc, grade) => {
                        const { periodo, tipo_nota, nota } = grade;

                        // Asegurarse que el periodo y categoría sean los correctos.
                        const periodName = periods.find(p => p.nombre === periodo);
                        const categoryName = categories.find(c => c.nombre === tipo_nota);

                        // Si el período y categoría existen, añadir la nota al objeto organizado
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
            <label htmlFor="yearSelect">Seleccione el ciclo lectivo:</label>
            <select id="yearSelect" value={selectedYear} onChange={handleYearChange}>
                {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                ))}
            </select>
            </div>
            {Object.keys(organizedGrades).length > 0 && (
                <table className='Tabla-Notas'>
                    <thead>
                        <tr>
                            <th>Periodo</th>
                            {categories.map((category) => (
                                <th key={category.id_tipo}>{category.nombre}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {periods.map((periodo) => (
                            <tr key={periodo.id_periodo}>
                                <td className='Periodo'>{periodo.nombre}</td>
                                {categories.map((category) => (
                                    <td key={category.id_tipo} id='NotaNumero'>
                                        {organizedGrades[periodo.id_periodo]
                                            ? organizedGrades[periodo.id_periodo][category.nombre] || '-'
                                            : '-'}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default transition(GradesTable);

