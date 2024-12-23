import './App.css';
import Header from './components/Header/Header.js';
import Footer from './components/Footer/Footer.js';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './screens/LandingPage/LandingPage.js';
import AboutPage from './screens/AboutPage/AboutPage.js';
import ContactPage from './screens/ContactPage/ContactPage.js';
import RegisterPage from './screens/RegisterPage/RegisterPage.js';
import LoginPage from './screens/LoginPage/LoginPage.js';

const App = () => (
  <BrowserRouter>
    <Header />
    <Routes>
        <Route path='/' element={<LandingPage />} exact/>
        <Route path='/login' element={<LoginPage />} exact />
        <Route path='/register' element={<RegisterPage />} exact />
        <Route path='/contact' element={<ContactPage />} exact />
        <Route path='/about' element={<AboutPage />} exact />
    </Routes>
    <main style={{minHeight: "93vh"}}>
    </main>
    <Footer />
  </BrowserRouter>
);

export default App;