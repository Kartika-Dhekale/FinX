// LocalStorage auth utility functions
interface User {
  email: string;
  name: string;
}

const USER_KEY = 'expense_tracker_user';

export const auth = {
  // Store user in localStorage
  signup: (email: string, name: string, password: string) => {
    const user: User = { email, name };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(`password_${email}`, password); // Simple storage (not production-safe)
    return user;
  },

  // Retrieve user from localStorage
  login: (email: string, password: string) => {
    const storedPassword = localStorage.getItem(`password_${email}`);
    if (storedPassword === password) {
      const userData = localStorage.getItem(USER_KEY);
      if (userData) {
        return JSON.parse(userData) as User;
      }
      return null;
    }
    return null;
  },

  // Get current user
  getUser: (): User | null => {
    try {
      const userData = localStorage.getItem(USER_KEY);
      return userData ? (JSON.parse(userData) as User) : null;
    } catch {
      return null;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem(USER_KEY);
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return localStorage.getItem(USER_KEY) !== null;
  },
};
