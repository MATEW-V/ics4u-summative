import { useState, useEffect } from "react";
import { useStoreContext } from "../context";
import style13 from "./SettingsView.module.css";
import { useNavigate } from 'react-router-dom';
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firestore } from "../firebase";

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
    const { fname, lname, genres, setFirst, setLast, user } = useStoreContext();
    const [newFname, setNewFname] = useState(fname);
    const [newLname, setNewLname] = useState(lname);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [selectedGenres, setSelectedGenres] = useState(new Map());
    const [passwordError, setPasswordError] = useState('');
    const [cart, setCart] = useState([]); // State to hold the cart data
    const navigate = useNavigate();

    // Fetch the user's data and cart from Firestore
    useEffect(() => {
        const initGenres = new Map();
        genres.forEach((value, key) => {
            initGenres.set(key, value);
        });
        setSelectedGenres(initGenres);

        const fetchUserData = async () => {
            if (user) {
                try {
                    const docRef = doc(firestore, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        if (data.genres) {
                            const userGenres = new Map(Object.entries(data.genres));
                            setSelectedGenres(userGenres); // Set genres selected by the user
                        }

                        // Fetch cart data from Firestore
                        if (data.cart) {
                            setCart(data.cart); // Set the cart data from Firestore
                        }

                        // Set first and last name from Firestore if available
                        if (data.firstName) setNewFname(data.firstName);
                        if (data.lastName) setNewLname(data.lastName);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };

        fetchUserData(); // Fetch data when component mounts
    }, [genres, user]);

    // Handle genre checkbox changes (select/deselect)
    const handleGenreChange = async (event) => {
        const genreId = event.target.value;
        const genreName = event.target.name;
        const updatedSelectedGenres = new Map(selectedGenres);

        if (event.target.checked) {
            updatedSelectedGenres.set(genreId, genreName); // Add to selected genres
        } else {
            updatedSelectedGenres.delete(genreId); // Remove from selected genres
        }

        setSelectedGenres(updatedSelectedGenres); // Update the selected genres map
    };

    // Handle password change
    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            setPasswordError('Passwords do not match!');
            return;
        }

        const auth = getAuth();
        const userCred = auth.currentUser;

        const credential = EmailAuthProvider.credential(userCred.email, user.password);
        try {
            await reauthenticateWithCredential(userCred, credential);
            await updatePassword(userCred, newPassword);
            alert("Password updated successfully!");
        } catch (error) {
            console.log(error);
            console.error("Error updating password:", error);
            setPasswordError("Error updating password.");
        }
    };

    // Handle save changes for genres and other settings
    const handleSaveChanges = async () => {
        // If the user is logged in via Google, skip updating first/last name
        if (user.providerData[0].providerId === "google.com") {
            setNewFname(fname); // Keep the current first name
            setNewLname(lname); // Keep the current last name
        } else {
            // Only update names for users who are not authenticated via Google
            setFirst(newFname);
            setLast(newLname);
        }

        // Prepare the genres to save to Firestore
        const updatedGenres = Object.fromEntries(selectedGenres);

        try {
            const userRef = doc(firestore, "users", user.uid);
            await setDoc(userRef, {
                genres: updatedGenres, // Save selected genres to Firestore
                firstName: newFname, // Only update if not Google Auth
                lastName: newLname, // Only update if not Google Auth
            }, { merge: true });
            alert("Settings updated successfully!");
            navigate('/movies/genre');
        } catch (error) {
            console.error("Error updating Firestore:", error);
        }
    };

    return (
        <div className={style13.appcontainer}>
            <h1>Welcome {newFname} {newLname}, Email: {user.email}</h1>

            <div className={style13.formContainer}>
                {/* Conditionally Render First Name and Last Name Fields */}
                {user.providerData[0].providerId !== "google.com" && (
                    <>
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
                    </>
                )}

                {user.providerData[0].providerId === "password" && (
                    <div className={style13.formGroup}>
                        <label>Edit Password:</label>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                )}

                {user.providerData[0].providerId === "password" && (
                    <div className={style13.formGroup}>
                        <label>Confirm Password:</label>
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                )}
                {passwordError && <div className={style13.error}>{passwordError}</div>}

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
                                    checked={selectedGenres.has(genre.id)}  // Pre-select if the genre is in selectedGenres
                                    onChange={handleGenreChange} // Update on change (select or deselect)
                                />
                                <label htmlFor={genre.name}>{genre.name}</label>
                            </div>
                        ))}
                    </div>
                </div>

                <button className={style13.saveButton} onClick={handleSaveChanges}>
                    Save Changes
                </button>

                {user.providerData[0].providerId === "password" && (
                    <button className={style13.saveButton} onClick={handlePasswordChange}>
                        Update Password
                    </button>
                )}
            </div>

            {/* Display Cart as Tiles */}
            <div className={style13.cartContainer}>
                <h3>Previous Purchases:</h3>
                {cart.length > 0 ? (
                    <div className={style13.cartGrid}>
                        {cart.map((movie) => (
                            <div key={movie.id} className={style13.cartTile}>
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    alt={movie.title}
                                    className={style13.cartImage}
                                />
                                <h4 className={style13.cartTitle}>{movie.title}</h4>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Your cart is empty.</p>
                )}
            </div>
        </div>
    );
}

export default SettingsView;
