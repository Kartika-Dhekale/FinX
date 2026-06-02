import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


// ================= INTERFACE =================

export interface IUser
  extends mongoose.Document {

  name: string;

  email: string;

  password: string;

  role: string;

  monthlyBudget: number;

  avatar: string;
}


// ================= SCHEMA =================

const userSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      role: {
        type: String,
        enum: [
          'user',
          'admin',
        ],
        default: 'user',
      },

      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
      },

      password: {
        type: String,
        required: true,
        minlength: 6,
      },

      monthlyBudget: {
        type: Number,
        default: 3000,
      },

      avatar: {
        type: String,
        default: '',
      },
    },
    {
      timestamps: true,
    }
  );


// ================= HASH PASSWORD =================

userSchema.pre(
  'save',
  async function (next) {

    if (
      !this.isModified(
        'password'
      )
    ) {
      return next();
    }

    this.password =
      await bcrypt.hash(
        this.password,
        10
      );

    next();
  }
);


// ================= EXPORT =================

export default mongoose.model<IUser>(
  'User',
  userSchema
);