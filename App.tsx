
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import PublicDashboard from './pages/PublicDashboard';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Overview from './pages/Dashboard/Overview';
import Sensors from './pages/Dashboard/Sensors';
import Management from './pages/Dashboard/Management';
import UserFields from './pages/Dashboard/UserFields';
import FeaturesPublic from './pages/FeaturesPublic';
import HowItWorks from './pages/HowItWorks';

import { User } from './types';

const App: React.FC = () => {
  // Initialize state from localStorage to persist session
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('agricare_session');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('agricare_session') !== null;
  });

  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) return hash;
    // If logged in, default to dashboard, otherwise home
    return localStorage.getItem('agricare_session') ? 'dashboard' : 'home';
  });

  // Handle browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setActiveTab(hash);
      } else {
        const defaultTab = isLoggedIn ? 'dashboard' : 'home';
        setActiveTab(defaultTab);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Sync initial state with hash if present
    if (window.location.hash) {
      handleHashChange();
    } else {
      // Set initial hash if empty
      window.location.hash = activeTab;
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isLoggedIn, activeTab]);

  // Wrapper for navigation to update hash
  const navigateTo = (tab: string) => {
    window.location.hash = tab;
  };

  const handleLogin = (user: User) => {
    localStorage.setItem('agricare_session', JSON.stringify(user));
    setCurrentUser(user);
    setIsLoggedIn(true);
    navigateTo('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('agricare_session');
    setCurrentUser(null);
    setIsLoggedIn(false);
    navigateTo('home');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Home onGetStarted={() => navigateTo('signup')} />;
      case 'features-public': return <FeaturesPublic onNavigate={navigateTo} />;
      case 'how-it-works': return <HowItWorks />;
      case 'public-dashboard': return <PublicDashboard />;
      case 'pricing': return <Pricing />;
      case 'login': return <Login onLogin={handleLogin} onSwitchToSignup={() => navigateTo('signup')} />;
      case 'signup': return <Signup onSignup={handleLogin} onSwitchToLogin={() => navigateTo('login')} />;
      
      // Auth Protected
      case 'dashboard': return isLoggedIn ? <Overview user={currentUser!} /> : <Login onLogin={handleLogin} onSwitchToSignup={() => navigateTo('signup')} />;
      case 'fields': return isLoggedIn ? <UserFields user={currentUser!} /> : <Login onLogin={handleLogin} onSwitchToSignup={() => navigateTo('signup')} />;
      case 'management': return isLoggedIn ? <Management user={currentUser!} /> : <Login onLogin={handleLogin} onSwitchToSignup={() => navigateTo('signup')} />;
      case 'sensors': return isLoggedIn ? <Sensors user={currentUser!} /> : <Login onLogin={handleLogin} onSwitchToSignup={() => navigateTo('signup')} />;
      
      default: return <Home onGetStarted={() => navigateTo('signup')} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={navigateTo} 
        isLoggedIn={isLoggedIn} 
        onLogout={handleLogout} 
      />
      
      <main className="flex-grow">
        {renderContent()}
      </main>

      <Footer onNavigate={navigateTo} />
    </div>
  );
};

export default App;
