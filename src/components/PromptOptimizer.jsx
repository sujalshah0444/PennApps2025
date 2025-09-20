import React, { useState } from 'react';
import { usePromptOptimizer } from '../hooks/usePromptOptimizer';
import './PromptOptimizer.css';

const PromptOptimizer = () => {
  const [prompt, setPrompt] = useState('');
  const [strategy, setStrategy] = useState('balanced');
  const [useApi, setUseApi] = useState(false);
  const [result, setResult] = useState(null);
  
  const { optimize, isOptimizing, error, history } = usePromptOptimizer();

  const handleOptimize = async () => {
    if (!prompt.trim()) return;
    
    try {
      const optimizationResult = await optimize(prompt, strategy, useApi);
      setResult(optimizationResult);
    } catch (err) {
      console.error('Optimization failed:', err);
    }
  };

  const handleCopy = () => {
    if (result?.optimized) {
      navigator.clipboard.writeText(result.optimized);
    }
  };

  return (
    <div className="prompt-optimizer">
      <div className="header">
        <h1>🌱 Type-Less</h1>
        <p>Reduce AI carbon footprint by optimizing your prompts</p>
      </div>

      <div className="input-section">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here... (e.g., 'Please kindly write a very detailed summary of the meeting')"
          rows={4}
          className="prompt-input"
        />
        
        <div className="controls">
          <div className="strategy-group">
            <label htmlFor="strategy">Strategy:</label>
            <select 
              id="strategy"
              value={strategy} 
              onChange={(e) => setStrategy(e.target.value)}
              className="strategy-select"
            >
              <option value="conservative">Conservative (minimal changes)</option>
              <option value="balanced">Balanced (recommended)</option>
              <option value="aggressive">Aggressive (maximum compression)</option>
            </select>
          </div>
          
          <div className="api-toggle">
            <label>
              <input
                type="checkbox"
                checked={useApi}
                onChange={(e) => setUseApi(e.target.checked)}
              />
              Use Backend API
            </label>
          </div>
          
          <button 
            onClick={handleOptimize}
            disabled={isOptimizing || !prompt.trim()}
            className="optimize-btn"
          >
            {isOptimizing ? 'Optimizing...' : '�� Optimize'}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          ❌ Error: {error}
        </div>
      )}

      {result && (
        <div className="results-section">
          <div className="optimization-result">
            <h3>📝 Optimization Result</h3>
            <div className="prompt-comparison">
              <div className="prompt-original">
                <h4>Original:</h4>
                <p>{result.original}</p>
                <span className="token-count">{result.tokensBefore} tokens</span>
              </div>
              <div className="prompt-optimized">
                <h4>Optimized:</h4>
                <p>{result.optimized}</p>
                <span className="token-count">{result.tokensAfter} tokens</span>
              </div>
            </div>
            
            <button onClick={handleCopy} className="copy-btn">
              📋 Copy Optimized
            </button>
          </div>

          <div className="metrics-grid">
            <div className="metric-card">
              <h4>🎯 Token Savings</h4>
              <div className="metric-value">{result.tokensSaved}</div>
              <div className="metric-detail">
                {result.tokensBefore} → {result.tokensAfter}
              </div>
            </div>

            <div className="metric-card">
              <h4>🌍 Carbon Savings</h4>
              <div className="metric-value">
                {result.carbonSavings.co2Saved.toFixed(6)}g CO₂
              </div>
              <div className="metric-detail">
                {result.carbonSavings.kwhSaved.toFixed(6)} kWh saved
              </div>
            </div>

            <div className="metric-card">
              <h4>✅ Quality Score</h4>
              <div className="metric-value">
                {(result.qualityScore * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          {result.optimizations.length > 0 && (
            <div className="optimizations-applied">
              <h4>🔧 Optimizations Applied:</h4>
              <ul>
                {result.optimizations.map((opt, index) => (
                  <li key={index}>{opt}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {history.length > 0 && (
        <div className="history-section">
          <h3>📊 Recent Optimizations</h3>
          <div className="history-stats">
            <div className="stat">
              <strong>Total Optimizations:</strong> {history.length}
            </div>
            <div className="stat">
              <strong>Total Tokens Saved:</strong> {history.reduce((sum, h) => sum + h.tokensSaved, 0)}
            </div>
            <div className="stat">
              <strong>Total CO₂ Saved:</strong> {history.reduce((sum, h) => sum + h.carbonSavings.co2Saved, 0).toFixed(6)}g
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptOptimizer;