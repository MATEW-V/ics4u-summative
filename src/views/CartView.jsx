import { useStoreContext } from "../context";
import { Link } from "react-router-dom";
import style12 from "./CartView.module.css";
import { firestore } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

function CartView() {
  const { cart, setCart, user } = useStoreContext();

  const checkout = async () => {
    if (!cart.size) {
      alert("Your cart is empty!");
      return;
    }

    try {
      const docRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(docRef);
      const userData = userDoc.data();
      const userCart = userData.cart || []; 
      const updatedCart = [...userCart, ...Array.from(cart.values())]; 

      await setDoc(docRef, { cart: updatedCart }, { merge: true });

      setCart(new Map()); // Reset the cart after checkout

      alert("Thank You for your purchase.");
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("There was an error during checkout.");
    }
  };

  return (
    <div className={style12.appcontainer}>
      <div className={style12.nbar}>
        <div className={style12.icon}>
          <h2 className={style12.logo}>ACI Theatre</h2>
        </div>
        <div className={style12.menu}>
          <ul className={style12.navigation}>
            <li><Link to={`/`} className={style12.link}>HOME</Link></li>
            <li><a href="#">ABOUT</a></li>
            <li><a><Link to={`/settings`}>SETTINGS</Link></a></li>
            <li>
              <div className={style12.search}>
                <div className={style12.searchbox}>
                  <input type="text" placeholder="Search..." />
                </div>
                <button className={style12.butsearch}>Search</button>
              </div>
            </li>
            <li>
              <div className={style12.buttons}>
                <div className={style12.register}>
                  <Link to={`/movies/genre`} className={style12.button}>Back</Link>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className={style12.cartview}>
        <h1>{user.displayName}'s Shopping Cart</h1>
        <div className={style12.cartitems}>
          {
            Array.from(cart.entries()).map(([key, value]) => {
              return (
                <div className={style12.cartitem} key={key}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${value.poster_path}`}
                    alt={value.title}
                  />
                  <h1>{value.title}</h1>
                  <button onClick={() => setCart((prevCart) => {
                    const newCart = new Map(prevCart);
                    newCart.delete(key);
                    return newCart;
                  })}>Remove</button>
                </div>
              );
            })
          }
        </div>

        <button className={style12.checkoutButton} onClick={checkout}>
          Checkout
        </button>
      </div>
    </div>
  );
}

export default CartView;
