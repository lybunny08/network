// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './views/Home';
import Search from './views/Search';
import Discover from './views/Discover';
import Reels from './views/Reels';
import Messages from './views/Messages';
import Notifications from './views/Notifications';
import Creat from './views/Creat';
import Profil from './views/Profil';

function App() {
  return (
    <Router>
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/reels" element={<Reels />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/creat" element={<Creat />} />
            <Route path="/profil" element={<Profil />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;