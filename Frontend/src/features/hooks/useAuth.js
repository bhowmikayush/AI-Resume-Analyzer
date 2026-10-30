 import { useContext } from 'react';
import { AuthContext } from '../auth.context.jsx';

import {
  login,
  register,
  logout,
  getMe
} from '../services/auth.api.js';

export const useAuth = () => {
  const {
    user,
    setUser,
    loading,
    setLoading
  } = useContext(AuthContext);

  // REGISTER
  const handleRegister = async ({ username, email, password }) => {
    try {
      setLoading(true);

      const data = await register(
        username,
        email,
        password
      );

      console.log('REGISTER SUCCESS:', data);

      // Save logged-in user
      setUser(data.user);

      return true;

    } catch (error) {
      console.error(
        'REGISTER ERROR:',
        error.response?.data || error.message
      );

      return false;

    } finally {
      setLoading(false);
    }
  };

  // LOGIN
  const handleLogin = async ({ email, password }) => {
    try {
      setLoading(true);

      const data = await login(email, password);

      setUser(data.user);

      return true;

    } catch (error) {
      console.error(
        'LOGIN ERROR:',
        error.response?.data || error.message
      );

      return false;

    } finally {
      setLoading(false);
    }
  };

  // LOGOUT
  const handleLogout = async () => {
    try {
      setLoading(true);

      await logout();

      setUser(null);

    } catch (error) {
      console.error('LOGOUT ERROR:', error);

    } finally {
      setLoading(false);
    }
  };

  // GET CURRENT USER
  const handleGetMe = async () => {
    try {
      const data = await getMe();

      setUser(data.user);

    } catch (error) {
      setUser(null);
    }
  };

  return {
    user,
    loading,
    handleRegister,
    handleLogin,
    handleLogout,
    handleGetMe
  };
};