// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Login from './Login';
import Welcome from './Welcome';

const App = () => {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/welcome" element={<Welcome />} />
            </Routes>
        </Router>
    );
};

export default App;

