import { useStoreContext } from "../context";
import { Link } from "react-router-dom";
import style12 from "./CartView.module.css";
import { firestore } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

function CartView() {
  const { cart, setCart, user } = useStoreContext();

  const checkout = async () => {
    const docRef = doc(firestore, "users", user.uid);
    const data = (await getDoc(docRef)).data();
    const readCart = Map(data);
  }

  return (
    <div className={style12.appcontainer}>
      <div className={style12.nbar}>
            <div className={style12.icon}>
                <h2 className={style12.logo}>ACI Theatre</h2>
            </div>
            <div className={style12.menu}>
                <ul className={style12.navigation}>
                    <li><a><Link to={`/`}>HOME</Link></a></li>
                    <li><a href="#">ABOUT</a></li>
                    <li><a href="#">SETTINGS</a></li>
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
                            <div className={style12.login}>
                                <button onClick={() => checkout()}>Checkout</button>
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
          cart.entrySeq().map(([key, value]) => {
            return (
              <div className={style12.cartitem} key={key}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${value.poster_path}`}
                  alt={value.title}
                />
                <h1>{value.title}</h1>
                <button onClick={() => setCart((prevCart) => prevCart.delete(key))}>Remove</button>
              </div>
            );
          })
        }
      </div>
    </div>
    </div>
  );
}

export default CartView;
