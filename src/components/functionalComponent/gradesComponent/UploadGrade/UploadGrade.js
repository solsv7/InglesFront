import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UploadGrade.css';

const UploadGrade = ({ selectedStudentId }) => {
  const [grades, setGrades] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cycleYear, setCycleYear] = useState('');
  const [confirmedYear, setConfirmedYear] = useState(null);

  // Cargar periodos y categorías desde la API
  useEffect(() => {
    const fetchPeriods = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/periodos');
        setPeriods(response.data);
      } catch (error) {
        console.error('Error al obtener los periodos:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
      }
    };

    fetchPeriods();
    fetchCategories();
  }, []);

  // Cargar notas existentes cuando cambia el alumno o el año confirmado
  useEffect(() => {
    const fetchExistingGrades = async () => {
      if (!selectedStudentId || !confirmedYear) return;

      try {
        const response = await axios.get(
          `http://localhost:3001/api/grades/${selectedStudentId}/${confirmedYear}`
        );
        setGrades(response.data);
      } catch (error) {
        console.error('Error al obtener notas:', error);
      }
    };

    fetchExistingGrades();
  }, [selectedStudentId, confirmedYear]);

  // Manejar el cambio de nota
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

    if (!confirmedYear) {
      alert('Por favor, confirme el año antes de enviar las notas.');
      return;
    }

    try {
      const notasAEnviar = grades.filter((grade) => grade.nota);
      await axios.post('http://localhost:3001/api/grades/subir', {
        notas: notasAEnviar.map((grade) => ({
          idAlumno: selectedStudentId,
          idPeriodo: periods.find((period) => period.nombre === grade.periodo)?.id_periodo,
          idTipoNota: categories.find((category) => category.nombre === grade.tipo_nota)?.id_tipo,
          nota: parseFloat(grade.nota),
          cicloLectivo: confirmedYear,
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
        <label htmlFor="cycleYear" className='seleccionar'>Seleccionar ciclo:</label>
        <input
          type="number"
          id="cycleYear"
          value={cycleYear}
          onChange={(e) => setCycleYear(e.target.value)}
          placeholder="Ej: 2024"
        />
        <button
          type="button"
          onClick={() => {
            if (cycleYear) {
              setConfirmedYear(cycleYear);
            } else {
              alert('Por favor, ingrese un año válido antes de confirmar.');
            }
          }}
          className="BotonConfirmarCiclo"
        >
          Seleccionar Ciclo
        </button>
      </div>
      {confirmedYear && <p className="year-confirmation">Ciclo lectivo confirmado: {confirmedYear}</p>}
      <form onSubmit={handleSubmit} className="upload-grade">
        <table className="Tabla-Grades">
          <thead>
            <tr>
              <th>Periodo</th>
              {categories.map((category) => (
                <th key={category.id_tipo}>{category.nombre}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periods.map((period) => (
              <tr key={period.id_periodo}>
                <td>{period.nombre}</td>
                {categories.map((category) => {
                  const existingGrade = grades.find(
                    (grade) =>
                      grade.periodo === period.nombre &&
                      grade.tipo_nota === category.nombre
                  );

                  return (
                    <td key={category.id_tipo}>
                      <input
                        type="number"
                        step="0.5"
                        className="inputNota"
                        value={existingGrade ? existingGrade.nota : ''}
                        onChange={(e) =>
                          handleGradeChange(
                            period.nombre,
                            category.nombre,
                            e.target.value
                          )
                        }
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="botonesGrades">
          <button type="submit" className="BotonSubir">
            Subir/Editar Notas
          </button>
          <button type="button" onClick={handleReset} className="BotonReset">
            Limpiar Cambios
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadGrade;

