import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import OptimizeTab from "./components/OptimizeTab";
import StatsTab from "./components/StatsTab";
import AboutTab from "./components/AboutTab";
import HistoryTab from "./components/HistoryTab";
import "./index.css"; // use index.css for global styles

const tabs = [
  { key: "optimize", label: "Optimize" },
  { key: "stats", label: "Stats" },
  { key: "history", label: "History" },
  { key: "about", label: "About Us" },
];

function App() {
  const [activeTab, setActiveTab] = useState("optimize");
  
  // Shared state for OptimizeTab to preserve data when switching tabs
  const [optimizeState, setOptimizeState] = useState({
    messages: [],
    tokensBefore: 0,
    tokensAfter: 0,
    carbonSaved: 0,
    totalCarbonSaved: 0,
    sessionStats: null
  });

  const renderTab = () => {
    switch (activeTab) {
      case "optimize":
        return <OptimizeTab 
          state={optimizeState} 
          setState={setOptimizeState} 
        />;
      case "stats":
        return <StatsTab />;
      case "history":
        return <HistoryTab />;
      case "about":
        return <AboutTab />;
      default:
        return <OptimizeTab 
          state={optimizeState} 
          setState={setOptimizeState} 
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
        <nav>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`nav-btn ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
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
    </div>
  );
}

export default App;