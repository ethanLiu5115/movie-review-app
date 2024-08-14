import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';

const API_KEY = 'abd8a21';

interface SearchResult {
    imdbID: string;
    Title: string;
    Poster: string;
    Year: string;
}

const Search: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [resultCount, setResultCount] = useState(0);

    const location = useLocation();

    useEffect(() => {
        const savedQuery = sessionStorage.getItem('query');
        const savedResults = sessionStorage.getItem('results');
        const savedResultCount = sessionStorage.getItem('resultCount');

        if (savedQuery && savedResults && savedResultCount) {
            setQuery(savedQuery);
            setResults(JSON.parse(savedResults));
            setResultCount(Number(savedResultCount));
        }
    }, [location]);

    const handleSearch = async () => {
        try {
            setErrorMessage(''); // 清空之前的错误信息
            const response = await axios.get(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`);
            if (response.data.Response === "True") {
                setResults(response.data.Search || []);
                setResultCount(response.data.totalResults);

                // 将查询和结果存储到 sessionStorage
                sessionStorage.setItem('query', query);
                sessionStorage.setItem('results', JSON.stringify(response.data.Search || []));
                sessionStorage.setItem('resultCount', response.data.totalResults.toString());
            } else {
                setErrorMessage(response.data.Error);
                setResults([]);
                setResultCount(0);

                // 清除 sessionStorage 中的内容
                sessionStorage.removeItem('query');
                sessionStorage.removeItem('results');
                sessionStorage.removeItem('resultCount');
            }
        } catch (error) {
            console.error('Failed to fetch search results:', error);
            setErrorMessage('Failed to fetch search results. Please try again later.');
            setResults([]);
            setResultCount(0);

            // 清除 sessionStorage 中的内容
            sessionStorage.removeItem('query');
            sessionStorage.removeItem('results');
            sessionStorage.removeItem('resultCount');
        }
    };

    return (
        <div className="container">
            <h1>Search</h1>
            <div className="form-group">
                <input
                    type="text"
                    className="form-control"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for movies..."
                />
            </div>
            <button className="btn btn-primary" onClick={handleSearch} style={{ marginBottom: '10px' }}>Search</button>
            {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
            {resultCount > 0 && <div className="alert alert-info" role="alert" style={{ marginTop: '10px' }}>Found {resultCount} results.</div>}
            <ul className="list-group" style={{ marginTop: '20px' }}>
                {results.map((result, index) => (
                    <li key={index} className="list-group-item">
                        <Link to={`/details/${result.imdbID}`}>
                            <img src={result.Poster} alt={result.Title} style={{ width: '50px', marginRight: '10px' }} />
                            {result.Title} ({result.Year})
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Search;
