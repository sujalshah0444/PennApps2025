const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Session = require('../models/Session');

// Create or get session
router.post('/create', async (req, res) => {
  try {
    const sessionId = uuidv4();
    const { userAgent, ipAddress } = req.body;

    const session = new Session({
      sessionId,
      userAgent,
      ipAddress,
      isAnonymous: true
    });

    await session.save();

    res.json({
      success: true,
      sessionId,
      message: 'Session created successfully'
    });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create session',
      error: error.message
    });
  }
});

// Get session info
router.get('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch session',
      error: error.message
    });
  }
});

// Update session activity
router.put('/:sessionId/activity', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findOneAndUpdate(
      { sessionId },
      { lastActivity: new Date() },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.json({
      success: true,
      message: 'Session activity updated'
    });
  } catch (error) {
    console.error('Error updating session activity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update session activity',
      error: error.message
    });
  }
});

// Link session to user (when user logs in)
router.put('/:sessionId/link-user', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { userId } = req.body;

    const session = await Session.findOneAndUpdate(
      { sessionId },
      { 
        userId,
        isAnonymous: false,
        lastActivity: new Date()
      },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.json({
      success: true,
      message: 'Session linked to user successfully'
    });
  } catch (error) {
    console.error('Error linking session to user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to link session to user',
      error: error.message
    });
  }
});

module.exports = router;
