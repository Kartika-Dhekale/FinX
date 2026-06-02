import Log from '../models/log.model.js';

export const createLog = async (
  message: string,
  userId: string | null = null,
  level: 'info' | 'warning' | 'error' = 'info'
) => {
  try {
    await Log.create({
      message,
      user: userId,
      level,
    });
  } catch (error) {
    console.error('LOG ERROR:', error);
  }
};