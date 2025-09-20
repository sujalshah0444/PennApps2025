const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

class ApiService {
  constructor() {
    this.sessionId = this.getOrCreateSessionId();
  }

  getOrCreateSessionId() {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = this.generateSessionId();
      localStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }

  generateSessionId() {
    return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  async createSession() {
    try {
      const response = await fetch(`${API_BASE_URL}/session/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAgent: navigator.userAgent,
          ipAddress: 'unknown' // Will be handled by server
        })
      });

      const data = await response.json();
      if (data.success) {
        this.sessionId = data.sessionId;
        localStorage.setItem('sessionId', this.sessionId);
      }
      return data;
    } catch (error) {
      console.error('Error creating session:', error);
      return { success: false, error: error.message };
    }
  }

  async saveOptimization(optimizationData) {
    try {
      const response = await fetch(`${API_BASE_URL}/optimization/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...optimizationData,
          sessionId: this.sessionId
        })
      });

      return await response.json();
    } catch (error) {
      console.error('Error saving optimization:', error);
      return { success: false, error: error.message };
    }
  }

  async getOptimizationHistory(page = 1, limit = 20) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/optimization/history/${this.sessionId}?page=${page}&limit=${limit}`
      );
      return await response.json();
    } catch (error) {
      console.error('Error fetching optimization history:', error);
      return { success: false, error: error.message };
    }
  }

  async getSessionStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/optimization/stats/${this.sessionId}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching session stats:', error);
      return { success: false, error: error.message };
    }
  }

  async getGlobalStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/optimization/global-stats`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching global stats:', error);
      return { success: false, error: error.message };
    }
  }

  async updateSessionActivity() {
    try {
      const response = await fetch(`${API_BASE_URL}/session/${this.sessionId}/activity`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating session activity:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new ApiService();
