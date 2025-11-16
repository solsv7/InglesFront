import React, { useState } from 'react';
import axios from 'axios';
import ExcelJS from 'exceljs';
import { FaFileExcel, FaUserGraduate, FaUpload, FaUsers, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';
import './Student.css';

const CrearUsuarioNuevo = () => {
    const [excelData, setExcelData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [previewData, setPreviewData] = useState([]);

    const showMessage = (text, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    };

    // Manejar la carga del archivo
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validar tipo de archivo
        if (!file.name.match(/\.(xlsx|xls)$/)) {
            showMessage('Por favor, sube un archivo Excel válido (.xlsx o .xls)', 'error');
            return;
        }

        setFileName(file.name);
        setMessage({ text: '', type: '' });

        try {
            const workbook = new ExcelJS.Workbook();
            const reader = new FileReader();

            reader.onload = async (event) => {
                const buffer = event.target.result;
                await workbook.xlsx.load(buffer);

                const worksheet = workbook.worksheets[0];
                const data = [];
                const preview = [];

                worksheet.eachRow((row, rowIndex) => {
                    if (rowIndex === 1) return; // Omitir encabezados

                    const dni = row.getCell(4).value;
                    const nombre = row.getCell(3).value;
                    const mail = row.getCell(14).value;
                    const whatsapp = row.getCell(6).value;
                    const whatsapp_adulto = row.getCell(8).value;

                    const userData = {
                        dni: dni || '',
                        nombre: nombre || '',
                        password: '1234', // Contraseña fija
                        mail: mail || '',
                        whatsapp: whatsapp || '',
                        whatsapp_adulto: whatsapp_adulto || '',
                    };

                    data.push(userData);
                    
                    // Solo guardar preview de los primeros 3 registros
                    if (preview.length < 3) {
                        preview.push(userData);
                    }
                });

                setExcelData(data);
                setPreviewData(preview);
                console.log('Datos procesados:', data);
                
                if (data.length > 0) {
                    showMessage(`✅ Se procesaron ${data.length} alumnos del archivo`, 'success');
                } else {
                    showMessage('⚠️ El archivo no contiene datos válidos', 'error');
                }
            };

            reader.readAsArrayBuffer(file);
        } catch (error) {
            console.error('Error al procesar el archivo Excel:', error);
            showMessage('❌ Error al procesar el archivo Excel', 'error');
        }
    };

    // Enviar los datos a la API
    const handleSubmit = async () => {
        if (excelData.length === 0) {
            showMessage('⚠️ No hay datos para enviar', 'error');
            return;
        }

        setLoading(true);
        try {
            let successCount = 0;
            let errorCount = 0;

            for (const usuario of excelData) {
                try {
                    console.log('Enviando usuario:', usuario);
                    await axios.post(`${process.env.REACT_APP_API_URL}/api/crear-alumno-nuevo`, usuario);
                    successCount++;
                } catch (error) {
                    console.error('Error creando usuario:', usuario.dni, error);
                    errorCount++;
                }
            }

            if (errorCount === 0) {
                showMessage(`✅ Todos los ${successCount} alumnos fueron creados exitosamente`, 'success');
            } else {
                showMessage(`✅ ${successCount} alumnos creados, ❌ ${errorCount} errores`, 'warning');
            }

            setExcelData([]);
            setPreviewData([]);
            setFileName('');
            // Limpiar input file
            document.querySelector('input[type="file"]').value = '';

        } catch (error) {
            console.error('Error general al crear usuarios:', error);
            showMessage('❌ Error al conectar con el servidor', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="student-registration-form">
            <div className="form-content">
                <div className="form-section">
                    <label className="section-label">
                        <FaFileExcel className="label-icon" />
                        Cargar Archivo Excel
                    </label>
                    
                    <div className="file-upload-wrapper">
                        <div className="file-input-container">
                            <FaUpload className="upload-icon" />
                            <input 
                                type="file" 
                                accept=".xlsx, .xls" 
                                onChange={handleFileUpload}
                                className="file-input"
                                id="excel-file"
                            />
                            <label htmlFor="excel-file" className="file-input-label">
                                {fileName || 'Seleccionar archivo Excel...'}
                            </label>
                        </div>
                        
                        <div className="file-requirements">
                            <FaInfoCircle className="info-icon" />
                            <span>Formato aceptado: .xlsx, .xls</span>
                        </div>
                    </div>
                </div>

                {/* Vista previa de datos */}
                {previewData.length > 0 && (
                    <div className="form-section">
                        <label className="section-label">
                            <FaUsers className="label-icon" />
                            Vista Previa ({excelData.length} alumnos)
                        </label>
                        <div className="preview-container">
                            <div className="preview-header">
                                <span>DNI</span>
                                <span>Nombre</span>
                                <span>Email</span>
                            </div>
                            {previewData.map((alumno, index) => (
                                <div key={index} className="preview-row">
                                    <span>{alumno.dni}</span>
                                    <span>{alumno.nombre}</span>
                                    <span>{alumno.mail || 'Sin email'}</span>
                                </div>
                            ))}
                            {excelData.length > 3 && (
                                <div className="preview-more">
                                    ... y {excelData.length - 3} alumnos más
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {message.text && (
                    <div className={`message ${message.type}`}>
                        <div className="message-icon">
                            {message.type === 'success' ? '✅' : 
                             message.type === 'warning' ? '⚠️' : '❌'}
                        </div>
                        {message.text}
                    </div>
                )}

                <button 
                    onClick={handleSubmit} 
                    disabled={excelData.length === 0 || loading}
                    className="submit-button modern-button"
                >
                    <FaUserGraduate className="button-icon" />
                    {loading ? 'Creando Alumnos...' : `Crear ${excelData.length} Alumnos`}
                </button>

                <div className="form-info">
                    <FaInfoCircle className="info-icon" />
                    <div className="info-user-content">
                        <p><strong>Información importante:</strong></p>
                        <ul>
                            <li>El archivo Excel debe tener la estructura esperada por el sistema</li>
                            <li>Las contraseñas se generan automáticamente como "1234"</li>
                            <li>Los alumnos podrán cambiar su contraseña después</li>
                            <li>Verifica los datos antes de crear los usuarios</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CrearUsuarioNuevo;