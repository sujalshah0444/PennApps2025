import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import OptimizeTab from "./components/OptimizeTab";
import StatsTab from "./components/StatsTab";
import AboutTab from "./components/AboutTab";
import HistoryTab from "./components/HistoryTab";
import AuthModal from "./components/AuthModal";
import apiService from "./services/api";
import "./index.css"; // use index.css for global styles

const tabs = [
  { key: "optimize", label: "Optimize" },
  { key: "stats", label: "Stats" },
  { key: "history", label: "History" },
  { key: "about", label: "About Us" },
];

function App() {
  const [activeTab, setActiveTab] = useState("optimize");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(null);
  
  // Shared state for OptimizeTab to preserve data when switching tabs
  const [optimizeState, setOptimizeState] = useState({
    messages: [],
    tokensBefore: 0,
    tokensAfter: 0,
    carbonSaved: 0,
    totalCarbonSaved: 0,
    sessionStats: null
  });

  // Check authentication on app load
  useEffect(() => {
    const storedUser = apiService.user;
    if (storedUser) {
      setUser(storedUser);
    } else {
      // Clear any existing state if no user is logged in
      setOptimizeState({
        messages: [],
        tokensBefore: 0,
        tokensAfter: 0,
        carbonSaved: 0,
        totalCarbonSaved: 0,
        sessionStats: null
      });
    }
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setShowAuthModal(false);
  };

  const handleLogout = async () => {
    await apiService.logout();
    setUser(null);
    // Clear all chat history and state when logging out
    setOptimizeState({
      messages: [],
      tokensBefore: 0,
      tokensAfter: 0,
      carbonSaved: 0,
      totalCarbonSaved: 0,
      sessionStats: null
    });
  };

  const renderTab = () => {
    switch (activeTab) {
      case "optimize":
        return <OptimizeTab 
          state={optimizeState} 
          setState={setOptimizeState}
          user={user}
        />;
      case "stats":
        return <StatsTab user={user} />;
      case "history":
        return <HistoryTab user={user} />;
      case "about":
        return <AboutTab />;
      default:
        return <OptimizeTab 
          state={optimizeState} 
          setState={setOptimizeState}
          user={user}
        />;
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <motion.header
        className="navbar"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1 className="logo">🌍 Type-less</h1>
        <nav className="flex items-center space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`nav-btn ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
          
          {/* Auth Section */}
          <div className="flex items-center space-x-2 ml-4">
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  Welcome, {user.username}!
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </nav>
      </motion.header>

      {/* Tab Content */}
      <main className="tab-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderTab()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}

export default App;