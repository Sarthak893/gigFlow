const API_BASE = import.meta.env.VITE_API_BASE;


export const api = {
  // Auth
  register: (data) => 
    fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', 
      body: JSON.stringify(data)
    }),

  login: (data) =>
    fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', 
      body: JSON.stringify(data)
    }),

  logout: () =>
    fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include' 
    }),

  // Gigs
  getGigs: (search = '') =>
    fetch(`${API_BASE}/gigs${search ? `?search=${encodeURIComponent(search)}` : ''}`, {
      credentials: 'include' 
    }),

  createGig: (data) =>
    fetch(`${API_BASE}/gigs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    }),
  getMyGigs: () =>
    fetch(`${API_BASE}/gigs/mine`, { credentials: 'include' }),

  

  // Bids
  placeBid: (data) =>
    fetch(`${API_BASE}/bids`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    }),

  getBids: (gigId) =>
    fetch(`${API_BASE}/gigs/${gigId}/bids`, {
      credentials: 'include' 
    }),
  getMyBids: () =>
  fetch(`${API_BASE}/bids/mine`, { credentials: 'include' }),

  hireFreelancer: (gigId, freelancerId) =>
    fetch(`${API_BASE}/gigs/${gigId}/hire`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', 
      body: JSON.stringify({ freelancerId })
    })
};