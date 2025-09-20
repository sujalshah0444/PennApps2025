import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import { optimizePrompt } from "../utils/promptOptimizer";

export default function OptimizeTab() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  // States for tokens & CO₂
  const [tokensBefore, setTokensBefore] = useState(0);
  const [tokensAfter, setTokensAfter] = useState(0);
  const [carbonSaved, setCarbonSaved] = useState(0);
  const [triggerCount, setTriggerCount] = useState(false);
  const [totalCarbonSaved, setTotalCarbonSaved] = useState(0);

  const taglines = [
    "✂️ Prompt Shortener — keep it concise.",
    "🌍 Carbon-Friendly Mode — save energy.",
    "✨ Clarity Improver — say it better.",
    "⚡ Efficiency Booster — faster prompts.",
  ];

  // cycle through taglines every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % taglines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { text: input, sender: "user" }]);
    setInput("");
    setIsTyping(true);

    // Use the actual optimization logic
    setTimeout(() => {
      try {
        const result = optimizePrompt(input);
        
        setTokensBefore(result.tokensBefore);
        setTokensAfter(result.tokensAfter);
        setCarbonSaved(result.carbonSavings.co2Saved);
        setTotalCarbonSaved(prev => prev + result.carbonSavings.co2Saved);
        setTriggerCount(true);
        setTimeout(() => setTriggerCount(false), 200);

        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            text: `🌍 Optimized: ${result.optimized}`,
            sender: "bot",
            optimizations: result.optimizations,
            qualityScore: result.qualityScore
          },
        ]);
      } catch (error) {
        console.error('Optimization error:', error);
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            text: "❌ Sorry, there was an error optimizing your prompt.",
            sender: "bot",
          },
        ]);
      }
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[85vh] w-full max-w-4xl mx-auto">
      {/* Hero Bubble Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="card text-center mb-6 bg-green-50 border border-green-200"
      >
        <h2 className="text-2xl font-bold text-green-700 mb-2">
          🌍 Eco-Friendly Prompt Optimizer
        </h2>
        <AnimatePresence mode="wait">
          <motion.p
            key={taglineIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="text-gray-600"
          >
            {taglines[taglineIndex]}
          </motion.p>
        </AnimatePresence>
      </motion.div>

      {/* Chat Section */}
      <motion.div
        className="flex flex-col flex-1 card overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Chat Messages */}
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.length === 0 && !isTyping && (
            <p className="text-center text-gray-400 italic">
              Start typing to get eco-optimized suggestions 🌱
            </p>
          )}
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: msg.sender === "user" ? 40 : -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className={`px-4 py-3 rounded-xl shadow max-w-sm ${
                msg.sender === "user"
                  ? "bg-green-500 text-white self-end ml-auto"
                  : "bg-gray-100 text-gray-800 self-start"
              }`}
            >
              {msg.text}
              {msg.optimizations && (
                <div className="mt-2 text-xs opacity-75">
                  <div>Quality: {(msg.qualityScore * 100).toFixed(1)}%</div>
                  <div className="mt-1">
                    {msg.optimizations.slice(0, 2).join(", ")}
                    {msg.optimizations.length > 2 && "..."}
                  </div>
                </div>
              )}
            </motion.div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-4 py-3 rounded-xl shadow bg-gray-200 text-gray-600 self-start inline-flex items-center gap-2"
            >
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></span>
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></span>
            </motion.div>
          )}
        </div>

        {/* Token + CO₂ Counters */}
        {(tokensBefore > 0 || tokensAfter > 0) && (
          <div className="grid grid-cols-3 gap-4 p-4 border-t bg-gray-50">
            <div className="bg-white p-3 rounded-lg shadow text-center">
              <p className="text-xl font-bold text-gray-800">
                {triggerCount ? (
                  <CountUp end={tokensBefore} duration={1} />
                ) : (
                  tokensBefore
                )}
              </p>
              <p className="text-sm text-gray-600">Tokens before</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow text-center">
              <p className="text-xl font-bold text-gray-800">
                {triggerCount ? (
                  <CountUp end={tokensAfter} duration={1} />
                ) : (
                  tokensAfter
                )}
              </p>
              <p className="text-sm text-gray-600">Tokens after</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow text-center">
              <p className="text-xl font-bold text-gray-800">
                {triggerCount ? (
                  <CountUp end={carbonSaved} decimals={2} duration={1.5} />
                ) : (
                  carbonSaved.toFixed(2)
                )}
              </p>
              <p className="text-sm text-gray-600">CO₂ saved (g)</p>
            </div>
          </div>
        )}

        {/* Total Carbon Saved */}
        {totalCarbonSaved > 0 && (
          <div className="px-4 py-2 bg-green-50 border-t">
            <div className="text-center">
              <span className="text-sm text-gray-600">Total CO₂ saved: </span>
              <span className="font-bold text-green-600">
                {totalCarbonSaved.toFixed(2)}g
              </span>
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="flex gap-3 p-3 border-t bg-white/60 backdrop-blur-lg">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your prompt..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none shadow-sm"
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            className="px-5 py-3 bg-green-500 text-white font-semibold rounded-xl shadow hover:bg-green-600"
          >
            Send
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
