import { useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { Calendar, Clock, Users, CreditCard, MapPin, Star, CheckCircle } from 'lucide-react';

const BookingPage = () => {
  const { spaceId } = useParams({ from: '/spaces/$spaceId/book' });
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [participants, setParticipants] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringPattern, setRecurringPattern] = useState('weekly');
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  // Mock data for now - will be replaced with Convex queries
  const space = {
    _id: spaceId,
    name: "Premium Football Pitch",
    description: "Professional-grade football pitch with floodlights and changing rooms",
    type: "sports_pitch",
    sportType: "football",
    capacity: 22,
    images: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800"],
    amenities: ["Floodlights", "Changing Rooms", "Parking", "Refreshments"],
    facilityId: "facility1"
  };

  const facility = {
    _id: "facility1",
    name: "Sports Complex Central",
    address: "123 Sports Lane, Downtown",
    city: "Manchester",
    rating: 4.8,
    reviewCount: 127
  };

  const pricing = {
    basePrice: 80,
    peakPrice: 120,
    offPeakPrice: 60,
    weekendPrice: 100,
    depositPercentage: 25
  };

  const availability = {
    isAvailable: true,
    reason: null
  };

  const calculatePrice = () => {
    if (!startTime || !endTime || !pricing) return 0;
    
    const start = new Date(`2024-01-01T${startTime}`);
    const end = new Date(`2024-01-01T${endTime}`);
    const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    
    const isWeekend = new Date(selectedDate).getDay() === 0 || new Date(selectedDate).getDay() === 6;
    const hour = start.getHours();
    const isPeak = hour >= 17 || hour <= 9;
    
    let hourlyRate = pricing.basePrice;
    if (isWeekend && pricing.weekendPrice) {
      hourlyRate = pricing.weekendPrice;
    } else if (isPeak && pricing.peakPrice) {
      hourlyRate = pricing.peakPrice;
    } else if (!isPeak && pricing.offPeakPrice) {
      hourlyRate = pricing.offPeakPrice;
    }
    
    return hourlyRate * duration;
  };

  const totalPrice = calculatePrice();
  const depositAmount = pricing ? (totalPrice * pricing.depositPercentage) / 100 : 0;
  const finalPrice = totalPrice - discountAmount;

  const handleBooking = async () => {
    if (!space || !facility || !pricing) return;

    try {
      // Mock booking creation - will be replaced with Convex mutation
      const bookingId = "booking_" + Math.random().toString(36).substr(2, 9);
      
      console.log('Creating booking:', {
        bookingId,
        spaceId,
        spaceName: space.name,
        facilityName: facility.name,
        date: selectedDate,
        startTime,
        endTime,
        participants,
        totalPrice: finalPrice,
        depositAmount
      });

      // Navigate to payment page
      navigate({ 
        to: '/payment',
        search: { 
          bookingDetails: JSON.stringify({
            bookingId,
            spaceId,
            spaceName: space.name,
            facilityName: facility.name,
            date: selectedDate,
            startTime,
            endTime,
            participants,
            totalPrice: finalPrice,
            depositAmount
          })
        }
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    }
  };

  const handlePromoCodeValidation = async () => {
    if (!promoCode) return;
    
    // Mock promo code validation - will be replaced with Convex query
    if (promoCode.toUpperCase() === 'WELCOME10') {
      setDiscountAmount(finalPrice * 0.1); // 10% discount
      alert('Promo code applied successfully!');
    } else {
      alert('Invalid promo code');
    }
  };

  // Loading state
  if (!space || !facility) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900">Loading space details...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <h1 className="text-2xl font-bold">Book Your Space</h1>
            <p className="text-blue-100 mt-2">Complete your booking in just a few steps</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
            {/* Main Booking Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Space Details */}
              {space && facility && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    <img 
                      src={space.images[0]} 
                      alt={space.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-900">{space.name}</h2>
                      <p className="text-gray-600 mt-1">{space.description}</p>
                      <div className="flex items-center mt-2">
                        <MapPin size={16} className="text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600">{facility.name}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <Star size={16} className="text-yellow-400 mr-1" />
                        <span className="text-sm text-gray-600">4.8 (127 reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Date Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Select Date & Time</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar size={16} className="inline mr-2" />
                      Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Users size={16} className="inline mr-2" />
                      Participants
                    </label>
                    <input
                      type="number"
                      value={participants}
                      onChange={(e) => setParticipants(parseInt(e.target.value))}
                      min={1}
                      max={space.capacity}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock size={16} className="inline mr-2" />
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock size={16} className="inline mr-2" />
                      End Time
                    </label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Recurring Booking */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="recurring"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="recurring" className="ml-2 text-sm font-medium text-gray-700">
                    Make this a recurring booking
                  </label>
                </div>
                
                {isRecurring && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recurring Pattern
                    </label>
                    <select
                      value={recurringPattern}
                      onChange={(e) => setRecurringPattern(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Promo Code */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Promo Code (Optional)</h3>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Enter promo code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handlePromoCodeValidation}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {discountAmount > 0 && (
                  <div className="text-green-600 text-sm">
                    ✓ Promo code applied! You saved £{discountAmount.toFixed(2)}
                  </div>
                )}
              </div>

              {/* Special Requests */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Special Requests</h3>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Any special requirements or requests..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Booking Summary */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Space:</span>
                    <span className="font-medium">{space?.name || 'Loading...'}</span>
                  </div>
                  
                  {selectedDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{new Date(selectedDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  
                  {startTime && endTime && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">{startTime} - {endTime}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Participants:</span>
                    <span className="font-medium">{participants}</span>
                  </div>
                  
                  {isRecurring && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Recurring:</span>
                      <span className="font-medium capitalize">{recurringPattern}</span>
                    </div>
                  )}
                </div>
                
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Base Price:</span>
                    <span>£{totalPrice.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount:</span>
                      <span>-£{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-semibold mt-2">
                    <span>Final Price:</span>
                    <span>£{finalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>Deposit Required:</span>
                    <span>£{depositAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              {space && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Included Amenities</h3>
                  <div className="space-y-2">
                    {space.amenities.map((amenity: string, index: number) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle size={16} className="text-green-500 mr-2" />
                        <span className="text-sm text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Availability Status */}
              {availability && (
                <div className={`p-3 rounded-lg mb-4 ${
                  availability.isAvailable 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      availability.isAvailable ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-sm font-medium">
                      {availability.isAvailable ? 'Available' : 'Not Available'}
                    </span>
                  </div>
                  {!availability.isAvailable && availability.reason && (
                    <p className="text-xs mt-1">{availability.reason}</p>
                  )}
                </div>
              )}

              {/* Book Button */}
              <button
                onClick={handleBooking}
                disabled={!selectedDate || !startTime || !endTime || (availability && !availability.isAvailable)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <CreditCard size={20} className="inline mr-2" />
                {availability && !availability.isAvailable ? 'Not Available' : 'Proceed to Payment'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
