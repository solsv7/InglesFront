import React, { useState, useEffect } from 'react';
import transition from "../../../transition";
import axios from 'axios';
import { 
  FaGraduationCap, 
  FaCalendarAlt, 
  FaComment, 
  FaChartLine,
  FaUserGraduate,
  FaExpand,
  FaCompress
} from 'react-icons/fa';
import './grade.css';

const GradesTable = () => {
    const [studentId, setStudentId] = useState(null);
    const [grades, setGrades] = useState([]);
    const [organizedGrades, setOrganizedGrades] = useState({});
    const [periodComments, setPeriodComments] = useState({});
    const [periods, setPeriods] = useState([]);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const currentYear = new Date().getFullYear().toString();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [expandedPeriod, setExpandedPeriod] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const studentId = storedUser ? storedUser.id_alumno : null;

        if (studentId) {
            setStudentId(studentId);
        }
    }, []);

    useEffect(() => {
        const fetchPeriods = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/periodos`);
                setPeriods(response.data);
            } catch (error) {
                console.error('Error al obtener los periodos:', error.response || error.message);
                setError('Hubo un error al obtener los periodos.');
            }
        };
        fetchPeriods();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/categories`);
                setCategories(response.data);
            } catch (error) {
                console.error('Error al obtener las categorías:', error);
                setError('Hubo un error al obtener las categorías.');
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (studentId && periods.length > 0 && categories.length > 0) {
            const fetchGrades = async () => {
                setIsLoading(true);
                try {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/grades/${studentId}/${selectedYear}`);
                    const fetchedGrades = response.data;

                    if (fetchedGrades.length === 0) {
                        setError('No se encontraron calificaciones para este estudiante en este ciclo lectivo.');
                        setGrades([]);
                        setOrganizedGrades({});
                        setPeriodComments({});
                        return;
                    }

                    setError(null);
                    setGrades(fetchedGrades);

                    // Organizar calificaciones por período
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

                    // Extraer comentarios de los períodos
                    const commentsMap = {};
                    fetchedGrades.forEach(grade => {
                        if (grade.comentario_periodo && grade.periodo) {
                            commentsMap[grade.periodo] = grade.comentario_periodo;
                        }
                    });

                    setOrganizedGrades(gradesByPeriod);
                    setPeriodComments(commentsMap);

                } catch (error) {
                    console.error('Error al obtener las calificaciones:', error);
                    setError('Hubo un error al obtener las calificaciones.');
                } finally {
                    setIsLoading(false);
                }
            };

            fetchGrades();
        }
    }, [studentId, selectedYear, periods, categories]);

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    const togglePeriod = (periodName) => {
        setExpandedPeriod(expandedPeriod === periodName ? null : periodName);
    };

    const expandAll = () => {
        setExpandedPeriod(periods.map(p => p.nombre));
    };

    const collapseAll = () => {
        setExpandedPeriod(null);
    };

    const getGradeColor = (grade) => {
        if (!grade || grade === '-') return 'default';
        const numericGrade = parseFloat(grade);
        if (numericGrade >= 8) return 'high';
        if (numericGrade >= 6) return 'medium';
        return 'low';
    };

    return (
        <div className="grades-page-wrapper">
            <div className="grades-container">
                <div className="grades-page-header">
                    <div className="grades-header-icon">
                        <FaGraduationCap />
                    </div>
                    <h1 className="grades-main-title">Mis Notas</h1>
                    <p className="grades-subtitle">
                        Consulta tus notas y comentarios por período académico
                    </p>
                </div>

                <div className="grades-main-content">
                    <div className="grades-controls-card">
                        <div className="grades-year-section">
                            <label className="grades-year-label">
                                <FaCalendarAlt className="label-icon" />
                                Ciclo Lectivo
                            </label>
                            <div className="grades-input-wrapper">
                                <input
                                    type="number"
                                    value={selectedYear}
                                    onChange={handleYearChange}
                                    min="2020"
                                    max="2030"
                                    className="grades-year-input"
                                />
                            </div>
                        </div>

                        <div className="grades-controls-buttons">
                            <button 
                                onClick={expandAll}
                                className="control-btn expand-btn"
                            >
                                <FaExpand className="btn-icon" />
                                Expandir Todos
                            </button>
                            <button 
                                onClick={collapseAll}
                                className="control-btn collapse-btn"
                            >
                                <FaCompress className="btn-icon" />
                                Colapsar Todos
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="grades-error-message">
                            <div className="error-icon">⚠️</div>
                            <div className="error-content">
                                <h3>No se encontraron calificaciones</h3>
                                <p>{error}</p>
                            </div>
                        </div>
                    )}

                    {isLoading ? (
                        <div className="grades-loading-state">
                            <div className="loading-spinner"></div>
                            <p>Cargando calificaciones...</p>
                        </div>
                    ) : Object.keys(organizedGrades).length > 0 && (
                        <div className="grades-accordion">
                            {periods.map((period) => (
                                <div key={period.id_periodo} className="period-grade-card">
                                    <div 
                                        className="period-grade-header"
                                        onClick={() => togglePeriod(period.nombre)}
                                    >
                                        <div className="period-grade-info">
                                            <FaChartLine className="period-icon" />
                                            <div className="period-details">
                                                <h3 className="period-name">{period.nombre}</h3>
                                                <div className="period-stats">
                                                    <span className="grades-count">
                                                        {categories.filter(cat => 
                                                            organizedGrades[period.id_periodo]?.[cat.nombre] && 
                                                            organizedGrades[period.id_periodo]?.[cat.nombre] !== '-'
                                                        ).length} de {categories.length} calificaciones
                                                    </span>
                                                    {periodComments[period.nombre] && (
                                                        <FaComment className="comment-indicator" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="period-toggle">
                                            {expandedPeriod === period.nombre ? '▲' : '▼'}
                                        </div>
                                    </div>

                                    {expandedPeriod === period.nombre && (
                                        <div className="period-grade-content">
                                            {/* Tabla de calificaciones */}
                                            <div className="grades-table-section">
                                                <h4 className="section-title">
                                                    <FaGraduationCap className="section-icon" />
                                                    Calificaciones
                                                </h4>
                                                <div className="grades-table">
                                                    <div className="grades-table-header">
                                                        <div className="grade-category-header">Categoría</div>
                                                        <div className="grade-value-header">Calificación</div>
                                                    </div>
                                                    {categories.map((category) => (
                                                        <div key={category.id_tipo} className="grade-row">
                                                            <div className="grade-category">
                                                                {category.nombre}
                                                            </div>
                                                            <div 
                                                                className={`grade-value grade-${getGradeColor(organizedGrades[period.id_periodo]?.[category.nombre])}`}
                                                            >
                                                                {organizedGrades[period.id_periodo]?.[category.nombre] ?? '-'}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Comentarios del período */}
                                            {periodComments[period.nombre] && (
                                                <div className="comments-section">
                                                    <div className="comments-header">
                                                        <FaComment className="comments-icon" />
                                                        <h4>Comentarios del Período</h4>
                                                    </div>
                                                    <div className="comments-content">
                                                        <p>{periodComments[period.nombre]}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {!periodComments[period.nombre] && (
                                                <div className="no-comments-section">
                                                    <FaComment className="no-comments-icon" />
                                                    <p>No hay comentarios para este período</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default transition(GradesTable);