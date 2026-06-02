import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: true,
      index: true,
      enum: [
        "Food",
        "Travel",
        "Bills",
        "Shopping",
        "Entertainment",
        "Other",
      ],
    },

    notes: {
      type: String,
      trim: true,
      default: "",
      maxlength: 500,
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// PERFORMANCE INDEXES
expenseSchema.index({ user: 1, category: 1 });
expenseSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Expense", expenseSchema);