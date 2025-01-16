import './App.css';
import Header from './components/Header/Header.js';
import Footer from './components/Footer/Footer.js';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './screens/LandingPage/LandingPage.js';
import AboutPage from './screens/AboutPage/AboutPage.js';
import ContactPage from './screens/ContactPage/ContactPage.js';
import RegisterPage from './screens/RegisterPage/RegisterPage.js';
import LoginPage from './screens/LoginPage/LoginPage.js';
import DashboardPage from './screens/Dashboard/Dashboard.js';

const App = () => (
  <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <main style={{ flex: 1 }}>
              <Routes>
                  <Route path="/" element={<LandingPage />} exact />
                  <Route path="/login" element={<LoginPage />} exact />
                  <Route path="/register" element={<RegisterPage />} exact />
                  <Route path="/contact" element={<ContactPage />} exact />
                  <Route path="/about" element={<AboutPage />} exact />
                  <Route path="/dashboard" element={<DashboardPage />} exact />
              </Routes>
          </main>
          <Footer />
      </div>
  </BrowserRouter>
);
export default App;