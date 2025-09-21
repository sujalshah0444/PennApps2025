import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import apiService from "../services/api";

export default function StatsTab({ user }) {
  const [carbonSaved, setCarbonSaved] = useState(0);
  const [sessionStats, setSessionStats] = useState(null);
  const [globalStats, setGlobalStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Converter input
  const [converterInput, setConverterInput] = useState("");
  const [converterResult, setConverterResult] = useState(null);

  useEffect(() => {
    loadStats();
  }, [user]);

  const loadStats = async () => {
    try {
      setIsLoading(true);

      if (user) {
        const sessionData = await apiService.getSessionStats();
        if (sessionData.success && sessionData.data) {
          setSessionStats(sessionData.data.sessionStats);
          setCarbonSaved(sessionData.data.sessionStats?.totalCarbonSaved || 0);
        }
      } else {
        setSessionStats(null);
        setCarbonSaved(0);
      }

      const globalData = await apiService.getGlobalStats();
      if (globalData.success && globalData.data) {
        setGlobalStats(globalData.data);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Conversion helpers
  const toMg = (grams) => grams * 1000;
  const toKWh = (mg) => (mg / 1000) / 404; // mg → g → kWh
  const format2 = (num) =>
    num !== undefined && !isNaN(num) ? Number(num).toFixed(2) : "0.00";
  const format3 = (num) =>
    num !== undefined && !isNaN(num) ? Number(num).toFixed(7) : "0.00";
  const getDerivedMetrics = (grams) => {
    const mg = toMg(grams);
    const kWhSaved = toKWh(mg);
    return { mg, kWhSaved };
  };

  const handleConvert = () => {
    const value = parseFloat(converterInput);
    if (!isNaN(value)) {
      setConverterResult(toKWh(value));
    } else {
      setConverterResult(null);
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

  const globalDerived =
    globalStats && getDerivedMetrics(globalStats.totalCarbonSaved);

  // ======================
  // Anonymous User View
  // ======================
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-6">
        {/* Sign-in prompt */}
        <div className="card text-center w-full max-w-md">
          <div className="text-gray-400 text-6xl mb-4">📊</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Sign In to Track Your Impact
          </h3>
          <p className="text-gray-600 mb-4">
            Sign in to save your optimizations and track your personal carbon
            savings!
          </p>
        </div>

        {/* Global Stats */}
        {globalStats && (
          <motion.div
            className="card w-full max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
              🌍 Global Impact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {format2(globalDerived.mg)} mg
                </p>
                <p className="text-sm text-gray-600">CO₂ Saved Globally</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-indigo-600">
                  {format3(globalDerived.kWhSaved)} kWh
                </p>
                <p className="text-sm text-gray-600">Energy Equivalent</p>
              </div>
            </div>

            {/* Formula */}
            <div className="mt-6 text-sm text-gray-500 text-left">
              <h4 className="font-semibold text-gray-700 mb-2">
                🔎 How We Calculate
              </h4>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <code>mg CO₂ = grams × 1000</code>
                </li>
                <li>
                  <code>kWh = (mg ÷ 1000) ÷ 404</code>{" "}
                  <span className="text-gray-400">(404 g CO₂ / kWh)</span>
                </li>
              </ul>
            </div>

            {/* Converter Tool */}
            <div className="mt-6 p-4 border rounded-lg bg-gray-50">
              <h4 className="font-semibold text-gray-700 mb-2">
                ⚡ CO₂ to kWh Converter
              </h4>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  className="border rounded p-2 w-full"
                  placeholder="Enter mg of CO₂"
                  value={converterInput}
                  onChange={(e) => setConverterInput(e.target.value)}
                />
                <button
                  onClick={handleConvert}
                  className="px-4 py-2 bg-green-500 text-white rounded"
                >
                  Convert
                </button>
              </div>
              {converterResult !== null && (
                <p className="mt-2 text-sm text-gray-700">
                  Equivalent:{" "}
                  <span className="font-bold">
                    {format3(converterResult)} kWh
                  </span>
                </p>
              )}
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  // ======================
  // Logged-in User View
  // ======================
  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-6">
      {/* Session Carbon Savings */}
      <motion.div
        className="card text-center w-full max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          🌱 Your Carbon Savings
        </h2>
        <p className="text-3xl font-extrabold text-green-600">
          {format2(toMg(carbonSaved))} mg CO₂ saved
        </p>
        {sessionStats && (
          <p className="text-sm text-gray-500 mt-2">
            {sessionStats.totalPromptsOptimized || 0} prompts optimized
          </p>
        )}
      </motion.div>

      {/* Session Tokens / Prompts */}
      {sessionStats && (
        <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
          <motion.div whileHover={{ scale: 1.05 }} className="card text-center">
            <p className="text-lg font-semibold text-gray-800">
              Prompts Optimized
            </p>
            <p className="text-xl font-bold text-green-500">
              {sessionStats.totalPromptsOptimized || 0}
            </p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="card text-center">
            <p className="text-lg font-semibold text-gray-800">Tokens Saved</p>
            <p className="text-xl font-bold text-green-500">
              {format2(sessionStats.totalTokensSaved || 0)}
            </p>
          </motion.div>
        </div>
      )}

      {/* Global Stats */}
      {globalStats && (
        <motion.div
          className="card w-full max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
            🌍 Global Impact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {format2(globalDerived.mg)} mg
              </p>
              <p className="text-sm text-gray-600">CO₂ Saved Globally</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-600">
                {format3(globalDerived.kWhSaved)} kWh
              </p>
              <p className="text-sm text-gray-600">Energy Equivalent</p>
            </div>
          </div>

          {/* Formula */}
          <div className="mt-6 text-sm text-gray-500 text-left">
            <h4 className="font-semibold text-gray-700 mb-2">
              🔎 How We Calculate
            </h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <code>mg CO₂ = grams × 1000</code>
              </li>
              <li>
                <code>kWh = (mg ÷ 1000) ÷ 404</code>{" "}
                <span className="text-gray-400">(404 g CO₂ / kWh)</span>
              </li>
            </ul>
          </div>

          {/* Converter Tool */}
          <div className="mt-6 p-4 border rounded-lg bg-gray-50">
            <h4 className="font-semibold text-gray-700 mb-2">
              ⚡ CO₂ to kWh Converter
            </h4>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                className="border rounded p-2 w-full"
                placeholder="Enter mg of CO₂"
                value={converterInput}
                onChange={(e) => setConverterInput(e.target.value)}
              />
              <button
                onClick={handleConvert}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Convert
              </button>
            </div>
            {converterResult !== null && (
              <p className="mt-2 text-sm text-gray-700">
                Equivalent:{" "}
                <span className="font-bold">
                  {format3(converterResult)} kWh
                </span>
              </p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
