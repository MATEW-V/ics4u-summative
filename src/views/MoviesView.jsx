import { Outlet, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import style9 from "./MoviesView.module.css";

function MoviesView() {
  const navigate = useNavigate();
  function logout() {
    navigate("/");
  }

  function cart() {
    navigate("/cart")
  }

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