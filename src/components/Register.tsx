// src/components/Register.tsx
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [message, setMessage] = useState('');
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/users/register', {
                name,
                email,
                password,
                role,
            });
            authContext?.setUser(response.data.user);
            setMessage('Registration successful!');
            navigate('/');
        } catch (error: any) {
            console.error('Registration failed:', error);
            setMessage(error.response?.data?.message || 'Registration failed: Please try again later.');
        }
    };

    return (
        <div className="container">
            <h2>Register</h2>
            {message && <div className="alert alert-danger">{message}</div>}
            <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="role">Role:</label>
                <select
                    id="role"
                    className="form-control"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="guest">Guest</option>
                </select>
            </div>
            <button className="btn btn-primary" onClick={handleRegister}>
                Register
            </button>
        </div>
    );
};

export default Register;
