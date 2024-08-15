import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import Profile from './components/Profile';
import Search from './components/Search';
import Details from './components/Details';
import Login from './components/Login';
import Register from './components/Register';
import Restricted from './components/Restricted';

export const AuthContext = React.createContext<any>(null);

const App: React.FC = () => {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogin = (user: any) => {
        sessionStorage.setItem('user', JSON.stringify(user));
        setUser(user);
    };

    const handleLogout = () => {
        sessionStorage.removeItem('user');
        setUser(null);
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ user, setUser: handleLogin, logout: handleLogout }}>
            <Router>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <Link className="navbar-brand" to="/">Movie Review App</Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/search">Search</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to={user ? `/profile/${user._id}` : "/login"}>Profile</Link>
                            </li>
                            {user && user.role === 'admin' && (
                                <li className="nav-item">
                                    <Link className="nav-link" to="/restricted">Review Approval</Link>
                                </li>
                            )}
                        </ul>
                        <ul className="navbar-nav ml-auto">
                            {!user ? (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/login">Login</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/register">Register</Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <span className="navbar-text">Role: {user.role}</span>
                                    </li>
                                    <li className="nav-item">
                                        <button className="nav-link btn btn-link" onClick={handleLogout}>Logout</button>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </nav>
                <div className="container mt-4">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/profile/:userId" element={<Profile />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/details/:id" element={<Details />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/restricted" element={<Restricted />} />
                    </Routes>
                </div>
            </Router>
        </AuthContext.Provider>
    );
}

export default App;
