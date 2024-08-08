import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../App';
import axios from 'axios';

const Profile: React.FC = () => {
    const authContext = useContext(AuthContext);
    const [name, setName] = useState(authContext?.user?.name || '');
    const [email, setEmail] = useState(authContext?.user?.email || '');
    const [reviews, setReviews] = useState<any[]>([]);
    const [followers, setFollowers] = useState<string[]>([]);
    const [following, setFollowing] = useState<string[]>([]);

    useEffect(() => {
        if (authContext?.user) {
            axios.get(`http://localhost:5000/api/reviews?userId=${authContext.user.email}`)
                .then(response => setReviews(response.data))
                .catch(error => console.error('Failed to fetch reviews:', error));

            axios.get(`http://localhost:5000/api/followers?userId=${authContext.user.email}`)
                .then(response => setFollowers(response.data))
                .catch(error => console.error('Failed to fetch followers:', error));

            axios.get(`http://localhost:5000/api/following?userId=${authContext.user.email}`)
                .then(response => setFollowing(response.data))
                .catch(error => console.error('Failed to fetch following:', error));
        }
    }, [authContext?.user]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value);
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);

    if (!authContext?.user) {
        return <div className="container">You need to log in to view your profile information.</div>;
    }

    const handleSave = () => {
        if (!authContext.user) return;
        axios.put('http://localhost:5000/api/users', {
            userId: authContext.user.email,
            name,
            email
        })
            .then(response => {
                console.log('User info saved:', response.data);
                if (authContext.user) {
                    authContext.setUser({ ...authContext.user, name, email, role: authContext.user.role });
                }
            })
            .catch(error => console.error('Failed to save user info:', error));
    };

    return (
        <div className="container">
            <header>
                <h1>Profile</h1>
            </header>
            <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input type="text" className="form-control" id="name" value={name} onChange={handleNameChange} />
            </div>
            <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input type="email" className="form-control" id="email" value={email} onChange={handleEmailChange} />
            </div>
            <button className="btn btn-primary" onClick={handleSave}>Save</button>
            <div style={{ marginTop: '20px' }}>
                <h2>Reviews</h2>
                <ul className="list-group">
                    {reviews.map((review, index) => (
                        <li key={index} className="list-group-item">
                            <a href={`/details/${review.movieId}`}>{review.movieTitle}</a>: {review.review}
                        </li>
                    ))}
                </ul>
            </div>
            <div style={{ marginTop: '20px' }}>
                <h2>Followers</h2>
                <ul className="list-group">
                    {followers.map((follower, index) => (
                        <li key={index} className="list-group-item">
                            <a href={`/profile/${follower}`}>{follower}</a>
                        </li>
                    ))}
                </ul>
            </div>
            <div style={{ marginTop: '20px' }}>
                <h2>Following</h2>
                <ul className="list-group">
                    {following.map((followed, index) => (
                        <li key={index} className="list-group-item">
                            <a href={`/profile/${followed}`}>{followed}</a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Profile;
