// frontend/src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('gigs');
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
        const gigs = gigsRes.ok ? await gigsRes.json() : [];
        const bids = bidsRes.ok ? await bidsRes.json() : [];
        console.log('My Gigs:', gigs); 
        console.log('My Bids:', bids); 
        setMyGigs(gigs);
        setMyBids(bids);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Manage your activity in one place.</p>
      </div>

      <div className="mb-6">
        <button
          onClick={() => navigate('/post-gig')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition shadow-sm"
        >
          + Post a New Gig
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('gigs')}
            className={`py-2 px-1 font-medium text-sm ${
              activeTab === 'gigs'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Gigs ({myGigs.length})
          </button>
          <button
            onClick={() => setActiveTab('bids')}
            className={`py-2 px-1 font-medium text-sm ${
              activeTab === 'bids'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Bids ({myBids.length})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      ) : activeTab === 'gigs' ? (
        myGigs.length === 0 ? (
          <EmptyState
            title="No gigs posted yet"
            message="Post your first gig to get started."
            actionText="Post a Gig"
            onAction={() => navigate('/post-gig')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myGigs.map(gig => (
              <div key={gig._id} className="bg-white rounded-lg border p-5 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-800">{gig.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(gig.status)}`}>
                    {gig.status.charAt(0).toUpperCase() + gig.status.slice(1)}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{gig.description}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-green-600">${gig.budget}</span>
                  <button
                    onClick={() => navigate(`/gigs/${gig._id}`)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        myBids.length === 0 ? (
          <EmptyState
            title="No bids placed yet"
            message="Browse gigs and start bidding!"
            actionText="Browse Gigs"
            onAction={() => navigate('/')}
          />
        ) : (
          <div className="space-y-4">
            {myBids.map(bid => (
              <div key={bid._id} className="bg-white rounded-lg border p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                  <div>
                    {/* Show "Deleted Gig" only if gigId is null/undefined */}
                    {bid.gigId ? (
                      <h3 className="font-medium text-gray-800">{bid.gigId.title}</h3>
                    ) : (
                      <h3 className="font-medium text-gray-800">Deleted Gig</h3>
                    )}
                    <p className="text-gray-600 text-sm mt-1">
                      Your bid: <span className="font-medium">${bid.amount}</span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    {bid.gigId ? (
                      <>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium mb-2 ${getStatusColor(bid.gigId.status || 'unknown')}`}>
                          {bid.gigId.status 
                            ? bid.gigId.status.charAt(0).toUpperCase() + bid.gigId.status.slice(1) 
                            : 'Unknown'}
                        </span>
                        <button
                          onClick={() => navigate(`/gigs/${bid.gigId._id}`)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View Gig
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-500 text-sm">Gig not available</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

// Reusable Empty State
function EmptyState({ title, message, actionText, onAction }) {
  return (
    <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{message}</p>
      <button
        onClick={onAction}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
      >
        {actionText}
      </button>
    </div>
  );
}