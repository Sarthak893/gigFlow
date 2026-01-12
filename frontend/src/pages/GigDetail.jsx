// frontend/src/pages/GigDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

export default function GigDetail() {
  const { id: gigId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [gig, setGig] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [bidMessage, setBidMessage] = useState('');

  // Fetch gig and bids on load
  useEffect(() => {
    const fetchGigAndBids = async () => {
      try {
        const gigRes = await fetch(`http://localhost:5000/api/gigs/${gigId}`);
        if (!gigRes.ok) throw new Error('Gig not found');
        const gigData = await gigRes.json();
        setGig(gigData);

        const bidsRes = await api.getBids(gigId);
        if (bidsRes.ok) {
          const bidsData = await bidsRes.json();
          setBids(bidsData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGigAndBids();
  }, [gigId]);
  const isOwner = gig?.ownerId?._id === user?.id;
  const hasBid = bids.some(bid => bid.freelancerId._id === user?.id);
  const canBid = !isOwner && gig?.status === 'open' && !hasBid;
  const handlePlaceBid = async (e) => {
    e.preventDefault();
    if (!bidAmount || isNaN(bidAmount)) return;

    try {
      const res = await api.placeBid({
        gigId,
        amount: Number(bidAmount),
        message: bidMessage
      });

      if (res.ok) {
        const newBid = await res.json();
        setBids([newBid, ...bids]);
        setBidAmount('');
        setBidMessage('');
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to place bid');
      }
    } catch (err) {
      alert('Error placing bid');
    }
  };


  const handleHire = async (freelancerId) => {
    if (!window.confirm('Are you sure you want to hire this freelancer? This will close the gig.')) return;

    try {
      const res = await api.hireFreelancer(gigId, freelancerId);
      if (res.ok) {
        const updatedGig = await res.json();
        setGig(updatedGig);
        alert('Freelancer hired successfully!');
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to hire');
      }
    } catch (err) {
      alert('Error hiring freelancer');
    }
  };

  if (loading) return <div className="p-6">Loading gig details...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!gig) return <div className="p-6">Gig not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{gig.title}</h1>
            <p className="text-gray-600 mt-2">{gig.description}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            gig.status === 'open' ? 'bg-green-100 text-green-800' :
            gig.status === 'closed' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {gig.status.charAt(0).toUpperCase() + gig.status.slice(1)}
          </span>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <p className="text-xl font-bold text-green-600">${gig.budget}</p>
          <p className="text-gray-500">Posted by: {gig.ownerId?.name}</p>
        </div>
      </div>

      
      {canBid && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Place a Bid</h2>
          <form onSubmit={handlePlaceBid} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Bid Amount ($)</label>
              <input
                type="number"
                min="1"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="border px-4 py-2 rounded w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message (Optional)</label>
              <textarea
                value={bidMessage}
                onChange={(e) => setBidMessage(e.target.value)}
                className="border px-4 py-2 rounded w-full"
                rows="3"
                placeholder="Why should the client choose you?"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Submit Bid
            </button>
          </form>
        </div>
      )}

      {/* Bids Section - For owner or bidders */}
      {(isOwner || hasBid) && bids.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Bids ({bids.length})</h2>
          <div className="space-y-4">
            {bids.map(bid => (
              <div key={bid._id} className="border-b pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{bid.freelancerId.name}</p>
                    <p className="text-gray-600 text-sm">{bid.message || 'No message'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">${bid.amount}</p>
                    {isOwner && gig.status === 'open' && (
                      <button
                        onClick={() => handleHire(bid.freelancerId._id)}
                        className="mt-2 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Hire
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {((isOwner || hasBid) && bids.length === 0) && (
        <p className="text-gray-500">No bids yet.</p>
      )}
    </div>
  );
}