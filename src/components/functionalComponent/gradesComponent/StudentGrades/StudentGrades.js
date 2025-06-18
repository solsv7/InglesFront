import React, { useState } from 'react';
import StudentSearch from '../StudentSearch/StudentSearch';
import UploadGrade from '../UploadGrade/UploadGrade';
import transition from '../../../../transition';
import './StudentGrades.css'

const StudentGrades = () => {
    const [selectedStudentId, setSelectedStudentId] = useState(null);

    return (
    <div className="student-grades">
        <StudentSearch onSelectStudent={setSelectedStudentId} />
        <UploadGrade selectedStudentId={selectedStudentId} />
        
    </div>
    );
};

export default transition(StudentGrades);
