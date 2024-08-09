import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../App';

const API_KEY = 'abd8a21'; // 使用你注册的OMDb API key

interface Review {
    _id: string;
    movieId: string;
    userId: string;
    review: string;
    createdAt: string;
    userName: string;
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

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axios.get(`http://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`);
                if (response.data.Response === "False") {
                    console.error('OMDB API Error:', response.data.Error);
                    return;
                }
                setDetails(response.data);
            } catch (error) {
                console.error('Failed to fetch movie details:', error);
            }
        };

        const fetchReviews = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/reviews?movieId=${id}`);
                const reviewsWithUserNames = await Promise.all(
                    response.data.map(async (review: Review) => {
                        const userResponse = await axios.get(`http://localhost:5000/api/users/${review.userId}`);
                        return { ...review, userName: userResponse.data.name };
                    })
                );
                setReviews(reviewsWithUserNames);
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
            return;
        }

        try {
            const newReview = {
                movieId: id,
                userId: authContext.user.email,
                review,
            };
            const response = await axios.post('http://localhost:5000/api/reviews', newReview);
            setReviews([...reviews, { ...response.data, userName: authContext.user.name }]);
            setReview('');
        } catch (error) {
            console.error('Failed to submit review:', error);
            alert('Failed to submit review.');
        }
    };

    return (
        <div className="container">
            {details ? (
                <>
                    <h2>{details.Title}</h2>
                    <img src={details.Poster} alt={details.Title} />
                    <p>{details.Plot}</p>
                    <p><strong>Director:</strong> {details.Director}</p>
                    <p><strong>Actors:</strong> {details.Actors}</p>
                    <p><strong>Genre:</strong> {details.Genre}</p>
                    <p><strong>Released:</strong> {details.Released}</p>
                    <h3>Reviews</h3>
                    <ul className="list-group">
                        {reviews.map((review) => (
                            <li key={review._id} className="list-group-item">
                                <p><strong>{review.userName}:</strong> {review.review}</p>
                                <p><Link to={`/profile/${review.userId}`}>View Profile</Link></p>
                            </li>
                        ))}
                    </ul>
                    {authContext?.user && (
                        <div style={{ marginTop: '20px' }}>
                            <h3>Write a Review</h3>
                            <textarea
                                className="form-control"
                                rows={3}
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                            />
                            <button className="btn btn-primary" onClick={handleReviewSubmit} style={{ marginTop: '10px' }}>
                                Submit Review
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Details;
