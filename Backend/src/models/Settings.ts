import mongoose from 'mongoose';

const settingsSchema =
  new mongoose.Schema(
    {
      maintenanceMode: {
        type: Boolean,
        default: false,
      },

      notifications: {
        type: Boolean,
        default: true,
      },

      darkMode: {
        type: Boolean,
        default: true,
      },

      twoFactorAuth: {
        type: Boolean,
        default: false,
      },

      autoBackup: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  'Settings',
  settingsSchema
);