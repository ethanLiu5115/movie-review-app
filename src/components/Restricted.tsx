import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../App';

interface Review {
    _id: string;
    movieId: string;
    userId: string;
    userName: string;
    review: string;
    createdAt: string;
}

const Restricted: React.FC = () => {
    const authContext = useContext(AuthContext);
    const [pendingReviews, setPendingReviews] = useState<Review[]>([]);

    useEffect(() => {
        const fetchPendingReviews = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/reviews/pending', {
                    params: { userId: authContext.user._id }
                });
                setPendingReviews(response.data);
            } catch (error) {
                console.error('Failed to fetch pending reviews:', error);
            }
        };

        if (authContext.user?.role === 'admin') {
            fetchPendingReviews();
        }
    }, [authContext.user]);

    const handleApprove = async (reviewId: string) => {
        try {
            await axios.put(`http://localhost:5000/api/reviews/approve/${reviewId}`, {
                userId: authContext.user._id
            });
            setPendingReviews(pendingReviews.filter(review => review._id !== reviewId));
        } catch (error) {
            console.error('Failed to approve review:', error);
        }
    };

    if (!authContext.user || authContext.user.role !== 'admin') {
        return <div>Access denied.</div>;
    }

    return (
        <div className="container">
            <h1>Review Approval</h1>
            <ul className="list-group">
                {pendingReviews.map((review) => (
                    <li key={review._id} className="list-group-item review-item">
                        <p><strong>{review.userName}</strong> on {new Date(review.createdAt).toLocaleString()}</p>
                        <p>{review.review}</p>
                        <button className="btn btn-success" onClick={() => handleApprove(review._id)}>Approve</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Restricted;
