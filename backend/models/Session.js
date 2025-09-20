const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  isAnonymous: {
    type: Boolean,
    default: true
  },
  totalOptimizations: {
    type: Number,
    default: 0
  },
  totalCarbonSaved: {
    type: Number,
    default: 0
  },
  totalTokensSaved: {
    type: Number,
    default: 0
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  userAgent: {
    type: String
  },
  ipAddress: {
    type: String
  }
}, {
  timestamps: true
});

// Update lastActivity on save
sessionSchema.pre('save', function(next) {
  this.lastActivity = new Date();
  next();
});

// Index for efficient queries
sessionSchema.index({ sessionId: 1 });
sessionSchema.index({ userId: 1 });
sessionSchema.index({ lastActivity: -1 });

module.exports = mongoose.model('Session', sessionSchema);
