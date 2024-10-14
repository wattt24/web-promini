import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/register', {
                username,
                password,
            });
            console.log('Registration successful:', response.data);
            navigate('/');
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed. Please try again.');
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2 className="register-title">Register</h2>
                <form onSubmit={handleSubmit} className="register-form">
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
                    <div className="input-group">
                        <label>Confirm Password:</label>
                        <input 
                            type="password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            required 
                            className="input-field"
                        />
                    </div>
                    <button type="submit" className="register-button">Register</button>
                </form>
                <p className="login-link">
                    Already have an account? <Link to="/">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;