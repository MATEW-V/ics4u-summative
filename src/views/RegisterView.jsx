import style10 from "./RegisterView.module.css";
import { useStoreContext } from '../context';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";

function RegisterView() {
  const [email, setEmail] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [password, setPassword] = useState('');
  const [verifpass, setVerifpass] = useState('');
  const { setUser, genres, setGenres } = useStoreContext();
  const [selectedGenres, setSelectedGenres] = useState(new Map());
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
  const registerByEmail = async (event) => {
    event.preventDefault();
    if (password !== verifpass) {
      alert("Passwords do not match!");
      return;
    }

    if (selectedGenres.size < 10) {
      alert("Please select at least 10 genres.");
      return;
    }
   
    try {
      const user = (await createUserWithEmailAndPassword(auth, email, password)).user;
      await updateProfile(user, { displayName: `${fname} ${lname}` });
      setUser(user);
      navigate('/movies/genre');
      const selectgenrejs = Object.fromEntries(selectedGenres);
      const docRef = doc(firestore, "users", user.uid);
      await setDoc(docRef, {genres: selectgenrejs});

    // Code to read from Friestore
    // const docRef = doc(firestore, "users", user.uid);
    // const data = (await getDoc(docRef)).data();
    // const cart = Map(data);
      console.log(user);
    } catch (error) {
      console.log(error);
      alert("Error creating user.");
    }
  };

  const registerByGoogle = async () => {
    if (selectedGenres.size < 10) {
      alert("Please select at least 10 genres.");
      return;
    }
    try {
      const user = (await signInWithPopup(auth, new GoogleAuthProvider())).user;
      setUser(user);
      setGenres(selectedGenres);
      const selectgenrejs = Object.fromEntries(selectedGenres);
      const docRef = doc(firestore, "users", user.uid);
      await setDoc(docRef, {genres: selectgenrejs});
      navigate('/movies/genre');
    } catch (error){
      alert("Error creating user with demail and password!");
      console.log(error);
    }
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
          <form onSubmit={(e) => registerByEmail(e)}>
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
            <button  onClick={() => registerByEmail()}type="submit" className={style10.loginbutton}>Sign Up</button>
          </form>
          <p className={style10.registerlink}>Already have an Account? <a href="#">Login Here</a></p>
        <button onClick={() => registerByGoogle()} className={style10.registergbutton}>Register by Google</button>
        </div>
      </div>
    </div>
  );
}


export default RegisterView;
