import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header'; 
import Home from './components/Home/homeComponent'; 


const App = () => {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/home" element={<Home />} />
                
            </Routes>
        </>
    );
};

export default App;


