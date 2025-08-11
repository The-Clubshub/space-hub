import { useNavigate, useSearch } from '@tanstack/react-router';
import { CheckCircle, Calendar, MapPin, Clock, Users, Download, Share2, Home } from 'lucide-react';

const BookingSuccessPage = () => {
  const search = useSearch({ from: '/booking-success' });
  const navigate = useNavigate();
  const bookingDetails = search.bookingDetails ? JSON.parse(search.bookingDetails) : null;
  const paymentDetails = search.paymentDetails ? JSON.parse(search.paymentDetails) : null;

  if (!bookingDetails || !paymentDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Booking Information Found</h1>
          <p className="text-gray-600 mb-6">Please go back and complete your booking first.</p>
          <button
            onClick={() => navigate({ to: '/spaces' })}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Browse Spaces
          </button>
        </div>
      </div>
    );
  }

  const downloadReceipt = () => {
    // Create a simple receipt text
    const receipt = `
BOOKING CONFIRMATION
====================

Transaction ID: ${paymentDetails.transactionId}
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}

BOOKING DETAILS:
Space: ${bookingDetails.spaceName}
Facility: ${bookingDetails.facilityName}
Date: ${new Date(bookingDetails.date).toLocaleDateString()}
Time: ${bookingDetails.startTime} - ${bookingDetails.endTime}
Participants: ${bookingDetails.participants}

PAYMENT DETAILS:
Total Amount: £${bookingDetails.totalPrice.toFixed(2)}
Payment Method: ${paymentDetails.method}
Status: Paid

Thank you for your booking!
    `;

    const blob = new Blob([receipt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `booking-${paymentDetails.transactionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareBooking = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Booking Confirmation',
        text: `I just booked ${bookingDetails.spaceName} at ${bookingDetails.facilityName}!`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(
        `I just booked ${bookingDetails.spaceName} at ${bookingDetails.facilityName}!`
      );
      alert('Booking details copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-8 text-center">
            <CheckCircle size={64} className="mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-green-100">Your space has been successfully booked</p>
          </div>

          <div className="p-8">
            {/* Transaction Details */}
            <div className="bg-green-50 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-green-900 mb-4">Transaction Details</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-green-700">Transaction ID:</span>
                  <span className="font-mono font-medium">{paymentDetails.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Amount Paid:</span>
                  <span className="font-semibold">£{paymentDetails.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Payment Method:</span>
                  <span className="capitalize">{paymentDetails.method.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Status:</span>
                  <span className="text-green-600 font-semibold">✓ Confirmed</span>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin size={20} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">{bookingDetails.spaceName}</p>
                    <p className="text-sm text-gray-600">{bookingDetails.facilityName}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Calendar size={20} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {new Date(bookingDetails.date).toLocaleDateString('en-GB', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock size={20} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {bookingDetails.startTime} - {bookingDetails.endTime}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Users size={20} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {bookingDetails.participants} participant{bookingDetails.participants > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-blue-900 mb-4">What's Next?</h2>
              <div className="space-y-3 text-sm text-blue-800">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                  <span>You'll receive a confirmation email with all the details</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                  <span>Check-in instructions will be sent 2 hours before your booking</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                  <span>You can manage your booking from your profile page</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                  <span>Need to make changes? Contact us at least 24 hours in advance</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={downloadReceipt}
                className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Download size={20} />
                <span>Download Receipt</span>
              </button>
              
              <button
                onClick={shareBooking}
                className="flex items-center justify-center space-x-2 bg-blue-100 text-blue-700 py-3 px-4 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Share2 size={20} />
                <span>Share Booking</span>
              </button>
              
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center justify-center space-x-2 bg-green-100 text-green-700 py-3 px-4 rounded-lg hover:bg-green-200 transition-colors"
              >
                <Home size={20} />
                <span>View Bookings</span>
              </button>
            </div>

            {/* Back to Home */}
            <div className="text-center mt-8">
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;
