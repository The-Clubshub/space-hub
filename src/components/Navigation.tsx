import { Link, useRouter } from '@tanstack/react-router';
import { Home, Users, User, LogIn, Menu, X, Plus } from 'lucide-react';
import { useState } from 'react';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const user = null; // Temporarily disabled until Convex is properly set up

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/spaces', label: 'Spaces', icon: Users },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const isActive = (path: string) => router.state.location.pathname === path;

  return (
    <>
      {/* Desktop Top Navigation */}
      <nav className="hidden lg:block bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-indigo-600">SpaceHub</span>
              </Link>
            </div>

            <div className="flex items-center space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? 'text-indigo-600 bg-indigo-50'
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              {!user ? (
                <Link
                  to="/login"
                  className="flex items-center space-x-1 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  <LogIn size={16} />
                  <span>Login</span>
                </Link>
              ) : (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">Welcome, User</span>
                  <button className="text-sm text-gray-500 hover:text-gray-700">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Tab Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-padding">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  isActive(item.path)
                    ? 'text-indigo-600'
                    : 'text-gray-500 hover:text-indigo-600'
                }`}
              >
                <Icon size={20} className="mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
          
          {/* Add Space Button */}
          <Link
            to="/spaces/create"
            className="flex flex-col items-center justify-center flex-1 h-full text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center mb-1">
              <Plus size={20} className="text-white" />
            </div>
            <span className="text-xs font-medium">Add Space</span>
          </Link>
        </div>
      </nav>

      {/* Mobile Top Bar with Menu - Added safe area top padding */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 pt-safe">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex-shrink-0 flex items-center">
            <span className="text-lg font-bold text-indigo-600">SpaceHub</span>
          </Link>
          
          <div className="flex items-center space-x-3">
            {!user && (
              <Link
                to="/login"
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-md text-sm font-medium"
              >
                Login
              </Link>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
            <div className="px-4 py-3 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive(item.path)
                        ? 'text-indigo-600 bg-indigo-50'
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              {user && (
                <div className="px-3 py-2 border-t border-gray-100">
                  <span className="text-sm text-gray-700">Welcome, User</span>
                  <button className="block mt-2 text-sm text-gray-500 hover:text-gray-700">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom padding for mobile to account for tab bar */}
      <div className="lg:hidden h-16"></div>
    </>
  );
};

export default Navigation; 