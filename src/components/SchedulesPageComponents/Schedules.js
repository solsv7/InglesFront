import React from "react";
import './Schedules.css'

const Schedules = () => {
    return(
        <div className="Horarios">
            <h3>Nuestros horarios</h3>
            <div className="SeparadorTabla">
                <table className="TablaHorarios">
                    <tr>
                        <th id="TLC">Horas</th>
                        <th>Lunes</th>
                        <th>Martes</th>
                        <th>Miercoles</th>
                        <th>Jueves</th>
                        <th id="TRC">Viernes</th>    
                    </tr>
                    <tr>
                        <td className="BRC">- - | - -</td>
                        <td>Sin Asignar</td>
                        <td>Sin Asignar</td>
                        <td>Sin Asignar</td>
                        <td>Sin Asignar</td>
                        <td>Sin Asignar</td>
                    </tr>
                    
                </table>
            </div>
        </div>
    )
}
export default Schedules;