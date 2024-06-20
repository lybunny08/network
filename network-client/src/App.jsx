import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ProgressBar } from 'react-bootstrap';
import Sidebar from './components/Sidebar';
import Home from './views/Home';
import Search from './views/Search';
import Discover from './views/Discover';
import Reels from './views/Reels';
import Messages from './views/Messages';
import Notifications from './views/Notifications';
import Create from './views/Create';
import Profil from './views/Profil';
import SplashScreen from './views/SplashScreen';
import CreateModal from './components/CreateModal';

function App() {
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleHideModal = () => setShowModal(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      {loading ? (
        <SplashScreen />
      ) : (
        <>
          <PageLoader />
          <div className="d-flex">
            <Sidebar handleShowModal={handleShowModal} />
            <div className="flex-grow-1" style={{ marginLeft: '340px', paddingTop: '0', marginTop: '0' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/reels" element={<Reels />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/create" element={<Create />} />
                <Route path="/profil" element={<Profil />} />
              </Routes>
              {showModal && <CreateModal show={showModal} onHide={handleHideModal} />}
            </div>
          </div>
        </>
      )}
    </Router>
  );
}

const PageLoader = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startLoading = () => {
      setLoading(true);
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(interval);
            setLoading(false);
            return 100;
          }
          return prevProgress + 5;
        });
      }, 100);

      return () => clearInterval(interval);
    };

    startLoading();
  }, [location]);

  return loading ? (
    <ProgressBar
      now={progress}
      variant="primary"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        zIndex: 1000,
      }}
    />
  ) : null;
};

export default App;
