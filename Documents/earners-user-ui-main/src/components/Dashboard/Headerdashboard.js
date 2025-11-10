import React from 'react';
import { Navbar, Button } from 'react-bootstrap';
import './HeaderDashboard.css';

const HeaderDashboard = () => {
    return (
        <Navbar expand="lg" className="custom-navbar sticky-top">
            <Navbar.Brand href="#home" className="custom-brand-logo">
                <img src='./HeaderLoGo.png' alt="Company Logo" className="custom-header-logo" />
            </Navbar.Brand>
            <div className="custom-login-container">
                <Button className="custom-login-button" href="/login">Login</Button>
                <Button className="custom-signup-button" href="/signup">Signup</Button>
            </div>
        </Navbar>
    );
};

export default HeaderDashboard;
