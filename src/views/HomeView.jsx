import Hero from "./components/Hero.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Feature from "./components/Feature.jsx"
import style5 from "./HomeView.module.css";

function HomeView() {
  return (
    <div className={style5.main}>
      <div className={style5.navbar}>
        <Header />
      </div>
      <div className={style5.herocontent}>
        <Hero />
      </div>
      <div className={style5.featurerand}>
        <Feature />
      </div>
      <div className={style5.footer}>
        <Footer />
      </div>
    </div>
  )

}

export default HomeView;