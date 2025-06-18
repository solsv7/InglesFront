import React, { useState } from 'react';
import axios from 'axios';
import ExcelJS from 'exceljs';
import './Student.css';


const CrearUsuarioNuevo = () => {
    const [excelData, setExcelData] = useState([]);
    const [loading, setLoading] = useState(false);

    // Manejar la carga del archivo
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const workbook = new ExcelJS.Workbook();
            const reader = new FileReader();

            reader.onload = async (event) => {
                const buffer = event.target.result;
                await workbook.xlsx.load(buffer);

                const worksheet = workbook.worksheets[0];
                const data = [];

                worksheet.eachRow((row, rowIndex) => {
                    if (rowIndex === 1) return; // Omitir encabezados

                    const dni = row.getCell(4).value;
                    const nombre = row.getCell(3).value;
                    const mail = row.getCell(14).value;
                    const whatsapp = row.getCell(6).value;
                    const whatsapp_adulto = row.getCell(8).value;
                    
                    

                    data.push({
                        dni: dni || '',
                        nombre: nombre || '',
                        password: '1234', // Contraseña fija
                        mail: mail || '',
                        whatsapp: whatsapp || '',
                        whatsapp_adulto: whatsapp_adulto || '',
                        
                        
                    });
                });

                setExcelData(data);
                console.log('Datos procesados:', data);
            };

            reader.readAsArrayBuffer(file);
        } catch (error) {
            console.error('Error al procesar el archivo Excel:', error);
            alert('Hubo un error al procesar el archivo Excel.');
        }
    };

    // Enviar los datos a la API
    const handleSubmit = async () => {
        if (excelData.length === 0) {
            alert('No hay datos para enviar');
            return;
        }
    
        setLoading(true);
        try {
            for (const usuario of excelData) {
                console.log('Enviando usuario:', usuario); // 🔹 Agregar este log
                await axios.post('http://localhost:3001/api/crear-alumno-nuevo', usuario);
            }
    
            alert('Usuarios creados con éxito');
            setExcelData([]);
        } catch (error) {
            console.error('Error al crear usuarios:', error);
            alert(error.response?.data?.error || 'Ocurrió un error al crear los usuarios.');
        } finally {
            setLoading(false);
        }
    };
    
    

    return (
        <div className="user-registration">
            <div className='MarcoFormulario2'>
                <label>Ingrese el formulario del alumno a ingresar</label>
                <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
            </div>
                <button onClick={handleSubmit} disabled={excelData.length === 0 || loading} className='BotonCrearAlumno'>
                    {loading ? 'Creando Usuario...' : 'Crear Usuario'}
                </button>
            
        </div>
    );
};

export default CrearUsuarioNuevo;
