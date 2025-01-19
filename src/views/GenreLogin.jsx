import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { useStoreContext } from "../context";
import Footer from "./components/Footer.jsx";
import style6 from "./GenreLogin.module.css";
import GenreView from "./components/GenreView.jsx";
import { firestore } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

function GenreLogin() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedGenreId, setSelectedGenreId] = useState(28);
  const [userGenres, setUserGenres] = useState(new Map());
  const [userName, setUserName] = useState(""); // State to store the user's name
  const [userCart, setUserCart] = useState(new Set()); // State for user's cart in Firestore
  const { cart, user, addToCart, genres } = useStoreContext();

  function logout() {
    if (user) {
      // Optionally clear the cart from localStorage on logout
      // localStorage.removeItem(user.uid); // Uncomment if you want to clear the cart on logout
      console.log("User data removed from localStorage");
    }

    signOut(auth)
      .then(() => {
        setUser(null);          // Clear user context
        setCart(new Map());     // Clear cart context

        navigate("/");         // Redirect to home page
        console.log("Logged out successfully");
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
  }
  const cartAdd = (movie) => {
    if (userCart.has(movie.id)) {
      alert("This movie is already in your Firestore cart.");
    } else {
      addToCart(movie); // Update local state if movie is not in Firestore cart
    }
  };

  const readUserData = async () => {
    try {
      const docRef = doc(firestore, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("User data from Firestore:", data);

        // Update genres
        if (Array.isArray(data.genres)) {
          setUserGenres(new Map(data.genres.map(genre => [genre.id, genre.name])));
        } else if (data.genres instanceof Object) {
          setUserGenres(new Map(Object.entries(data.genres)));
        }

        // Update the user's name
        if (data.firstName && data.lastName) {
          setUserName(`${data.firstName} ${data.lastName}`);
        } else if (user.displayName) {
          setUserName(user.displayName);
        }

        // Update the user's cart from Firestore (as a Set for fast lookup)
        if (data.cart) {
          setUserCart(new Set(data.cart.map((movie) => movie.id))); // Assuming `data.cart` is an array of movie objects
        }
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching user data from Firestore: ", error);
    }
  };

  useEffect(() => {
    const fetchMovies = async () => {
      const url = selectedGenreId
        ? `https://api.themoviedb.org/3/discover/movie?api_key=be3c7266366ad88b56a8397a0a3e668d&with_genres=${selectedGenreId}`
        : `https://api.themoviedb.org/3/discover/movie?api_key=be3c7266366ad88b56a8397a0a3e668d&with_genres=28`;

      const response = await axios.get(url);
      setMovies(response.data.results);
    };

    fetchMovies();
    if (user && user.uid) {
      readUserData(); // Load user data including cart
    }
  }, [selectedGenreId, user]);

  const getMoviesByPage = async (page) => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=be3c7266366ad88b56a8397a0a3e668d&with_genres=${selectedGenreId}&page=${page}`
    );
    setMovies(response.data.results);
  };

  const handleGenreClick = (genreId) => {
    setSelectedGenreId(genreId);
  };

  return (
    <div className={style6.appcontainer}>
      <div className={style6.loginfeat}>
        <div className={style6.welcome}>
          Welcome {userName}! We hope you find what you are looking for.
        </div>
        <div className={style6.genrelist}>
          <GenreView genresList={userGenres.size > 0 ? userGenres : genres} onGenreClick={handleGenreClick} />
          <div className={style6.spacer}></div>
          <div className={style6.pageturner}>
            <p>
              <a
                onClick={() => {
                  if (page > 1) {
                    setPage(page - 1);
                    getMoviesByPage(page - 1);
                  }
                }}
              >
                Previous Page<br />
              </a>
              <a
                onClick={() => {
                  if (page < 50) {
                    setPage(page + 1);
                    getMoviesByPage(page + 1);
                  }
                }}
              >
                Next Page
              </a>
            </p>
            <p>Page {page}<br /></p>
          </div>
        </div>

        <div className={style6.genredisp}>
          {movies.map((movie) => (
            <div className={style6.moviecard} key={movie.id}>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className={style6.movieposter}
              />
              <h3>{movie.title}</h3>

              <div className={style6['button-container']}>
                <Link to={`/movies/${movie.id}`} className={style6.dbutton}>Details</Link>
                
                <div
                  onClick={() => cartAdd(movie)}
                  className={style6.buybut}
                  style={{
                    opacity: userCart.has(movie.id) ? 0.5 : (cart.has(movie.id) ? 0.5 : 1), 
                    pointerEvents: userCart.has(movie.id) ? 'none' : (cart.has(movie.id) ? 'none' : 'auto')
                  }}
                >
                  {userCart.has(movie.id)
                    ? "Bought"
                    : (cart.has(movie.id) ? "Added" : "Buy")}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={style6.footer}>
        <Footer />
      </div>
    </div>
  );
}

export default GenreLogin;