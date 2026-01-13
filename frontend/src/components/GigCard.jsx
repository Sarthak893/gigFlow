// frontend/src/components/GigCard.jsx
import { Link } from 'react-router-dom';

export default function GigCard({ gig }) {
  const statusColors = {
    open: 'bg-emerald-100 text-emerald-800',
    closed: 'bg-rose-100 text-rose-800'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-gray-900 line-clamp-1">{gig.title}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[gig.status] || 'bg-gray-100 text-gray-800'}`}>
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
  );
}