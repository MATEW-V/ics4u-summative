import style1 from "./Feature.module.css";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';

function Feature() {
    const [movies, setMovies] = useState([]);
    const randmovie = Math.floor(Math.random() * 12);
    const randpage = Math.floor(Math.random() * 20);
    const apiUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=be3c7266366ad88b56a8397a0a3e668d&language=en-US&page=` + randpage;

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch(apiUrl);
                const data = await response.json();
                setMovies(data.results.slice(randmovie, randmovie + 4)); // random movie then next six
            } catch (error) {
                setError('Failed to fetch movies');
            }};
        fetchMovies();
    }, []);

    return (
        <div className={style1.feature}>
            <div className={style1.nplay}>
                <h1>Now Playing</h1>
                <p>Check out the latest movies in theaters!</p>
            </div>
            <div className={style1.moviecontainer}>
                {movies.map((movie) => {
                    const movieImage = movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : 'https://via.placeholder.com/500x750?text=No+Image';

                    return (
                        <div className={style1.moviebox} key={movie.id}>
                            <img className={style1.movieposter} src={movieImage} alt={movie.title} />
                            <h3>{movie.title}</h3>
                            <div className={style1.detailbut}>
                                <Link to={`/movies/` + movie.id} className={style1.dbutton}>Details</Link>
                            </div>
                        </div>
                    )})}
            </div>
        </div>
    )
}

export default Feature;