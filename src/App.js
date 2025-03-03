import { useEffect } from 'react'; 
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import './App.css';
import Header from './components/Header/Header';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import SchedulesPage from './pages/SchedulesPage';
import ProfilePage from './pages/ProfilePage';
import ClassesPage from './pages/ClassesPage';
import HomeStudent from './components/HomeUsers/HomeStudent';
import HomeTeacher from './components/HomeUsers/HomeTeacher';
import HomeAdmin from './components/HomeUsers/HomeAdmin';
import StudentGrades from './components/functionalComponent/gradesComponent/StudentGrades/StudentGrades';
import GradesTable from './components/functionalComponent/gradesComponent/grades';
import AdvicesPage from './components/Advices/AdvicesPage';
import WorkInProgress from './components/WorkInProgress/WorkInProgres';
import Inscribe from './components/inscribePage/Inscribe';
import UploadVids from './components/VideosPages/UploadVids';
import AllVids from './components/VideosPages/AllVids';
import UsersCreation from './components/functionalComponent/UserRegistration/UserCreatePage';
import LoginComponent from './components/HomePageComponents/Login/LoginComponent';
import Register from './components/HomePageComponents/Register/Register';
import BuscadorAlumnos from './components/functionalComponent/UserRegistration/newStudentCreate';
import VerTodaBandeja from './components/Advices/VerTodaBandeja';
import ModificarProfile from './components/Profile/ModificarProfile';
import AcceptStudents from './components/functionalComponent/UserRegistration/AcceptStudents';
import AboutUs from './components/AboutUs/AboutUs';
import CheckForms from './components/functionalComponent/UserRegistration/CheckForms';



const App = () => {
    useEffect(() => {
        document.documentElement.lang = "es"; // Cambia "es" por el idioma correcto
    }, []);
    

    const location = useLocation();
    return (
        <>
            <Header />
            <AnimatePresence mode='wait'>
            <Routes location={location} key={location.pathname}>
            <Route index element={<HomePage />} />
            <Route path='/AboutPage' element={<AboutPage />} />
            <Route path='/SchedulePage' element={<SchedulesPage />} />
            <Route path='/ProfilePage' element={<ProfilePage />} />
            <Route path='/home-student' element={<HomeStudent />} />
            <Route path='/home-teacher' element={<HomeTeacher />} />
            <Route path='/home-admin' element={<HomeAdmin />} />
            <Route path='/Crear-usuarios' element={<UsersCreation/>} />
            <Route path='/Upload-Marks' element={<StudentGrades />} />
            <Route path='/Student-Marks' element={<GradesTable />} />
            <Route path='/Not-Ready' element={<WorkInProgress />} />
            <Route path='/ClassesPage' element={<ClassesPage />} />
            <Route path='/Advices' element={<AdvicesPage />} />
            <Route path='/Inscription' element={<Inscribe />} />
            <Route path='/Upload-Vids' element={<UploadVids />} />
            <Route path='/All-Vids' element={<AllVids />} />
            <Route path='/Login' element={<LoginComponent />} />
            <Route path='/Register' element={<Register />} />
            <Route path='/Buscador' element={<BuscadorAlumnos />} />
            <Route path='/All-Msg' element={<VerTodaBandeja />} />
            <Route path='/Modificar' element={<ModificarProfile />} />
            <Route path='/Accept' element={<AcceptStudents />} />
            <Route path='/About' element={<AboutUs />} />
            <Route path='/CheckForms' element={<CheckForms />} />
            </Routes>
            </AnimatePresence>
            
        </>
    );
};

export default App;


