 
import { useContext } from 'react';
import { AuthContext } from '../auth.context.jsx';

import {
  login,
  register,
  logout
} from '../services/auth.api.js';

export const useAuth = () => {
  const {
    user,
    setUser,
    loading,
    setLoading
  } = useContext(AuthContext);

  const handleRegister = async ({
    username,
    email,
    password
  }) => {
    try {
      setLoading(true);

      const data = await register(
        username,
        email,
        password
      );

      console.log('REGISTER SUCCESS:', data);

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

  const handleLogin = async ({
    email,
    password
  }) => {
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

  return {
    user,
    loading,
    handleRegister,
    handleLogin,
    handleLogout
  };
};
 
