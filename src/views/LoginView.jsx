import style8 from './LoginView.module.css';
import { useState, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoreContext } from '../context';  
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';

function LoginView() {
  const email = useRef('');
  const [upassword, setUPassword] = useState('');  
  const navigate = useNavigate();
  const { setUser } = useStoreContext();

  async function loginByEmail(event) {
    event.preventDefault();

    try {
      const user = (await signInWithEmailAndPassword(auth, email.current.value, upassword)).user;
      navigate('/movies/genre');
      setUser(user);
    } catch (error) {
      console.log(error);
      alert("Error signing in!");
      console.log(upassword);
    }
  }

  async function loginByGoogle() {
    try {
      const user = (await signInWithPopup(auth, new GoogleAuthProvider())).user;
      navigate('/movies/genre');
      setUser(user);
    } catch (error) {
      console.log(error);
      alert("Error signing in!");
      console.log(user);
    }
  }

  return (
    <div className={style8.body}>
      <div className={style8.logincontainer}>
        <div className={style8.formcontainer}>
          <h2>Login to Your Account</h2>
          <form onSubmit={(event) => { loginByEmail(event) }}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" ref={email} required />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={upassword} 
              onChange={(event) => setUPassword(event.target.value)} 
              required
            />
            <button type="submit" className={style8.loginbutton}>Login</button>
          </form>
          <button onClick={() => loginByGoogle()} type="submit" className="login-button">Login by Google</button>
          <p className={style8.registerlink}>New to ACI Theatre? <a href="#">Register now</a></p>
        </div>
      </div>
    </div>
  );
}

export default LoginView;
