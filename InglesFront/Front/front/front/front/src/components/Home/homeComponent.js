import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import GradesTable from '../gradesComponent/grades';
import './Home.css'

const Home = () => {
    const location = useLocation();
    const { studentName, studentId } = location.state || {};
    const [grades, setGrades] = useState([]);
    const [categories, setCategories] = useState([]);
    const [terms, setTerms] = useState([]);

    useEffect(() => {
        const fetchGrades = async () => {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3001/api/grades/student/${studentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setGrades(response.data);
        };

        const fetchCategories = async () => {
            const response = await axios.get('http://localhost:3001/api/categories');
            setCategories(response.data);
        };

        const fetchTerms = async () => {
            const response = await axios.get('http://localhost:3001/api/terms');
            setTerms(response.data);
        };

        if (studentId) {
            fetchGrades();
            fetchCategories();
            fetchTerms();
        }
    }, [studentId]);

    return (
        <div>
            <h1>Bienvenido, {studentName}!</h1>
            <GradesTable grades={grades} categories={categories} terms={terms} />
        </div>
    );
};

export default Home;
