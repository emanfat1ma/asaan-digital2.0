import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Poochna from './pages/Poochna';
import Seekhna from './pages/Seekhna';
import Impact from './pages/Impact';
import About from './pages/About';
import Admin from './pages/Admin';
import TutorialDetail from './pages/TutorialDetail';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminContent from './pages/AdminContent';
import CategoryExplore from './pages/CategoryExplore';
import TutorialQuiz from './pages/TutorialQuiz';
import VoiceSearch from './components/VoiceSearch';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  useEffect(() => {
    // Navbar scroll effect
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar');
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
          navbar.style.background = 'rgba(255, 255, 255, 0.96)';
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="pattern-bg"></div>
      <ScrollToTop />
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/poochna" element={<Poochna />} />
          <Route path="/seekhna" element={<Seekhna />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/about" element={<About />} />
          <Route path="/tutorial/:id" element={<TutorialDetail />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/content" element={<AdminContent />} />
          <Route path="/seekhna" element={<Seekhna />} />
          <Route path="/seekhna/:category" element={<CategoryExplore />} />
          <Route path="/tutorial/:id/quiz" element={<TutorialQuiz />} />
        </Routes>
      </main>
      <Footer />
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#0d3320',
            color: '#fff',
            borderRadius: '0',
            border: '2px solid #0a0a0a',
          },
        }}
      />
      <VoiceSearch />
    </>
  );
}

export default App;
