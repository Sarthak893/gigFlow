
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
  const [openOpportunities, setOpenOpportunities] = useState(0); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gigsRes, bidsRes, statsRes] = await Promise.all([
          api.getMyGigs(),
          api.getMyBids(),
          api.getGigStats() 
        ]);
        
        const gigs = gigsRes.ok ? await gigsRes.json() : [];
        const bids = bidsRes.ok ? await bidsRes.json() : [];
        const stats = statsRes.ok ? await statsRes.json() : { openGigs: 0 };

        setMyGigs(gigs);
        setMyBids(bids);
        setOpenOpportunities(stats.openGigs);
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
      case 'open': return 'bg-emerald-100 text-emerald-800';
      case 'closed': return 'bg-rose-100 text-rose-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Manage your gigs and bids in one place.</p>
          </div>
          <button
            onClick={() => navigate('/post-gig')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Post a New Gig
          </button>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <p className="text-gray-600 text-sm">My Gigs</p>
            <p className="text-2xl font-bold text-indigo-600">{myGigs.length}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <p className="text-gray-600 text-sm">Active Bids</p>
            <p className="text-2xl font-bold text-emerald-600">{myBids.length}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <p className="text-gray-600 text-sm">Open Opportunities</p>
            <p className="text-2xl font-bold text-amber-600">{openOpportunities}</p>
          </div>
        </div>
      </div>

      
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('gigs')}
            className={`py-3 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'gigs'
                ? 'text-indigo-600 border-indigo-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            My Gigs ({myGigs.length})
          </button>
          <button
            onClick={() => setActiveTab('bids')}
            className={`py-3 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'bids'
                ? 'text-indigo-600 border-indigo-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            My Bids ({myBids.length})
          </button>
        </nav>
      </div>

      
      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
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
              <div key={gig._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{gig.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(gig.status)}`}>
                      {gig.status.charAt(0).toUpperCase() + gig.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[48px]">{gig.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-emerald-600">${gig.budget}</span>
                    <button
                      onClick={() => navigate(`/gigs/${gig._id}`)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      View Details
                    </button>
                  </div>
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
              <div key={bid._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                  <div>
                    {bid.gigId ? (
                      <h3 className="font-semibold text-gray-900">{bid.gigId.title}</h3>
                    ) : (
                      <h3 className="font-semibold text-gray-900">Deleted Gig</h3>
                    )}
                    <p className="text-gray-600 text-sm mt-1">
                      Your bid: <span className="font-medium text-emerald-600">${bid.amount}</span>
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
                          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
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

function EmptyState({ title, message, actionText, onAction }) {
  return (
    <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4 max-w-md mx-auto">{message}</p>
      <button
        onClick={onAction}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition shadow-md"
      >
        {actionText}
      </button>
    </div>
  );
}