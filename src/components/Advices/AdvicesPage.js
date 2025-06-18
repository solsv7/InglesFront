import React, { useState , useEffect} from "react";
import transition from "../../transition";
import "./AdvicesPage.css"
import axios from "axios";

const AdvicesPage = () => {
    const [target, setTarget] = useState("");
    const [levels, setLevels] = useState([]);
    const [student, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(""); // Alumno seleccionado
    const [message, setMessage] = useState(""); // Mensaje a enviar
    const [selectedLevel, setSelectedLevel] = useState("");
    const option = "";
    
    useEffect(() => {
        const fetchLevels = async () => {
          try {
            const response = await axios.get('http://localhost:3001/api/niveles');
            setLevels(response.data);
          } catch (error) {
            console.error('Error fetching levels:', error);
          }
        };
        fetchLevels();
      }, []);
    // Estado para controlar la opción seleccionada en el primer select
    useEffect(() => {
        const fetchStudents = async () => {
          try {
            const response = await axios.get('http://localhost:3001/api/obtenerAlumnos',{
                params:{option:"existente"}
              });
            setStudents(response.data);
            console.log('estudiantes: ', student);
          } catch (error) {
            console.error('Error fetching students', error);
          }
        };
        fetchStudents();
      }, []);

    // Manejar el cambio de la primera opción
    const handleTargetChange = (event) => {
        setTarget(event.target.value);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Validaciones antes de enviar
        if (!target) return alert("Debes seleccionar un destinatario");
        if (target === "alumno" && !selectedStudent) return alert("Debes seleccionar un alumno");
        if (target === "curso" && !selectedLevel) return alert("Debes seleccionar un curso");
        if (!message.trim()) return alert("El mensaje no puede estar vacío");
    
        // Objeto de datos para enviar
        let data = { target, mensaje: message };
        let url = "http://localhost:3001/api/mensaje"; // Endpoint por defecto
    
        if (target === "alumno") {
            data.id_alumno = selectedStudent;
        } else if (target === "curso") {
            data.id_nivel = selectedLevel;
            url = "http://localhost:3001/api/mensajeCurso"; // Cambia URL para cursos
        }
    
        console.log("Enviando aviso:", data); // Verifica qué se está enviando
    
        try {
            const response = await axios.post(url, data);
            alert("Aviso enviado con éxito");
            console.log(response.data);
        } catch (error) {
            console.error("Error al guardar el aviso:", error.response?.data || error);
            alert("Hubo un error al enviar el aviso");
        }
    };
    
    return (
        <div className="AdviceContent">
            <h1>Avisos</h1>
            <form className="advicesForm" onSubmit={handleSubmit}>
                {/* Primera opción: A quién se dirige */}
                <select value={target} onChange={handleTargetChange} className="SelectType">
                    <option value="">¿A quién se dirige?</option>
                    <option value="alumno">Alumno</option>
                    <option value="curso">Curso</option>
                    <option value="todos">Todos</option>
                </select>

                {/* Mostrar opciones condicionalmente */}
                {target === "alumno" && (
                    <div>
                         <select 
                            onChange={(e) => {
                                console.log("Alumno seleccionado:", e.target.value);
                                setSelectedStudent(e.target.value);
                            }}
                            >
                            <option value="">Seleccionar alumno</option>
                            {student.map((stud) => (
                                <option key={stud.id_alumno} value={stud.id_alumno}>
                                    {stud.nombre}
                                </option>
                            ))}
                        </select>

                    </div>
                )}

                {target === "curso" && (
                    <div>
                        <select 
                            onChange={(e) => {
                                console.log("Curso seleccionado:", e.target.value);
                                setSelectedLevel(e.target.value);
                            }}
                        >
                            <option value="">Seleccionar Curso</option>
                            {levels.map((level) => (
                                <option key={level.id_nivel} value={level.id_nivel}>
                                    {level.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Aviso: Siempre visible */}
                <div>
                    <textarea cols={40} rows={7} placeholder="Escribe el mensaje que quieres enviar" value={message}
                        onChange={(e) => setMessage(e.target.value)}/>
                </div>
                <button type="submit" className="boton-enviar">Enviar aviso</button>
            </form>
        </div>
    );
};

export default transition(AdvicesPage);
