import React, { useState, useContext, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../App';

const API_KEY = 'abd8a21';

interface Review {
    _id: string;
    movieId: string;
    userId: string;
    review: string;
    createdAt: string;
    movieTitle?: string;
}

interface WatchHistory {
    _id: string;
    movieId: string;
    watchedAt: string;
    movieTitle?: string;
}

const Profile: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const authContext = useContext(AuthContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [reviews, setReviews] = useState<Review[]>([]);
    const [watchHistory, setWatchHistory] = useState<WatchHistory[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/users/${userId}`);
                setName(response.data.name);
                setEmail(response.data.email);
            } catch (error) {
                console.error('Failed to fetch user:', error);
                navigate('/');
            }
        };

        const fetchReviews = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/reviews?userId=${userId}`);
                const reviewsWithTitles = await Promise.all(
                    response.data.map(async (review: Review) => {
                        const movieResponse = await axios.get(`http://www.omdbapi.com/?i=${review.movieId}&apikey=${API_KEY}`);
                        return {
                            ...review,
                            movieTitle: movieResponse.data.Title,
                        };
                    })
                );
                setReviews(reviewsWithTitles);
            } catch (error) {
                console.error('Failed to fetch reviews:', error);
            }
        };

        const fetchWatchHistory = async () => {
            if (authContext.user?._id === userId) { // 仅在访问自己profile时获取Watch History
                try {
                    const response = await axios.get(`http://localhost:5000/api/watchHistory?userId=${userId}`);
                    const historyWithTitles = await Promise.all(
                        response.data.map(async (history: WatchHistory) => {
                            const movieResponse = await axios.get(`http://www.omdbapi.com/?i=${history.movieId}&apikey=${API_KEY}`);
                            return {
                                ...history,
                                movieTitle: movieResponse.data.Title,
                            };
                        })
                    );
                    setWatchHistory(historyWithTitles);
                } catch (error) {
                    console.error('Failed to fetch watch history:', error);
                }
            }
        };

        fetchUser();
        fetchReviews();
        fetchWatchHistory(); // 获取 Watch History

    }, [userId, authContext.user, navigate]);

    const handleSave = async () => {
        if (authContext.user?._id !== userId) {
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

    const obfuscateEmail = (email: string) => {
        const [localPart, domain] = email.split('@');
        const obfuscatedLocalPart = localPart.slice(0, 2) + '****' + localPart.slice(-1);
        return `${obfuscatedLocalPart}@${domain}`;
    };

    return (
        <div className="container">
            <h2>User Profile</h2>
            {authContext.user?._id === userId ? (
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
                    <p><strong>Email:</strong> {obfuscateEmail(email)}</p>
                </>
            )}

            <h3 style={{ marginTop: '20px' }}>User Reviews</h3>
            <ul className="list-group">
                {reviews.filter((review) => review.userId === userId).map((review) => (
                    <li key={review._id} className="list-group-item review-item">
                        <p>{review.review}</p>
                        <p>Movie: <Link to={`/details/${review.movieId}`}>{review.movieTitle}</Link></p>
                        <p>Written on: {new Date(review.createdAt).toLocaleString()}</p>
                    </li>
                ))}
            </ul>

            {authContext.user?._id === userId && (
                <>
                    <h3 style={{ marginTop: '20px' }}>Watch History</h3>
                    <ul className="list-group">
                        {watchHistory.map((history) => (
                            <li key={history._id} className="list-group-item">
                                <p>Movie: <Link to={`/details/${history.movieId}`}>{history.movieTitle}</Link></p>
                                <p>Watched on: {new Date(history.watchedAt).toLocaleString()}</p>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default Profile;
