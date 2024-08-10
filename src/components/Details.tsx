import React, { useEffect, useState, useContext } from 'react';
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
}

interface MovieDetails {
    Title: string;
    Year: string;
    Rated: string;
    Released: string;
    Runtime: string;
    Genre: string;
    Director: string;
    Writer: string;
    Actors: string;
    Plot: string;
    Language: string;
    Country: string;
    Awards: string;
    Poster: string;
    Ratings: Array<{ Source: string; Value: string; }>;
    Metascore: string;
    imdbRating: string;
    imdbVotes: string;
    imdbID: string;
    Type: string;
    DVD: string;
    BoxOffice: string;
    Production: string;
    Website: string;
    Response: string;
}

const Details: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [details, setDetails] = useState<MovieDetails | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [review, setReview] = useState('');
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axios.get(`http://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`);
                setDetails(response.data);
            } catch (error) {
                console.error('Failed to fetch details:', error);
            }
        };

        const fetchReviews = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/reviews/movie?movieId=${id}`);
                setReviews(response.data);
            } catch (error) {
                console.error('Failed to fetch reviews:', error);
            }
        };

        fetchDetails();
        fetchReviews();
    }, [id]);

    const handleReviewSubmit = async () => {
        if (!authContext?.user) {
            alert('You must be logged in to write a review.');
            navigate('/login');
            return;
        }
        try {
            const newReview = {
                movieId: id,
                userId: authContext.user._id,  // 使用数据库中用户ID
                review,
            };
            const response = await axios.post('http://localhost:5000/api/reviews', newReview);
            setReviews([...reviews, response.data]);
            setReview('');
        } catch (error: any) {
            console.error('Failed to submit review:', error);
            alert('Failed to submit review: ' + (error.response?.data?.message || error.message));
        }
    };

    if (!details) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <h2>{details.Title}</h2>
            <p><strong>Year:</strong> {details.Year}</p>
            <p><strong>Genre:</strong> {details.Genre}</p>
            <p><strong>Released:</strong> {details.Released}</p>
            <p><strong>Director:</strong> {details.Director}</p>
            <p><strong>Actors:</strong> {details.Actors}</p>
            <p><strong>Plot:</strong> {details.Plot}</p>
            <p><strong>Language:</strong> {details.Language}</p>
            <p><strong>Country:</strong> {details.Country}</p>
            <img src={details.Poster} alt={details.Title} />
            <h3>Reviews</h3>
            <ul className="list-group">
                {reviews.map((review) => (
                    <li key={review._id} className="list-group-item">
                        {review.review} - <Link to={`/profile/${review.userId}`}>{review.userId}</Link>
                    </li>
                ))}
            </ul>
            <div style={{ marginTop: '20px' }}>
                <h3>Write a Review</h3>
                <textarea
                    className="form-control"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleReviewSubmit} style={{ marginTop: '10px' }}>
                    Submit Review
                </button>
            </div>
        </div>
    );
};

export default Details;
