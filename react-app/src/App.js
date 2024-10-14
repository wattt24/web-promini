import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Pets from './components/Pets'; // นำเข้าคอมโพเนนต์ใหม่

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/pets" element={<Pets />} /> {/* เส้นทางใหม่ */}
            </Routes>
        </Router>
    );
};

export default App;