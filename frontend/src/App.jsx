// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import HomeGigList from './components/HomeGigList';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import GigDetail from './pages/GigDetail';
import PostGig from './pages/PostGig';

// Protected Route (as a component)
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  return children;
}


function HomePage() {
  const { user } = useAuth();

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {user ? `Hello, ${user.name}!` : 'Welcome to GigFlow'}
        </h1>
        <p className="text-gray-600 mb-6">
          {user
            ? 'Post a gig or browse opportunities.'
            : 'Join today to post gigs or bid on projects.'}
        </p>
        
        {!user && (
          <div className="flex justify-center gap-4">
            <a
              href="/login"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Login
            </a>
            <a
              href="/register"
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Register
            </a>
          </div>
        )}
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">Available Gigs</h2>
        <HomeGigList />
      </div>
    </main>
  );
}

// Main App Content
function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/gigs/:id" element={<ProtectedRoute><GigDetail /></ProtectedRoute>} />
        <Route path="/post-gig" element={<ProtectedRoute><PostGig /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

// Root App
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;