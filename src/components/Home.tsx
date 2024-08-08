import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../App';

interface Review {
    _id: string;
    movieId: string;
    userId: string;
    review: string;
    createdAt: string;
}

interface User {
    _id: string;
    name: string;
    email: string;
}

const Home: React.FC = () => {
    const authContext = useContext(AuthContext);
    const [recentReviews, setRecentReviews] = useState<Review[]>([]);
    const [recentUsers, setRecentUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchRecentReviews = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/reviews');
                setRecentReviews(response.data);
            } catch (error) {
                console.error('Failed to fetch recent reviews:', error);
            }
        };

        const fetchRecentUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users');
                setRecentUsers(response.data);
            } catch (error) {
                console.error('Failed to fetch recent users:', error);
            }
        };

        fetchRecentReviews();
        fetchRecentUsers();
    }, []);

    return (
        <div>
            <header className="mb-4">
                <h1>Movie Review Social Website</h1>
            </header>
            {authContext?.user ? (
                <div>
                    <h2>Welcome back, {authContext.user.name}!</h2>
                    <p>Here are your recent reviews:</p>
                    <ul className="list-group">
                        {recentReviews.filter(review => review.userId === authContext.user?.email).map(review => (
                            <li key={review._id} className="list-group-item">
                                {review.review}
                            </li>
                        ))}
                    </ul>
                    <button className="btn btn-primary" onClick={() => authContext.setUser(null)}>
                        Log Out
                    </button>
                </div>
            ) : (
                <div>
                    <p><Link to="/login">Login</Link> or <Link to="/register">Register</Link> to see your recent reviews.</p>
                    <h3>Recent Reviews</h3>
                    <ul className="list-group">
                        {recentReviews.slice(0, 3).map(review => (
                            <li key={review._id} className="list-group-item">
                                {review.review}
                            </li>
                        ))}
                    </ul>
                    <h3>Recent Users</h3>
                    <ul className="list-group">
                        {recentUsers.slice(0, 3).map(user => (
                            <li key={user._id} className="list-group-item">
                                {user.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Home;
