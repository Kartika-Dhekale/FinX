import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    month: {
      type: Number,
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    monthlyBudget: {
      type: Number,
      required: true,
      default: 0,
    },

    categoryBudgets: {
      Food: {
        type: Number,
        default: 0,
      },

      Travel: {
        type: Number,
        default: 0,
      },

      Bills: {
        type: Number,
        default: 0,
      },

      Shopping: {
        type: Number,
        default: 0,
      },

      Entertainment: {
        type: Number,
        default: 0,
      },

      Other: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);


// ================= COMPOUND UNIQUE INDEX =================

budgetSchema.index(
  {
    user: 1,
    month: 1,
    year: 1,
  },
  {
    unique: true,
  }
);

const Budget = mongoose.model(
  'Budget',
  budgetSchema
);

export default Budget;