
import { Link } from 'react-router-dom';

export default function GigCard({ gig }) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <h3 className="font-bold text-lg">{gig.title}</h3>
      <p className="text-gray-600 mt-2 line-clamp-2">{gig.description}</p>
      <div className="mt-3 flex justify-between items-center">
        <span className="text-green-600 font-semibold">${gig.budget}</span>
        <Link
          to={`/gigs/${gig._id}`}
          className="text-blue-600 hover:underline"
        >
          View Details
        </Link>
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Posted by: {gig.ownerId?.name || 'Unknown'}
      </p>
    </div>
  );
}