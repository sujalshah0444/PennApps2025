import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import apiService from "../services/api";

export default function HistoryTab({ user }) {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadHistory();
  }, [user]); // Reload when user changes

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Loading history for session:', apiService.sessionId);
      const response = await apiService.getOptimizationHistory(1, 10);
      console.log('History response:', response);
      
      if (response.success) {
        setHistory(response.data || []);
      } else {
        console.error('API returned error:', response);
        setError(response.message || 'Failed to load history');
      }
    } catch (err) {
      console.error('Error loading history:', err);
      setError(`Failed to load optimization history: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-6">
        <div className="card text-center w-full max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading optimization history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-6">
        <div className="card text-center w-full max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Error Loading History</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={loadHistory}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-6">
        <div className="card text-center w-full max-w-md">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {user ? "No History Yet" : "Sign In Required"}
          </h3>
          <p className="text-gray-600 mb-4">
            {user ? "Start optimizing prompts to see your history here!" : "Sign in to save and view your optimization history!"}
          </p>
          <p className="text-sm text-gray-500">
            {user ? "Go to the Optimize tab to get started." : "Your optimizations will be saved when you're signed in."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto p-6 space-y-6">
      <motion.div
        className="card text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          📚 Optimization History
        </h2>
        <p className="text-gray-600">
          {history.length} optimizations found
        </p>
      </motion.div>

      <div className="space-y-4">
        {history.map((item, index) => (
          <motion.div
            key={item._id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card hover:shadow-lg transition-shadow duration-300"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-1">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <span className="text-yellow-600 mr-2">📝</span>
                    Original Prompt
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {item.originalPrompt}
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    {item.tokensBefore} tokens
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <span className="text-green-600 mr-2">✨</span>
                    Optimized Prompt
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {item.optimizedPrompt}
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    {item.tokensAfter} tokens
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <span className="text-blue-600 mr-2">📊</span>
                    Statistics
                  </h4>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tokens Saved:</span>
                      <span className="font-semibold text-green-600">
                        {item.tokensSaved}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">CO₂ Saved:</span>
                      <span className="font-semibold text-green-600">
                        {item.carbonSaved?.toFixed(6)}g
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quality Score:</span>
                      <span className="font-semibold text-blue-600">
                        {(item.qualityScore * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}