const API_BASE = import.meta.env.VITE_API_BASE;

// helper to get auth headers
const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
};

export const api = {
  // ---------- AUTH ----------
  register: (data) =>
    fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }),

  login: (data) =>
    fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }),

  logout: () => {
    localStorage.removeItem("token");
    return Promise.resolve();
  },

  // ---------- GIGS ----------
  getGigs: (search = "") =>
    fetch(
      `${API_BASE}/gigs${
        search ? `?search=${encodeURIComponent(search)}` : ""
      }`
    ),

  createGig: (data) =>
    fetch(`${API_BASE}/gigs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(data),
    }),

  getMyGigs: () =>
    fetch(`${API_BASE}/gigs/mine`, {
      headers: {
        ...authHeaders(),
      },
    }),

  getGigStats: () =>
    fetch(`${API_BASE}/gigs/stats`, {
      headers: {
        ...authHeaders(),
      },
    }),

  // ---------- BIDS ----------
  placeBid: (data) =>
    fetch(`${API_BASE}/bids`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(data),
    }),

  getBids: (gigId) =>
    fetch(`${API_BASE}/bids/gigs/${gigId}/bids`, {
      headers: {
        ...authHeaders(),
      },
    }),

  getMyBids: () =>
    fetch(`${API_BASE}/bids/mine`, {
      headers: {
        ...authHeaders(),
      },
    }),

  hireFreelancer: (gigId, freelancerId) =>
    fetch(`${API_BASE}/gigs/${gigId}/hire`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({ freelancerId }),
    }),
};
