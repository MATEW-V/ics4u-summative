import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from './context';
import HomeView from "../src/views/HomeView";
import RegisterView from "../src/views/RegisterView";
import LoginView from "../src/views/LoginView";
import MoviesView from "../src/views/MoviesView";
import CartView from "./views/CartView";
import GenreLogin from "../src/views/GenreLogin"
import SettingsView from "../src/views/SettingsView";
import DetailsView from "../src/views/DetailsView";
import './App.css'

function App() {
  return (
    <StoreProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/register" element={<RegisterView />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/cart" element={<CartView />} />
        <Route path="/settings" element={<SettingsView />} />
        <Route path="/movies" element={<MoviesView />}>
          <Route path="genre" element={<GenreLogin />} />
          <Route path=":id" element={<DetailsView />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </StoreProvider>
  )
}

export default App
