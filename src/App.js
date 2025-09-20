import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import OptimizeTab from "./components/OptimizeTab";
import StatsTab from "./components/StatsTab";
import AboutTab from "./components/AboutTab";
import "./index.css"; // use index.css for global styles

const tabs = [
  { key: "optimize", label: "Optimize" },
  { key: "stats", label: "Stats" },
  { key: "about", label: "About Us" },
];

function App() {
  const [activeTab, setActiveTab] = useState("optimize");

  const renderTab = () => {
    switch (activeTab) {
      case "optimize":
        return <OptimizeTab />;
      case "stats":
        return <StatsTab />;
      case "about":
        return <AboutTab />;
      default:
        return <OptimizeTab />;
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