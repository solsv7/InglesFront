import React from "react";
import transition from "../transition";
import Marks from "../components/Marks/MarksPage";

const GradesPage = () =>{
    return(
        <div>
            <Marks />
        </div>
    )
}

export default transition(GradesPage);