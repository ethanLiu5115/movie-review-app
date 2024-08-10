import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../App';

interface Review {
    _id: string;
    movieId: string;
    userId: string;
    review: string;
    createdAt: string;
    userName: string;
}

const Home: React.FC = () => {
    const [recentReviews, setRecentReviews] = useState<Review[]>([]);
    const authContext = useContext(AuthContext);

    useEffect(() => {
        const fetchRecentReviews = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/reviews');
                const reviewsWithUserNames = await Promise.all(
                    response.data.map(async (review: Review) => {
                        const userResponse = await axios.get(`http://localhost:5000/api/users/${review.userId}`);
                        return { ...review, userName: userResponse.data.name };
                    })
                );
                setRecentReviews(reviewsWithUserNames);
            } catch (error) {
                console.error('Failed to fetch recent reviews:', error);
            }
        };

        fetchRecentReviews();
    }, []);

    return (
        <div className="container">
            <header>
                <h1>Movie Review Social Website</h1>
                <p>Welcome to our Movie Review platform where you can find reviews for various movies. Join our community and share your thoughts!</p>
            </header>

            {authContext?.user ? (
                <>
                    <h2>Welcome back, {authContext.user.name}!</h2>
                    <p>Here are your recent reviews:</p>
                    <ul className="list-group">
                        {recentReviews
                            .filter((review) => review.userId === authContext.user._id)
                            .map((review) => (
                                <li key={review._id} className="list-group-item">
                                    <p><strong>{review.userName}:</strong> {review.review}</p>
                                    <p><strong>Movie ID:</strong> {review.movieId}</p>
                                </li>
                            ))}
                    </ul>
                </>
            ) : (
                <>
                    <h2>Recent Reviews from Our Community</h2>
                    <ul className="list-group">
                        {recentReviews.slice(0, 5).map((review) => (
                            <li key={review._id} className="list-group-item">
                                <p><strong>{review.userName}:</strong> {review.review}</p>
                                <p><strong>Movie ID:</strong> {review.movieId}</p>
                            </li>
                        ))}
                    </ul>
                </>
            )}

            <footer style={{ marginTop: '30px' }}>
                <h2>About Us</h2>
                <p><strong>Team Members:</strong></p>
                <ul>
                    <li>Yifei Liu</li>
                    <li>Jun Ye</li>
                </ul>
                <p><strong>Project Links:</strong></p>
                <ul>
                    <li><a href="https://github.com/ethanLiu5115/movie-review-app" target="_blank" rel="noopener noreferrer">React.js Project Repository</a></li>
                    <li><a href="https://github.com/ethanLiu5115/movie-review-backend" target="_blank" rel="noopener noreferrer">Node.js Project Repository</a></li>
                </ul>
            </footer>
        </div>
    );
};

export default Home;
