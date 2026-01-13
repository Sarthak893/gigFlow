
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isValidEmail, getAllowedDomainsMessage, isValidPassword, getPasswordRequirementsMessage } from '../utils/validation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    
    if (!email) {
      return setError('Email is required');
    }
    if (!isValidEmail(email)) {
      return setError('Please enter a valid email address');
    }
    if (!isValidPassword(password)) {
      return setError(getPasswordRequirementsMessage());}




    const result = await login(email, password);
    if (!result.success) {
      setError(result.message || 'Invalid email or password');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
      
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Sign In
        </button>
      </form>

      <p className="text-center mt-6">
        Don't have an account?{' '}
        <a href="/register" className="text-blue-600 hover:underline">Register</a>
      </p>
    </div>
  );
}