import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import style7 from "./DetailsView.module.css"
import Footer from "./components/Footer.jsx";

function DetailMovieView() {
  const [movie, setMovie] = useState([]);
  const params = useParams();

  useEffect(() => {
    (async function getMovie() {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${params.id}?api_key=be3c7266366ad88b56a8397a0a3e668d&append_to_response=videos`
      );
      setMovie(response.data);
    })();
  }, []);

  return (
    <div className={style7.appcontainer}>
      <div className={style7.moviedetail}>
        <h1 className={style7.movietitle}>{movie.original_title}</h1>
        <p className={style7.movieoverview}>{movie.overview}</p>
        <div className={style7.movieinfo}>
          <p><strong>Release Date:</strong> {movie.release_date}</p>
          <p><strong>Runtime:</strong> {movie.runtime} minutes</p>
          <p><strong>Origin Country:</strong> {movie.origin_country}</p>
          <p><strong>Budget:</strong> {movie.budget}$ N/A if 0</p>
        </div>
        {movie.poster_path && (
          <img
            className={style7.movieposter}
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.original_title}
          />
        )}
        <div className={style7.trailerssection}>
          <h2>Trailers</h2>
          <div className={style7.trailersgrid}>
            {movie.videos && movie.videos.results.map((trailer) => (
              <div key={trailer.id} className={style7.trailertile}>
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className={style7.trailerthumbnail}
                    src={`https://img.youtube.com/vi/${trailer.key}/0.jpg`}
                    alt={trailer.name}
                  />
                  <h3>{trailer.name}</h3>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={style7.footer}>
        <Footer />
      </div>
    </div>
  )
}

export default DetailMovieView;