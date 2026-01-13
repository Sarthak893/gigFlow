// frontend/src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GigCard from '../components/GigCard';

export default function Home() {
  const { user } = useAuth();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchGigs();
  }, []);

  const fetchGigs = async (query = '') => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/gigs${query ? `?search=${encodeURIComponent(query)}` : ''}`);
      const data = await res.json();
      setGigs(data);
    } catch (err) {
      console.error('Failed to load gigs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchGigs(search);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {user ? `Hello, ${user.name}!` : 'Welcome to GigFlow'}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {user
              ? 'Post a gig or find your next opportunity.'
              : 'Join freelancers and clients in a seamless marketplace.'}
          </p>
          
          {!user && (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/register"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium text-lg transition shadow-md"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 px-6 py-3 rounded-lg font-medium text-lg transition"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Search & Gig Listing */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto mb-10">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search gigs by title or description..."
              className="flex-1 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
            >
              Search
            </button>
          </form>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Available Gigs</h2>

        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : gigs.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">No gigs found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs.map(gig => (
              <GigCard key={gig._id} gig={gig} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}