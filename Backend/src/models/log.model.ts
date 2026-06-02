import mongoose from 'mongoose';

const logSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
    },

    level: {
      type: String,
      enum: ['info', 'warning', 'error'],
      default: 'info',
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Log', logSchema);