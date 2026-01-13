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

  if (loading) return <p>Loading gigs...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {gigs.map(gig => (
        <div key={gig._id} className="border rounded-lg p-5 bg-white shadow-sm">
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
            Posted by: {gig.ownerId?.name || 'User'}
          </p>
        </div>
      ))}
    </div>
  );
}