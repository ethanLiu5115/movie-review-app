import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../App';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
            authContext?.setUser(response.data.user);
            navigate('/');
        } catch (error: any) {
            console.error('Login failed:', error);
            setMessage('Login failed: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="container">
            <h2>Login</h2>
            {message && <div className="alert alert-danger" role="alert">{message}</div>}
            <div className="form-group">
                <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="form-group">
                <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button className="btn btn-primary" onClick={handleLogin}>Login</button>
        </div>
    );
};

export default Login;
