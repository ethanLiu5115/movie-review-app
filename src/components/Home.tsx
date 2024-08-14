import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../App';

const API_KEY = 'abd8a21';

interface Review {
    _id: string;
    movieId: string;
    userId: string;
    userName: string; // 现在直接从后端获取用户名
    review: string;
    createdAt: string;
    movieTitle: string;
}

const Home: React.FC = () => {
    const authContext = useContext(AuthContext);
    const [recentReviews, setRecentReviews] = useState<Review[]>([]);

    useEffect(() => {
        const fetchRecentReviews = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/reviews');
                const reviewsWithTitles = await Promise.all(
                    response.data.map(async (review: Review) => {
                        const movieResponse = await axios.get(`http://www.omdbapi.com/?i=${review.movieId}&apikey=${API_KEY}`);
                        return { ...review, movieTitle: movieResponse.data.Title };
                    })
                );
                setRecentReviews(reviewsWithTitles);
            } catch (error) {
                console.error('Failed to fetch recent reviews:', error);
            }
        };

        fetchRecentReviews();
    }, []);

    return (
        <div className="container">
            <h1>Movie Review Social Website</h1>
            {authContext?.user ? (
                <h2>Welcome back, {authContext.user.name}!</h2>
            ) : (
                <h2>Welcome to our community!</h2>
            )}
            <p>
                This website is dedicated to movie enthusiasts who love to share their opinions on the latest and greatest films.
                Whether you're a casual viewer or a film critic, our platform provides a space for everyone to voice their thoughts.
            </p>
            <h3>Recent Reviews:</h3>
            <ul className="list-group">
                {recentReviews.map((review) => (
                    <li key={review._id} className="list-group-item">
                        <p>{review.review}</p>
                        <p>Movie: <Link to={`/details/${review.movieId}`}>{review.movieTitle}</Link></p>
                        <p>Written by: <Link to={`/profile/${review.userId}`} style={{ marginLeft: '5px' }}>{review.userName}</Link></p>
                        <p>Written on: {new Date(review.createdAt).toLocaleString()}</p>
                    </li>
                ))}
            </ul>

            <footer style={{ marginTop: '30px' }}>
                <h4>About the Team</h4>
                <p>Full names and sections of all the members in the team:</p>
                <ul>
                    <li>Yifei Liu</li>
                    <li>Jun Ye</li>
                </ul>
                <p>Links to our project repositories:</p>
                <ul>
                    <li>
                        <a href="https://github.com/ethanLiu5115/movie-review-app" target="_blank" rel="noopener noreferrer">
                            React.js Project Repository
                        </a>
                    </li>
                    <li>
                        <a href="https://github.com/ethanLiu5115/movie-review-backend" target="_blank" rel="noopener noreferrer">
                            Node.js Project Repository
                        </a>
                    </li>
                </ul>
            </footer>
        </div>
    );
};

export default Home;
