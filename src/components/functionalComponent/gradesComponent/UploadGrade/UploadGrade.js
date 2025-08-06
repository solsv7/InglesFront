import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';
import { GoAlertFill } from "react-icons/go";

import './UploadGrade.css';

const UploadGrade = ({ selectedStudentId }) => {
  const [grades, setGrades] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const [cycleYear, setCycleYear] = useState(new Date().getFullYear().toString());
  const [errorMsg, setErrorMsg] = useState('');

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
    if (
      !selectedStudentId ||
      !cycleYear ||
      periods.length === 0 ||
      categories.length === 0
    ) {
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
      console.log('Consultando notas con:', selectedStudentId, cycleYear);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/grades/${selectedStudentId}/${cycleYear}`
      );
      setGrades(response.data);
    } catch (error) {
      console.error('Error al obtener notas:', error.response?.data || error.message);
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
      updatedGrades.push({ periodo, tipo_nota: tipoNota, nota: value });
    } else {
      updatedGrades[gradeIndex].nota = value;
    }

    setGrades(updatedGrades);
  };

  const handleReset = () => {
    setGrades([]);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

    try {
      const notasAEnviar = grades.filter((grade) => grade.nota);
      await axios.post(`${process.env.REACT_APP_API_URL}/api/grades/subir`, {
        notas: notasAEnviar.map((grade) => ({
          idAlumno: selectedStudentId,
          idPeriodo: periods.find((period) => period.nombre === grade.periodo)?.id_periodo,
          idTipoNota: categories.find((category) => category.nombre === grade.tipo_nota)?.id_tipo,
          nota: parseFloat(grade.nota),
          cicloLectivo: cycleYear, // <--- ✅ cambio acá
        })),
      });

      alert('Notas subidas o actualizadas exitosamente.');
    } catch (error) {
      console.error('Error al subir o actualizar las notas:', error);
      alert('Error al subir o actualizar las notas.');
    }
  };



  return (
    <div className="upload-grade-container">
      <div className="cycle-year-selector">
        <label htmlFor="cycleYear" className='seleccionar'>Ciclo Lectivo </label>
        <input
          type="number"
          id="cycleYear"
          min="2020"
          max="2030"
          value={cycleYear}
          onChange={(e) => setCycleYear(e.target.value)}
        />
      </div>


      {errorMsg && <p className="error-msg"><GoAlertFill />{errorMsg}</p>}


      <form onSubmit={handleSubmit} className="upload-grade">
        <div className="grades-vertical-table">
          {/* Encabezado con los periodos */}
          <div className="table-header">
            <div className="header-cell category-cell"></div>
            {periods.map((p, index) => (
              <div
                key={p.id_periodo}
                className={`header-cell ${index % 2 === 0 ? 'col-dark' : 'col-light'}`}
              >
                {p.nombre}
              </div>
            ))}
          </div>

          {/* Filas por categoría */}
          {categories.map((cat) => (
            <div key={cat.id_tipo} className="table-row">
              <div className="category-cell">{cat.nombre}</div>
              {periods.map((p, index) => {
                const existingGrade = grades.find(
                  (g) => g.periodo === p.nombre && g.tipo_nota === cat.nombre
                );

                return (
                  <div
                    key={p.id_periodo}
                    className={`cell ${index % 2 === 0 ? 'col-dark' : 'col-light'}`}
                  >
                    {/* Mostrar el nombre del periodo solo en móvil */}
                    <span className="mobile-period-label">{p.nombre}</span>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="10"
                      value={existingGrade ? existingGrade.nota : ''}
                      onChange={(e) =>
                        handleGradeChange(p.nombre, cat.nombre, e.target.value)
                      }
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="botonesGrades">
          <button type="submit" className="BotonSubir">Confirmar Notas</button>
          <button type="button" onClick={handleReset} className="BotonReset"><FaTrash></FaTrash></button>
        </div>
      </form>

    </div>
  );
};

export default UploadGrade;
