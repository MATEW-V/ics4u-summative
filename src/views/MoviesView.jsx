import { Outlet, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import style9 from "./MoviesView.module.css";
import { useStoreContext } from "../context";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useEffect } from "react";

function MoviesView() {
  const navigate = useNavigate();
  const { user, setUser, setCart, cart: contextCart } = useStoreContext();  // Destructure 'cart' as 'contextCart'

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

  // Navigate to Cart page
  function cart() {
    navigate("/cart");
  }

  // Fetch the user's cart from localStorage on login
  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(user.uid);
      if (savedCart) {
        const cartData = new Map(JSON.parse(savedCart));
        setCart(cartData); // Set the context cart with saved data
      }
    }
  }, [user, setCart]);

  return (
    <div className={style9.appcontainer}>
      <div className={style9.header}>
        <div className={style9.nbar}>
          <div className={style9.icon}>
            <h2 className={style9.logo}>ACI Theatre</h2>
          </div>
          <div className={style9.menu}>
            <ul className={style9.navigation}>
              <li><a><Link to={`/`}>HOME</Link></a></li>
              <li><a href="#">ABOUT</a></li>
              <li><a><Link to={`/settings`}>SETTINGS</Link></a></li>
              <li>
                <div className={style9.search}>
                  <div className={style9.searchbox}>
                    <input type="text" placeholder="Search..." />
                  </div>
                  <button className={style9.butsearch}>Search</button>
                </div>
              </li>
              <li>
                <div className={style9.buttons}>
                  <div className={style9.register}>
                    <button onClick={() => cart()} className={style9.button}>Cart</button>
                  </div>
                </div>
              </li>
              <li>
                <div className={style9.buttons}>
                  <div className={style9.login}>
                    <button onClick={() => logout()} className={style9.button}>Logout</button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default MoviesView;