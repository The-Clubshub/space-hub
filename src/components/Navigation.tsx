import { Link, useRouter } from '@tanstack/react-router';
import { Home, Users, User, LogIn, Menu, X } from 'lucide-react';
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
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-indigo-600">SpaceHub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
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

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
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
            
            {!user ? (
              <Link
                to="/login"
                className="flex items-center space-x-2 px-3 py-2 bg-indigo-600 text-white rounded-md text-base font-medium hover:bg-indigo-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <LogIn size={20} />
                <span>Login</span>
              </Link>
                         ) : (
               <div className="px-3 py-2">
                 <span className="text-sm text-gray-700">Welcome, User</span>
                 <button className="block mt-2 text-sm text-gray-500 hover:text-gray-700">
                   Logout
                 </button>
               </div>
             )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation; 