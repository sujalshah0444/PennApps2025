import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function StatsTab() {
  const [carbonSaved, setCarbonSaved] = useState(0);

  useEffect(() => {
    let target = 124.56;
    let step = target / 50;
    let i = 0;
    let interval = setInterval(() => {
      i++;
      setCarbonSaved((prev) => Math.min(prev + step, target));
      if (i >= 50) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-6">
      <motion.div
        className="card text-center w-full max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          🌱 Carbon Savings
        </h2>
        <p className="text-3xl font-extrabold text-green-600">
          {carbonSaved.toFixed(2)} gCO₂ saved
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
        {["Prompts Optimized", "Users", "Energy Saved", "Impact Score"].map(
          (stat, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="card text-center"
            >
              <p className="text-lg font-semibold text-gray-800">{stat}</p>
              <p className="text-xl font-bold text-green-500">+{i * 42}</p>
            </motion.div>
          )
        )}
      </div>
    </div>
  );
}
