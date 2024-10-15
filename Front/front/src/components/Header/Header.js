import React from 'react';
import './header.css';
import Login from '../Login/LoginComponent';
import logo from './logo.png';

const Header = () => {
    return (
        <div>
            <header className="header">
                <div className="logo">
                    <img src={logo} alt="Logo" />
                </div>
                <nav className="nav-links">
                    <a href="#about">About</a>
                    <a href="#schedules">Schedules</a>
                    <a href="#blog">Blog</a>
                    <div className="login-container">
                        <button className="login-button">Login</button>
                        <div className="login-form">
                            <Login />
                        </div>
                    </div>
                </nav>
            </header>
        </div>
    );
};

export default Header;
