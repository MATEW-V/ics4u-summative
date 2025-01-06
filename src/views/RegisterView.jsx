import style10 from "./RegisterView.module.css";
import { useStoreContext } from '../context';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterView() {
  const { setEmail: setContextEmail, setFirst, setLast, setPassword: setContextPassword, setGenres } = useStoreContext();
  const [email, setEmail] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [password, setPassword] = useState('');
  const [verifpass, setVerifpass] = useState('');
  const [selectedGenres, setSelectedGenres] = useState(new Map()); // Use a Map to store genre selections
  const navigate = useNavigate();

  const availableGenres = [
    { id: "28", name: "Action" },
    { id: "12", name: "Adventure" },
    { id: "16", name: "Animation" },
    { id: "80", name: "Crime" },
    { id: "35", name: "Comedy" },
    { id: "27", name: "Horror" },
    { id: "36", name: "History" },
    { id: "14", name: "Fantasy" },
    { id: "53", name: "Thriller" },
    { id: "37", name: "Western" },
    { id: "10751", name: "Family" },
    { id: "10402", name: "Music" },
    { id: "10752", name: "War" },
    { id: "9648", name: "Mystery" },
    { id: "878", name: "Sci-Fi" }
  ];

  const handleGenreChange = (event) => {
    const genreId = event.target.value;
    const genreName = event.target.dataset.name;

    setSelectedGenres(prevSelectedGenres => {
      const newGenres = new Map(prevSelectedGenres); 
      if (newGenres.has(genreId)) {
        newGenres.delete(genreId); 
      } else {
        newGenres.set(genreId, genreName); 
      }
      return newGenres;
    });
  };

  function signup(event) {
    event.preventDefault();

    if (password !== verifpass) {
      alert("Passwords do not match!");
      return;
    }

    if (selectedGenres.size < 10) {
      alert("Please select at least 10 genres.");
      return;
    }

    setFirst(fname);
    setLast(lname);
    setContextEmail(email);
    setContextPassword(password);
    setGenres(selectedGenres);  
    navigate('/movies/genre');
  }

  return (
    <div className={style10.body}>
      <div className={style10.genrecontainer}>
        <div className={style10.genreselect}>
          <h2>Select Your Preferred Genres</h2>
          {availableGenres.map((genre) => (
            <div key={genre.id}>
              <input
                type="checkbox"
                id={genre.id}
                value={genre.id}
                data-name={genre.name}  
                checked={selectedGenres.has(genre.id)}  
                onChange={handleGenreChange}
              />
              <label htmlFor={genre.id}>{genre.name}</label><br />
            </div>
          ))}
        </div>
      </div>
      <div className={style10.logincontainer}>
        <div className={style10.formcontainer}>
          <h2>Create an Account</h2>
          <form onSubmit={signup}>
            <label htmlFor="text">First name</label>
            <input
              type="text"
              id="text"
              name="text"
              value={fname}
              onChange={(e) => setFname(e.target.value)}
              required
            />
            <label htmlFor="text">Last Name</label>
            <input
              type="text"
              id="text"
              name="text"
              value={lname}
              onChange={(e) => setLname(e.target.value)}
              required
            />
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="spassword">Re-enter Password</label>
            <input
              type="password"
              id="spassword"
              name="spassword"
              value={verifpass}
              onChange={(e) => setVerifpass(e.target.value)}
              required
            />
            <button type="submit" className={style10.loginbutton}>Sign Up</button>
          </form>
          <p className={style10.registerlink}>Already have an Account? <a href="#">Login Here</a></p>
        </div>
      </div>
    </div>
  );
}

export default RegisterView;
