import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../Shared/Button';
import { Card } from '../Shared/Card';
import { LoginCredentials } from '../../types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const LoginForm: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(credentials);
      console.log("Token:", localStorage.getItem('token'));
      console.log("user:", localStorage.getItem('user'));
      toast.success('Login successful!');
      console.log("Login successful!"); 
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-blue-50 min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md mx-auto p-6 rounded-lg shadow-lg bg-white">
        <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">Login</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
              <input
                type="email"
                className="w-full bg-transparent focus:outline-none"
                placeholder="Enter your email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
              <input
                type="password"
                className="w-full bg-transparent focus:outline-none"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700" isLoading={isLoading}>
            Login
          </Button>

          <p className="text-center mt-4">
            Don't have an account?{' '}
            <a href="/register" className="text-blue-600 hover:underline">
              Register
            </a>
          </p>
        </form>
      </Card>
    </div>
  );
};
