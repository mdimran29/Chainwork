import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useWalletAuth } from '../hooks/useWalletAuth';
import { WalletButton } from '../components/WalletButton';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useWalletAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
      isActive
        ? 'text-primary-600 bg-primary-100'
        : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
    }`;

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-secondary-200/60 shadow-sm">
        <div className="w-full px-6 lg:px-10 flex items-center justify-between h-16">
          {/* Brand */}
          <NavLink
            to="/"
            className="flex items-center gap-2.5 shrink-0 group"
          >
            <img
              src="/logo.png"
              alt="ChainWork Logo"
              className="h-10 w-10 rounded-lg object-cover shadow-md group-hover:shadow-primary-300 transition-shadow duration-200"
            />
            <span className="text-xl font-bold gradient-text">ChainWork</span>
          </NavLink>

          {/* Desktop Menu */}
          <div className="flex items-center gap-1">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/jobs" className={navLinkClass}>Jobs</NavLink>

            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
                <NavLink to="/profile" className={navLinkClass}>Profile</NavLink>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-lg text-sm font-semibold text-secondary-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navLinkClass}>Login</NavLink>
                <NavLink
                  to="/register"
                  className="ml-1 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 transition-all duration-200 btn-glow"
                >
                  Register
                </NavLink>
              </>
            )}

            <div className="ml-2">
              <WalletButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="md:hidden sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-secondary-200/60 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <NavLink to="/" className="flex items-center gap-2 group">
            <img
              src="/logo.png"
              alt="ChainWork Logo"
              className="h-10 w-10 rounded-lg object-cover shadow-md"
            />
            <span className="text-lg font-bold gradient-text">ChainWork</span>
          </NavLink>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-secondary-600 hover:text-primary-600 hover:bg-primary-50 focus:outline-none transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu Items */}
        {isMobileMenuOpen && (
          <div className="px-3 pt-1 pb-4 space-y-1 border-t border-secondary-100 bg-white/95 backdrop-blur-lg">
            {[
              { to: '/', label: 'Home' },
              { to: '/jobs', label: 'Jobs' },
              ...(isAuthenticated
                ? [
                    { to: '/dashboard', label: 'Dashboard' },
                    { to: '/profile', label: 'Profile' },
                  ]
                : [
                    { to: '/login', label: 'Login' },
                    { to: '/register', label: 'Register' },
                  ]),
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2.5 rounded-lg text-base font-semibold transition-colors ${
                    isActive
                      ? 'text-primary-600 bg-primary-100'
                      : 'text-secondary-700 hover:text-primary-600 hover:bg-primary-50'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            {isAuthenticated && (
              <button
                onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold text-red-600 hover:bg-red-50 transition-colors"
              >
                Logout
              </button>
            )}
            <div className="pt-2 px-1">
              <WalletButton />
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
