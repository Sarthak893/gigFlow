// frontend/src/components/Navbar.jsx
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo (Left) */}
        <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition">
          GigFlow
        </Link>

        {/* Navigation + Auth (Right) */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Nav Links */}
          <NavLink to="/" isActive={isActive('/')}>Home</NavLink>
          {user && <NavLink to="/dashboard" isActive={isActive('/dashboard')}>Dashboard</NavLink>}

          {/* Auth Buttons or Greeting */}
          {user ? (
            <>
              <span className="hidden sm:inline text-gray-700 font-medium">Hello, {user.name}!</span>
              <button
                onClick={handleLogout}
                className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-md text-sm font-medium transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition shadow-sm"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition shadow-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

// Reusable Nav Link
function NavLink({ to, children, isActive }) {
  return (
    <Link
      to={to}
      className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
        isActive
          ? 'bg-blue-100 text-blue-700'
          : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
      }`}
    >
      {children}
    </Link>
  );
}