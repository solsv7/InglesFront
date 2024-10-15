import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Welcome from './components/Welcome/Welcome';

function App() {
    return (
        <div className="App">
            <Header />
            <Routes>
                <Route path="/welcome" element={<Welcome />} />
                {/* Otras rutas */}
            </Routes>
        </div>
    );
}

export default App;




