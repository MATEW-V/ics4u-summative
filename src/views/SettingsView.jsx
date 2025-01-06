import { useState, useEffect } from "react";
import { useStoreContext } from "../context";
import style13 from "./SettingsView.module.css";
import { useNavigate } from 'react-router-dom';

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

function SettingsView() {
    const { email, fname, lname, genres, setFirst, setLast, setGenres } = useStoreContext();
    const [newFname, setNewFname] = useState(fname);
    const [newLname, setNewLname] = useState(lname);
    const [selectedGenres, setSelectedGenres] = useState(new Map());
    const navigate = useNavigate();

    useEffect(() => {
        const initGenres = new Map();
        genres.forEach((value, key) => {
            initGenres.set(key, value);
        });
        setSelectedGenres(initGenres);
    }, [genres]);

    const handleGenreChange = (event) => {
        const genreId = event.target.value;
        const genreName = event.target.name;

        const updatedSelectedGenres = new Map(selectedGenres);

        if (event.target.checked) {
            updatedSelectedGenres.set(genreId, genreName);
        } else {
            updatedSelectedGenres.delete(genreId);
        }

        setSelectedGenres(updatedSelectedGenres);
    };

    const handleSaveChanges = () => {
        setFirst(newFname);
        setLast(newLname);
        setGenres(selectedGenres);
        alert("Settings updated successfully!");
        navigate('/movies/genre');
    };

    return (
        <div className={style13.appcontainer}>
            <h1>Welcome {fname} {lname}, Email: {email}</h1>

            <div className={style13.formContainer}>
                <div className={style13.formGroup}>
                    <label>Edit First Name:</label>
                    <input
                        type="text"
                        value={newFname}
                        onChange={(e) => setNewFname(e.target.value)}
                    />
                </div>

                <div className={style13.formGroup}>
                    <label>Edit Last Name:</label>
                    <input
                        type="text"
                        value={newLname}
                        onChange={(e) => setNewLname(e.target.value)}
                    />
                </div>

                <div className={style13.genresContainer}>
                    <h3>Choose Your Genres</h3>
                    <div className={style13.checkboxContainer}>
                        {availableGenres.map((genre) => (
                            <div key={genre.id}>
                                <input
                                    type="checkbox"
                                    id={genre.name}
                                    name={genre.name}
                                    value={genre.id}
                                    checked={selectedGenres.has(genre.id)}
                                    onChange={handleGenreChange}
                                />
                                <label htmlFor={genre.name}>{genre.name}</label>
                            </div>
                        ))}
                    </div>
                </div>

                <button className={style13.saveButton} onClick={handleSaveChanges}>
                    Save Changes
                </button>
            </div>
        </div>
    );
}

export default SettingsView;
