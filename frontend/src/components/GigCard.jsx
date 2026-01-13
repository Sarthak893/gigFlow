// frontend/src/components/GigCard.jsx
import { Link } from 'react-router-dom';

export default function GigCard({ gig }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{gig.title}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            gig.status === 'open' ? 'bg-green-100 text-green-800' :
            gig.status === 'closed' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {gig.status.charAt(0).toUpperCase() + gig.status.slice(1)}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{gig.description}</p>
        
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-green-600">${gig.budget}</span>
          <Link
            to={`/gigs/${gig._id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            View Details
          </Link>
        </div>
        
        <p className="text-xs text-gray-500 mt-3">
          Posted by: <span className="font-medium">{gig.ownerId?.name || 'User'}</span>
        </p>
      </div>
    </div>
  );
}