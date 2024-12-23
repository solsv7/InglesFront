import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import './App.css';
import Header from './components/Header/Header';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import SchedulesPage from './pages/SchedulesPage';
import Redes from './components/Redes/Redes';
import ProfilePage from './pages/ProfilePage';
import ClassesPage from './pages/ClassesPage';
import HomeStudent from './components/HomeUsers/HomeStudent';
import HomeTeacher from './components/HomeUsers/HomeTeacher';
import HomeAdmin from './components/HomeUsers/HomeAdmin';
import CrearUsuario from './components/functionalComponent/UserRegistration/UserRegistration';
import StudentGrades from './components/functionalComponent/gradesComponent/StudentGrades/StudentGrades';
import GradesTable from './components/functionalComponent/gradesComponent/grades';
import WorkInProgress from './components/WorkInProgress/WorkInProgres';



const App = () => {

    const location = useLocation();
    return (
        <>
        <Redes></Redes>
            <Header />
            <AnimatePresence mode='wait'>
            <Routes location={location} key={location.pathname}>
            <Route index element={<HomePage />} />
            <Route path='/BlogPage' element={<BlogPage />} />
            <Route path='/AboutPage' element={<AboutPage />} />
            <Route path='/SchedulePage' element={<SchedulesPage />} />
            <Route path='/ProfilePage' element={<ProfilePage />} />
            <Route path='/home-student' element={<HomeStudent />} />
            <Route path='/home-teacher' element={<HomeTeacher />} />
            <Route path='/home-admin' element={<HomeAdmin />} />
            <Route path='/Create-User' element={<CrearUsuario />} />
            <Route path='/Upload-Marks' element={<StudentGrades />} />
            <Route path='/Student-Marks' element={<GradesTable />} />
            <Route path='/Not-Ready' element={<WorkInProgress />} />
            <Route path='/ClassesPage' element={<ClassesPage />} />
            </Routes>
            </AnimatePresence>
            
        </>
    );
};

export default App;


