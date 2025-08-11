import { Link } from '@tanstack/react-router';
import { Plus, Users, Tag, Edit } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

const SpacesPage = () => {
  // Fetch data from Convex
  const spaces = useQuery(api.spaces.list);
  const facilities = useQuery(api.facilities.list);
  const pricingRules = useQuery(api.pricing.list);

  // Map data together
  const spacesWithDetails = spaces?.map(space => {
    const facility = facilities?.find(f => f._id === space.facilityId);
    const pricing = pricingRules?.find(p => p.spaceId === space._id);
    
    return {
      ...space,
      facility,
      pricing: pricing || null,
      // Ensure images and amenities are arrays
      images: Array.isArray(space.images) ? space.images : [],
      amenities: Array.isArray(space.amenities) ? space.amenities : []
    };
  }) || [];

  if (!spacesWithDetails) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 lg:mb-8 gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Spaces</h1>
        <Link 
          to="/spaces/create" 
          className="w-full lg:w-auto inline-flex items-center justify-center px-4 py-3 lg:py-2 bg-indigo-600 text-white rounded-xl lg:rounded-lg hover:bg-indigo-700 transition-colors text-base lg:text-sm"
        >
          <Plus size={20} className="mr-2" />
          Create Space
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {spacesWithDetails?.map((space: any) => {
          return (
            <div key={space._id} className="bg-white rounded-xl lg:rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img 
                src={space.images && space.images.length > 0 ? space.images[0] : 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'} 
                alt={space.name} 
                className="w-full h-48 object-cover" 
              />
              <div className="p-4 lg:p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                    {space.type.replace('_', ' ').toUpperCase()}
                  </span>
                  {space.sportType && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                      {space.sportType.toUpperCase()}
                    </span>
                  )}
                </div>
                
                <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">
                  <Link to="/spaces/$spaceId" params={{ spaceId: space._id }} className="hover:text-indigo-600">
                    {space.name}
                  </Link>
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2 text-sm lg:text-base">{space.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Users size={16} className="mr-1" />
                    <span>Capacity: {space.capacity}</span>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    {space.pricing ? `£${space.pricing.basePrice}/hour` : 'Price not set'}
                  </div>
                </div>

                {space.amenities && Array.isArray(space.amenities) && space.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {space.amenities.slice(0, 3).map((amenity: string, index: number) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        <Tag size={12} className="mr-1" />
                        {amenity}
                      </span>
                    ))}
                    {space.amenities.length > 3 && (
                      <span className="text-xs text-gray-500">+{space.amenities.length - 3} more</span>
                    )}
                  </div>
                )}

                <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2">
                  <Link
                    to="/spaces/$spaceId"
                    params={{ spaceId: space._id }}
                    className="flex-1 text-center text-indigo-600 hover:text-indigo-800 font-medium py-3 lg:py-2 border-2 border-indigo-600 rounded-xl lg:rounded hover:bg-indigo-50 transition-colors text-base lg:text-sm"
                  >
                    View Details
                  </Link>
                  <Link
                    to="/spaces/$spaceId/edit"
                    params={{ spaceId: space._id }}
                    className="flex-shrink-0 text-center text-green-600 hover:text-green-800 font-medium py-3 lg:py-2 px-4 lg:px-3 border-2 border-green-600 rounded-xl lg:rounded hover:bg-green-50 transition-colors text-base lg:text-sm"
                    title="Edit Space"
                  >
                    <Edit size={16} />
                  </Link>
                  <Link
                    to="/spaces/$spaceId/book"
                    params={{ spaceId: space._id }}
                    className="flex-1 text-center bg-blue-600 text-white py-3 lg:py-2 rounded-xl lg:rounded hover:bg-blue-700 transition-colors text-base lg:text-sm"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {spacesWithDetails.length === 0 && (
        <div className="text-center py-12 lg:py-16">
          <div className="text-gray-400 mb-4">
            <Users size={64} className="mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No spaces yet</h3>
          <p className="text-gray-600 mb-6">Be the first to create a space and start building a community!</p>
          <button className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-xl lg:rounded-lg hover:bg-indigo-700 transition-colors text-base">
            <Plus size={20} className="mr-2" />
            Create Your First Space
          </button>
        </div>
      )}
    </div>
  );
};

export default SpacesPage; 