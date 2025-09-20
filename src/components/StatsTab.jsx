import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import apiService from "../services/api";

export default function StatsTab() {
  const [carbonSaved, setCarbonSaved] = useState(0);
  const [sessionStats, setSessionStats] = useState(null);
  const [globalStats, setGlobalStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      
      // Load session stats
      const sessionData = await apiService.getSessionStats();
      if (sessionData.success) {
        setSessionStats(sessionData.data);
        setCarbonSaved(sessionData.data.sessionStats.totalCarbonSaved);
      }

      // Load global stats
      const globalData = await apiService.getGlobalStats();
      if (globalData.success) {
        setGlobalStats(globalData.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-6">
        <div className="card text-center w-full max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-6">
      {/* Session Stats */}
      <motion.div
        className="card text-center w-full max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          🌱 Your Carbon Savings
        </h2>
        <p className="text-3xl font-extrabold text-green-600">
          {carbonSaved.toFixed(2)} gCO₂ saved
        </p>
        {sessionStats && (
          <p className="text-sm text-gray-500 mt-2">
            {sessionStats.sessionStats.totalPromptsOptimized} prompts optimized
          </p>
        )}
      </motion.div>

      {/* Session Statistics */}
      {sessionStats && (
        <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="card text-center"
          >
            <p className="text-lg font-semibold text-gray-800">Prompts Optimized</p>
            <p className="text-xl font-bold text-green-500">
              {sessionStats.sessionStats.totalPromptsOptimized}
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="card text-center"
          >
            <p className="text-lg font-semibold text-gray-800">Tokens Saved</p>
            <p className="text-xl font-bold text-green-500">
              {sessionStats.sessionStats.totalTokensSaved}
            </p>
          </motion.div>
        </div>
      )}

      {/* Global Statistics */}
      {globalStats && (
        <motion.div
          className="card w-full max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
            🌍 Global Impact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {globalStats.totalOptimizations.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Total Optimizations</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {globalStats.totalCarbonSaved.toFixed(2)}g
              </p>
              <p className="text-sm text-gray-600">CO₂ Saved Globally</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {globalStats.totalTokensSaved.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Tokens Saved</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
