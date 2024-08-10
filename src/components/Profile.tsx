import React, { useState, useContext, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../App';

interface Review {
    _id: string;
    movieId: string;
    userId: string;
    review: string;
    createdAt: string;
}

const Profile: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const authContext = useContext(AuthContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [reviews, setReviews] = useState<Review[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authContext.user) {
            navigate('/login');
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/users/${userId}`);
                setName(response.data.name);
                setEmail(response.data.email);
            } catch (error) {
                console.error('Failed to fetch user:', error);
            }
        };

        const fetchReviews = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/reviews?userId=${userId}`);
                setReviews(response.data);
            } catch (error) {
                console.error('Failed to fetch reviews:', error);
            }
        };

        fetchUser();
        fetchReviews();
    }, [userId, authContext.user, navigate]);

    const handleSave = async () => {
        if (authContext.user._id !== userId) {
            alert('You can only edit your own profile.');
            return;
        }

        try {
            await axios.put('http://localhost:5000/api/users', {
                userId: authContext.user._id,
                name,
                email,
            });

            authContext.setUser({ ...authContext.user, name, email });
            alert('User information updated successfully!');
        } catch (error) {
            console.error('Failed to save user info:', error);
            alert('Failed to save user info.');
        }
    };

    return (
        <div className="container">
            <h2>User Profile</h2>
            {authContext.user._id === userId ? (
                <>
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
                    <button className="btn btn-primary" onClick={handleSave}>
                        Save
                    </button>
                </>
            ) : (
                <>
                    <p><strong>Name:</strong> {name}</p>
                    <p><strong>Email:</strong> {email}</p>
                </>
            )}

            <h3 style={{ marginTop: '20px' }}>User Reviews</h3>
            <ul className="list-group">
                {reviews.map((review) => (
                    <li key={review._id} className="list-group-item">
                        <p><strong>Movie ID:</strong> {review.movieId}</p>
                        <p><strong>Review:</strong> {review.review}</p>
                        <p><strong>Written on:</strong> {new Date(review.createdAt).toLocaleString()}</p>
                        {authContext.user.role === 'admin' && authContext.user._id !== userId && (
                            <>
                                <p><strong>User ID:</strong> <Link to={`/profile/${review.userId}`}>{review.userId}</Link></p>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Profile;
