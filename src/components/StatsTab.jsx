import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import apiService from "../services/api";

export default function StatsTab({ user }) {
  const [carbonSaved, setCarbonSaved] = useState(0);
  const [sessionStats, setSessionStats] = useState(null);
  const [globalStats, setGlobalStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [user]); // Reload when user changes

  const loadStats = async () => {
    try {
      setIsLoading(true);
      
      if (user) {
        // Load user-specific stats if logged in
        const sessionData = await apiService.getSessionStats();
        if (sessionData.success) {
          setSessionStats(sessionData.data);
          setCarbonSaved(sessionData.data.sessionStats.totalCarbonSaved);
        }
      } else {
        // Clear user stats if not logged in
        setSessionStats(null);
        setCarbonSaved(0);
      }

      // Always load global stats
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

  // Show global stats for anonymous users
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-6">
        {/* Sign-in prompt */}
        <div className="card text-center w-full max-w-md">
          <div className="text-gray-400 text-6xl mb-4">📊</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Sign In to Track Your Impact</h3>
          <p className="text-gray-600 mb-4">
            Sign in to save your optimizations and track your personal carbon savings!
          </p>
          <p className="text-sm text-gray-500">
            Your optimizations will be saved when you're signed in.
          </p>
        </div>

        {/* Global Statistics - Always show */}
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
