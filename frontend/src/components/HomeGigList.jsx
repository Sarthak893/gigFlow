// frontend/src/components/HomeGigList.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function HomeGigList() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/gigs');
        const data = await res.json();
        setGigs(data);
      } catch (err) {
        console.error('Failed to load gigs');
      } finally {
        setLoading(false);
      }
    };
    fetchGigs();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-emerald-100 text-emerald-800';
      case 'closed': return 'bg-rose-100 text-rose-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
            <div className="flex justify-between items-center mt-4">
              <div className="h-6 bg-gray-200 rounded w-16"></div>
              <div className="h-8 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mt-3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (gigs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M9 11a2 2 0 11-4 0m8 0a2 2 0 104 0m-4 0V9a2 2 0 00-2-2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No gigs available</h3>
        <p className="text-gray-600">Check back later or post your own gig!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {gigs.map(gig => (
        <div 
          key={gig._id} 
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
        >
          <div className="p-5">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-gray-900 line-clamp-1">{gig.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(gig.status)}`}>
                {gig.status.charAt(0).toUpperCase() + gig.status.slice(1)}
              </span>
            </div>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-3 min-h-[60px]">{gig.description}</p>
            
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-emerald-600">${gig.budget}</span>
              <Link
                to={`/gigs/${gig._id}`}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition transform hover:scale-105"
              >
                View Details
              </Link>
            </div>
            
            <p className="text-xs text-gray-500 mt-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {gig.ownerId?.name || 'User'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}