const mongoose = require('mongoose');

const optimizationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    default: null
  },
  sessionId: {
    type: String,
    required: true
  },
  originalPrompt: {
    type: String,
    required: true,
    maxlength: 2000
  },
  optimizedPrompt: {
    type: String,
    required: true,
    maxlength: 2000
  },
  tokensBefore: {
    type: Number,
    required: true,
    min: 0
  },
  tokensAfter: {
    type: Number,
    required: true,
    min: 0
  },
  tokensSaved: {
    type: Number,
    required: true,
    min: 0
  },
  carbonSaved: {
    type: Number,
    required: true,
    min: 0
  },
  qualityScore: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  optimizations: [{
    type: String
  }],
  strategy: {
    type: String,
    default: 'balanced'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
optimizationSchema.index({ userId: 1, timestamp: -1 });
optimizationSchema.index({ sessionId: 1 });
optimizationSchema.index({ timestamp: -1 });

module.exports = mongoose.model('Optimization', optimizationSchema);
