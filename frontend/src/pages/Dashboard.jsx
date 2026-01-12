
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [myGigs, setMyGigs] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gigsRes, bidsRes] = await Promise.all([
          api.getMyGigs(),
          api.getMyBids()
        ]);

        if (gigsRes.ok) {
          const gigs = await gigsRes.json();
          setMyGigs(gigs);
        }

        if (bidsRes.ok) {
          const bids = await bidsRes.json();
          setMyBids(bids);
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Post Gig Button */}
      <div className="mb-8 text-center">
        <button
          onClick={() => navigate('/post-gig')}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          + Post a New Gig
        </button>
      </div>

      {/* My Gigs (Client View) */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">My Gigs ({myGigs.length})</h2>
        {myGigs.length === 0 ? (
          <p className="text-gray-500">You haven't posted any gigs yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myGigs.map(gig => (
              <div key={gig._id} className="border rounded-lg p-4">
                <div className="flex justify-between">
                  <h3 className="font-medium">{gig.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${
                    gig.status === 'open' ? 'bg-green-100 text-green-800' :
                    gig.status === 'closed' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {gig.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-1">${gig.budget}</p>
                <button
                  onClick={() => navigate(`/gigs/${gig._id}`)}
                  className="mt-2 text-blue-600 hover:underline text-sm"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* My Bids (Freelancer View) */}
      <section>
        <h2 className="text-xl font-semibold mb-4">My Bids ({myBids.length})</h2>
        {myBids.length === 0 ? (
          <p className="text-gray-500">You haven't placed any bids yet.</p>
        ) : (
          <div className="space-y-4">
            {myBids.map(bid => (
              <div key={bid._id} className="border rounded-lg p-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium">{bid.gigId?.title || 'Deleted Gig'}</h3>
                    <p className="text-gray-600 text-sm">Bid: ${bid.amount}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded text-xs ${
                      bid.gigId?.status === 'open' ? 'bg-green-100 text-green-800' :
                      bid.gigId?.status === 'closed' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {bid.gigId?.status || 'Unknown'}
                    </span>
                    <button
                      onClick={() => navigate(`/gigs/${bid.gigId?._id}`)}
                      className="mt-2 text-blue-600 hover:underline text-sm block"
                    >
                      View Gig
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}