 import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/auth',
  withCredentials: true
});

// REGISTER
 export async function register(username, email, password) {
  try {
    console.log('Sending register data:', {
      username,
      email,
      password
    });

    const response = await api.post('/register', {
      username,
      email,
      password
    });

    console.log('Register response:', response.data);

    return response.data;

  } catch (error) {
    console.log('STATUS:', error.response?.status);
    console.log('BACKEND ERROR:', error.response?.data);

    throw error;
  }
}

// LOGIN
export async function login(email, password) {
  try {
    const response = await api.post('/login', {
      email,
      password
    });

    console.log('LOGIN RESPONSE:', response.data);

    return response.data;
  } catch (error) {
    console.log('Login Error:', error);
    throw error;
  }
}

// LOGOUT
export async function logout() {
  try {
    const response = await api.get('/logout');

    return response.data;
  } catch (error) {
    console.log('Logout Error:', error);
    throw error;
  }
}

// GET CURRENT USER
export async function getMe() {
  try {
    const response = await api.get('/get-me');

    return response.data;
  } catch (error) {
    console.log('GetMe Error:', error);
    throw error;
  }
}