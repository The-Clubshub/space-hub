import { MessageSquare, Heart, Share, Users, Calendar, Star, Edit } from 'lucide-react';
import { Link, useParams } from '@tanstack/react-router';

const SpaceDetailPage = () => {
  const { spaceId } = useParams({ from: '/spaces/$spaceId' });
  
  const space = { 
    _id: spaceId,
    name: "Premium Football Pitch", 
    description: "Professional-grade football pitch with floodlights and changing rooms. Perfect for competitive matches and training sessions.", 
    type: "sports_pitch",
    sportType: "football",
    capacity: 22,
    images: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800"],
    amenities: ["Floodlights", "Changing Rooms", "Parking", "Refreshments"],
    facility: {
      name: "Sports Complex Central",
      address: "123 Sports Lane, Downtown",
      city: "Manchester",
      rating: 4.8,
      reviewCount: 127
    },
    pricing: {
      basePrice: 80,
      peakPrice: 120,
      offPeakPrice: 60,
      weekendPrice: 100
    }
  }; // Mock data
  const posts: any[] = []; // Mock data

  if (!space) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Space Header */}
        <div className="relative h-64">
          <img 
            src={space.images && space.images.length > 0 ? space.images[0] : 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'} 
            alt={space.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="flex items-center justify-center gap-4 mb-2">
                <h1 className="text-4xl font-bold">{space.name}</h1>
                <Link
                  to="/spaces/$spaceId/edit"
                  params={{ spaceId: space._id }}
                  className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors backdrop-blur-sm"
                  title="Edit Space"
                >
                  <Edit size={20} />
                </Link>
              </div>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">{space.description}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Space Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-4 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                  {space.type.replace('_', ' ').toUpperCase()}
                </span>
                {space.sportType && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                    {space.sportType.toUpperCase()}
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <Users size={16} className="mr-1" />
                  <span>Capacity: {space.capacity} people</span>
                </div>
                <div className="flex items-center">
                  <Star size={16} className="mr-1" />
                  <span>{space.facility?.rating || 'N/A'} ({space.facility?.reviewCount || 0} reviews)</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {space.amenities && Array.isArray(space.amenities) && space.amenities.length > 0 ? (
                    space.amenities.map((amenity, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                        {amenity}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">No amenities listed</span>
                  )}
                </div>
              </div>
            </div>

            {/* Booking Card */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Book This Space</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Price:</span>
                  <span className="font-semibold">£{space.pricing?.basePrice || 'N/A'}/hour</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Peak Price:</span>
                  <span className="font-semibold">£{space.pricing?.peakPrice || 'N/A'}/hour</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Weekend:</span>
                  <span className="font-semibold">£{space.pricing?.weekendPrice || 'N/A'}/hour</span>
                </div>
              </div>

              <Link
                to={`/spaces/1/book`}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Calendar size={20} className="mr-2" />
                Book Now
              </Link>
            </div>
          </div>

          {/* Posts Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Posts</h2>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Create Post
              </button>
            </div>

            {posts && posts.length > 0 ? (
              posts.map((post) => (
                <div key={post._id} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.content}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center text-gray-500 hover:text-red-500 transition-colors">
                        <Heart size={16} className="mr-1" />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center text-gray-500 hover:text-indigo-500 transition-colors">
                        <MessageSquare size={16} className="mr-1" />
                        <span>Comment</span>
                      </button>
                      <button className="flex items-center text-gray-500 hover:text-gray-700 transition-colors">
                        <Share size={16} className="mr-1" />
                        <span>Share</span>
                      </button>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-white rounded-lg shadow-md">
                <MessageSquare size={64} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-600 mb-6">Be the first to share something in this space!</p>
                <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  Create First Post
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceDetailPage; 