import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaComment, FaChevronDown, FaChevronUp, FaEdit } from 'react-icons/fa';
import { GoAlertFill } from "react-icons/go";

import './UploadGrade.css';

const UploadGrade = ({ selectedStudentId }) => {
  const [grades, setGrades] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [comments, setComments] = useState({});
  const [cycleYear, setCycleYear] = useState(new Date().getFullYear().toString());
  const [errorMsg, setErrorMsg] = useState('');
  const [expandedPeriod, setExpandedPeriod] = useState(null);

  useEffect(() => {
    const fetchPeriods = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/periodos`);
        setPeriods(response.data);
      } catch (error) {
        console.error('Error al obtener los periodos:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
      }
    };

    fetchPeriods();
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchExistingGrades = async () => {
      if (!selectedStudentId || !cycleYear || periods.length === 0 || categories.length === 0) {
        return;
      }

      const year = parseInt(cycleYear);
      if (year < 2020 || year > 2030) {
        setGrades([]);
        setErrorMsg('Por favor, ingrese un año entre 2020 y 2030.');
        return;
      }

      setErrorMsg('');

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/grades/${selectedStudentId}/${cycleYear}`
        );
        
        const gradesData = response.data || [];
        setGrades(gradesData);
        console.log('Notas obtenidas:', gradesData);

        // EXTRAER COMENTARIOS - FORMA CORRECTA
        const commentsMap = {};
        
        gradesData.forEach(grade => {
          // Si esta nota tiene comentario, asignarlo al periodo correspondiente
          if (grade.comentario_periodo && grade.periodo) {
            commentsMap[grade.periodo] = grade.comentario_periodo;
          }
        });

        setComments(commentsMap);

      } catch (error) {
        console.error('Error al obtener notas:', error);
        setGrades([]);
        setErrorMsg('No se pudieron obtener notas para este año.');
      }
    };

    fetchExistingGrades();
  }, [selectedStudentId, cycleYear, periods, categories]);

  const handleGradeChange = (periodo, tipoNota, value) => {
    const updatedGrades = [...grades];
    const gradeIndex = updatedGrades.findIndex(
      (grade) => grade.periodo === periodo && grade.tipo_nota === tipoNota
    );

    if (gradeIndex === -1) {
      updatedGrades.push({ 
        periodo, 
        tipo_nota: tipoNota, 
        nota: value
      });
    } else {
      updatedGrades[gradeIndex].nota = value;
    }

    setGrades(updatedGrades);
  };

  const handleCommentChange = (periodo, comment) => {
    setComments(prev => ({
      ...prev,
      [periodo]: comment
    }));
  };

  const handleReset = () => {
    setGrades([]);
    setComments({});
    setExpandedPeriod(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const notasAEnviar = [];
      
      periods.forEach(period => {
        const periodComment = comments[period.nombre];
        
        // ENVIAR COMENTARIO COMO UNA NOTA ESPECIAL
        if (periodComment && periodComment.trim() !== '') {
          notasAEnviar.push({
            idAlumno: selectedStudentId,
            idPeriodo: period.id_periodo,
            idTipoNota: null,
            nota: null,
            cicloLectivo: cycleYear,
            comentario: periodComment
          });
        }

        // ENVIAR NOTAS REGULARES
        categories.forEach(category => {
          const existingGrade = grades.find(
            g => g.periodo === period.nombre && g.tipo_nota === category.nombre
          );

          if (existingGrade && existingGrade.nota) {
            notasAEnviar.push({
              idAlumno: selectedStudentId,
              idPeriodo: period.id_periodo,
              idTipoNota: category.id_tipo,
              nota: parseFloat(existingGrade.nota),
              cicloLectivo: cycleYear,
              comentario: null
            });
          }
        });
      });

      await axios.post(`${process.env.REACT_APP_API_URL}/api/grades/subir`, {
        notas: notasAEnviar
      });

      alert('Notas y comentarios subidos exitosamente.');
    } catch (error) {
      console.error('Error al subir o actualizar las notas:', error);
      alert('Error al subir o actualizar las notas.');
    }
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

  return (
    <div className="upload-grade-container">
      <div className="cycle-year-selector">
        <label htmlFor="cycleYear" className='seleccionar'>Ciclo Lectivo</label>
        <input
          type="number"
          id="cycleYear"
          min="2020"
          max="2030"
          value={cycleYear}
          onChange={(e) => setCycleYear(e.target.value)}
        />
      </div>

      {errorMsg && (
        <div className="error-msg">
          <GoAlertFill className="error-icon" />
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="upload-grade">
        <div className="period-controls">
          <button type="button" onClick={expandAll} className="control-btn expand-all">
            <FaChevronDown /> Expandir Todos
          </button>
          <button type="button" onClick={collapseAll} className="control-btn collapse-all">
            <FaChevronUp /> Colapsar Todos
          </button>
        </div>

        <div className="periods-accordion">
          {periods.map((period) => (
            <div key={period.id_periodo} className="period-card">
              <div 
                className="period-card-header"
                onClick={() => togglePeriod(period.nombre)}
              >
                <div className="period-header-content">
                  <FaEdit className="period-icon" />
                  <span className="period-title">{period.nombre}</span>
                  <div className="period-stats">
                    <span className="grades-count">
                      {categories.filter(cat => 
                        grades.find(g => g.periodo === period.nombre && g.tipo_nota === cat.nombre && g.nota)
                      ).length}/{categories.length} notas
                    </span>
                    {comments[period.nombre] && (
                      <FaComment className="has-comment-icon" title="Tiene comentarios" />
                    )}
                  </div>
                </div>
                {expandedPeriod === period.nombre ? (
                  <FaChevronUp className="expand-icon" />
                ) : (
                  <FaChevronDown className="expand-icon" />
                )}
              </div>

              {expandedPeriod === period.nombre && (
                <div className="period-card-content">
                  <div className="grades-section">
                    <h4 className="section-title">
                      <FaEdit />
                      Calificaciones
                    </h4>
                    <div className="grades-grid">
                      {categories.map((category) => {
                        const existingGrade = grades.find(
                          (g) => g.periodo === period.nombre && g.tipo_nota === category.nombre
                        );

                        return (
                          <div key={category.id_tipo} className="grade-item">
                            <label className="category-label">{category.nombre}</label>
                            <input
                              type="number"
                              step="0.5"
                              min="0"
                              max="10"
                              value={existingGrade ? existingGrade.nota : ''}
                              onChange={(e) =>
                                handleGradeChange(period.nombre, category.nombre, e.target.value)
                              }
                              className="grade-input"
                              placeholder="0.0 - 10.0"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="comments-section">
                    <div className="comment-header">
                      <FaComment className="comment-icon" />
                      <span>Comentarios y Observaciones</span>
                    </div>
                    <textarea
                      value={comments[period.nombre] || ''}
                      onChange={(e) => handleCommentChange(period.nombre, e.target.value)}
                      className="comment-textarea"
                      placeholder="Agregar comentarios sobre el desempeño, fortalezas, áreas de oportunidad, etc..."
                      rows="4"
                    />
                    <div className="comment-hint">
                      Los comentarios se guardarán automáticamente cuando confirmes las notas
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="botonesGrades">
          <button type="submit" className="BotonSubir">
            <FaEdit /> Confirmar Todas las Notas y Comentarios
          </button>
          <button type="button" onClick={handleReset} className="BotonReset">
            <FaTrash /> Limpiar Todo
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadGrade;