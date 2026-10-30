import React, { useState } from 'react';
import '../auth.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const Register = () => {
  const navigate = useNavigate();

  const { loading, handleRegister } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

 const handleSubmit = async (e) => {
  e.preventDefault();
  setErrorMessage('');

  try {
    const response = await handleRegister({
      username,
      email,
      password,
    });

    // Check what is actually returned
    console.log('handleRegister returned:', response);

    if (response === true || response?.success) {
      navigate('/', { replace: true });
    } else {
      // If it returned an error object/string instead of throwing
      const message =
        response?.message ||
        response?.error ||
        (typeof response === 'string' ? response : 'Unable to create account: The provided username or email is already taken. Please update your details and try again.');
      setErrorMessage(message);
    }
  } catch (error) {
    // Check what was caught if it threw
    console.error('Caught in catch block:', error);
    console.log('Error response data:', error.response?.data);

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Username or email already exists.';

    setErrorMessage(message);
  }
};

  return (
    <main>
      <div className="form-container">

        <h1>Register</h1>

        {/* Display error message if duplicate or invalid */}
        {errorMessage && (
          <p className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
            {errorMessage}
          </p>
        )}

        <form onSubmit={handleSubmit}>

          {/* Username */}
          <div className="input-group">
            <label htmlFor="username">
              Username:
            </label>

            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              required
            />
          </div>

          {/* Email */}
          <div className="input-group">
            <label htmlFor="email">
              Email:
            </label>

            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              required
            />
          </div>

          {/* Password */}
          <div className="input-group">
            <label htmlFor="password">
              Password:
            </label>

            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              required
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>

        </form>

        {/* Login Link */}
        <p className="auth-switch">
          Already have an account?

          <button
            type="button"
            className="register-link"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        </p>

      </div>
    </main>
  );
};

export default Register;