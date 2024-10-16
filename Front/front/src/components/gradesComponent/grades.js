import React from 'react';
import './grade.css'
const GradesTable = ({ grades, categories, terms }) => {
    
    const organizedGrades = {};

    
    grades.forEach(grade => {
        const term = terms.find(term => term.id === grade.termId);
        const category = categories.find(category => category.id === grade.categoryId);

        if (term && category) {
            if (!organizedGrades[term.name]) {
                organizedGrades[term.name] = {};
            }
            organizedGrades[term.name][category.name] = grade.value;
        }
    });

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Periodo</th>
                        {categories.map(category => (
                            <th key={category.id}>{category.name}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(organizedGrades).map(termName => (
                        <tr key={termName}>
                            <td>{termName}</td>
                            {categories.map(category => (
                                <td key={category.id}>
                                    {organizedGrades[termName][category.name] || 'N/A'}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
    
};

export default GradesTable;
