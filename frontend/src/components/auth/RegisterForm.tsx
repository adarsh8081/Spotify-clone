import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        email,
        password
      }, {
        withCredentials: true
      });

      login(response.data.token, response.data.user);
      navigate('/');
    } catch (err: any) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.message || 'An error occurred during registration';
      const errorDetails = err.response?.data?.details;
      
      if (errorDetails) {
        // Handle field-specific errors
        const fieldErrors = Object.entries(errorDetails)
          .filter(([_, value]) => value !== null)
          .map(([field, message]) => `${field}: ${message}`)
          .join(', ');
        
        setError(fieldErrors || errorMessage);
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="w-full max-w-[400px] space-y-4 p-6">
        <div>
          <h2 className="text-center text-2xl font-bold text-white mb-6">
            Create your account
          </h2>
        </div>
        <form className="space-y-3" onSubmit={handleSubmit}>
          {error && (
            <div className="text-[#f15e6c] bg-[#2c1316] px-3 py-2 rounded text-[13px]">
              {error}
            </div>
          )}
          <div className="space-y-3">
            <div>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="block w-full px-3 py-[10px] bg-[#121212] border border-[#282828] text-white placeholder-[#717171] rounded focus:outline-none focus:border-[#535353] text-[14px]"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full px-3 py-[10px] bg-[#121212] border border-[#282828] text-white placeholder-[#717171] rounded focus:outline-none focus:border-[#535353] text-[14px]"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="block w-full px-3 py-[10px] bg-[#121212] border border-[#282828] text-white placeholder-[#717171] rounded focus:outline-none focus:border-[#535353] text-[14px]"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="block w-full px-3 py-[10px] bg-[#121212] border border-[#282828] text-white placeholder-[#717171] rounded focus:outline-none focus:border-[#535353] text-[14px]"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-[10px] px-4 text-[14px] font-semibold rounded bg-[#7747ff] hover:bg-[#6535ff] text-white focus:outline-none transition-colors"
            >
              Sign up
            </button>
          </div>

          <div className="text-center pt-2">
            <p className="text-[13px] text-[#a7a7a7]">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-white hover:text-[#7747ff] transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm; 