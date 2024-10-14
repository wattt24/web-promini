import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../style/Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/login', {
                username,
                password,
            });
            console.log('Login successful:', response.data);
            localStorage.setItem('user', JSON.stringify({ username }));
            navigate('/dashboard');
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please check your credentials.');
        }
    };
    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-title">Login</h2>
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <label>Username:</label>
                        <input 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
                            className="input-field"
                        />
                    </div>
                    <div className="input-group">
                        <label>Password:</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            className="input-field"
                        />
                    </div>
                    <button type="submit" className="login-button">Login</button>
                </form>
                <p className="register-link">
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;

