const express = require('express');
const router = express.Router();
const Optimization = require('../models/Optimization');
const Session = require('../models/Session');
const User = require('../models/User');

// Save optimization result
router.post('/save', async (req, res) => {
  try {
    const {
      sessionId,
      userId,
      originalPrompt,
      optimizedPrompt,
      tokensBefore,
      tokensAfter,
      tokensSaved,
      carbonSaved,
      qualityScore,
      optimizations,
      strategy
    } = req.body;

    // Create optimization record
    const optimization = new Optimization({
      userId: userId || null,
      sessionId,
      originalPrompt,
      optimizedPrompt,
      tokensBefore,
      tokensAfter,
      tokensSaved,
      carbonSaved,
      qualityScore,
      optimizations,
      strategy
    });

    await optimization.save();

    // Update session statistics
    await Session.findOneAndUpdate(
      { sessionId },
      {
        $inc: {
          totalOptimizations: 1,
          totalCarbonSaved: carbonSaved,
          totalTokensSaved: tokensSaved
        },
        $set: { lastActivity: new Date() }
      },
      { upsert: true }
    );

    // Update user statistics if user is logged in
    if (userId) {
      await User.findByIdAndUpdate(userId, {
        $inc: {
          totalCarbonSaved: carbonSaved,
          totalPromptsOptimized: 1,
          totalTokensSaved: tokensSaved
        },
        $set: { lastActive: new Date() }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Optimization saved successfully',
      optimizationId: optimization._id
    });
  } catch (error) {
    console.error('Error saving optimization:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save optimization',
      error: error.message
    });
  }
});

// Get optimization history for a session
router.get('/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const optimizations = await Optimization.find({ sessionId })
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const total = await Optimization.countDocuments({ sessionId });

    res.json({
      success: true,
      data: optimizations,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching optimization history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch optimization history',
      error: error.message
    });
  }
});

// Get user statistics
router.get('/stats/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Get recent optimizations for this session
    const recentOptimizations = await Optimization.find({ sessionId })
      .sort({ timestamp: -1 })
      .limit(10)
      .select('originalPrompt optimizedPrompt tokensSaved carbonSaved timestamp');

    res.json({
      success: true,
      data: {
        sessionStats: {
          totalOptimizations: session.totalOptimizations,
          totalCarbonSaved: session.totalCarbonSaved,
          totalTokensSaved: session.totalTokensSaved,
          startTime: session.startTime,
          lastActivity: session.lastActivity
        },
        recentOptimizations
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
});

// Get global statistics
router.get('/global-stats', async (req, res) => {
  try {
    const totalOptimizations = await Optimization.countDocuments();
    const totalCarbonSaved = await Optimization.aggregate([
      { $group: { _id: null, total: { $sum: '$carbonSaved' } } }
    ]);
    const totalTokensSaved = await Optimization.aggregate([
      { $group: { _id: null, total: { $sum: '$tokensSaved' } } }
    ]);

    // Get daily stats for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyStats = await Optimization.aggregate([
      {
        $match: {
          timestamp: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' }
          },
          count: { $sum: 1 },
          carbonSaved: { $sum: '$carbonSaved' },
          tokensSaved: { $sum: '$tokensSaved' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalOptimizations,
        totalCarbonSaved: totalCarbonSaved[0]?.total || 0,
        totalTokensSaved: totalTokensSaved[0]?.total || 0,
        dailyStats
      }
    });
  } catch (error) {
    console.error('Error fetching global statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch global statistics',
      error: error.message
    });
  }
});

module.exports = router;
