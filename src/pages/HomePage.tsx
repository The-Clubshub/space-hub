import { Link } from '@tanstack/react-router';
import { ArrowRight, Users, MessageSquare, Star } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="text-center py-8 lg:py-16 px-4">
        <h1 className="text-3xl lg:text-4xl xl:text-6xl font-bold text-gray-900 mb-4 lg:mb-6">
          Welcome to{' '}
          <span className="text-indigo-600">SpaceHub</span>
        </h1>
        <p className="text-lg lg:text-xl text-gray-600 mb-6 lg:mb-8 max-w-3xl mx-auto">
          Connect with like-minded people, share ideas, and build communities in your own digital spaces.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center">
          <Link
            to="/spaces"
            className="inline-flex items-center justify-center px-6 py-4 lg:py-3 bg-indigo-600 text-white font-medium rounded-xl lg:rounded-lg hover:bg-indigo-700 transition-colors text-base lg:text-sm"
          >
            Explore Spaces
            <ArrowRight size={20} className="ml-2" />
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-6 py-4 lg:py-3 border-2 border-indigo-600 text-indigo-600 font-medium rounded-xl lg:rounded-lg hover:bg-indigo-50 transition-colors text-base lg:text-sm"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-8 lg:py-16 px-4">
        <h2 className="text-2xl lg:text-3xl font-bold text-center text-gray-900 mb-8 lg:mb-12">
          Why Choose SpaceHub?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <div className="text-center p-4 lg:p-0">
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-indigo-600" />
            </div>
            <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">
              Build Communities
            </h3>
            <p className="text-gray-600 text-sm lg:text-base">
              Create and join spaces where you can connect with people who share your interests.
            </p>
          </div>
          <div className="text-center p-4 lg:p-0">
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare size={32} className="text-indigo-600" />
            </div>
            <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">
              Share Ideas
            </h3>
            <p className="text-gray-600 text-sm lg:text-base">
              Post, comment, and engage in meaningful discussions with your community.
            </p>
          </div>
          <div className="text-center p-4 lg:p-0">
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star size={32} className="text-indigo-600" />
            </div>
            <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">
              Discover Content
            </h3>
            <p className="text-gray-600 text-sm lg:text-base">
              Find amazing content and insights from communities around the world.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-600 rounded-2xl lg:rounded-2xl p-6 lg:p-8 xl:p-12 text-center text-white mb-8 lg:mb-16 mx-4 lg:mx-0">
        <h2 className="text-2xl lg:text-3xl font-bold mb-3 lg:mb-4">
          Ready to Join the Community?
        </h2>
        <p className="text-lg lg:text-xl mb-5 lg:mb-6 opacity-90">
          Start exploring spaces and connecting with people today.
        </p>
        <Link
          to="/register"
          className="inline-flex items-center justify-center px-6 py-4 lg:py-3 bg-white text-indigo-600 font-medium rounded-xl lg:rounded-lg hover:bg-gray-100 transition-colors text-base lg:text-sm"
        >
          Create Account
          <ArrowRight size={20} className="ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default HomePage; 