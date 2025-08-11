import { useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { CreditCard, Lock, CheckCircle, ArrowLeft } from 'lucide-react';

const PaymentPage = () => {
  const search = useSearch({ from: '/payment' });
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const bookingDetails = search.bookingDetails ? JSON.parse(search.bookingDetails) : null;

  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Booking Details Found</h1>
          <p className="text-gray-600 mb-6">Please go back and complete your booking first.</p>
          <button
            onClick={() => navigate('/spaces')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Browse Spaces
          </button>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Navigate to success page after 2 seconds
      setTimeout(() => {
        navigate('/booking-success', { 
          state: { 
            bookingDetails,
            paymentDetails: {
              transactionId: 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase(),
              amount: bookingDetails.totalPrice,
              method: paymentMethod
            }
          }
        });
      }, 2000);
    }, 3000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">Your booking has been confirmed. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="mr-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold">Complete Your Payment</h1>
                <p className="text-green-100 mt-2">Secure payment powered by Stripe</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Payment Form */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-gray-600">
                <Lock size={16} />
                <span className="text-sm">Your payment information is secure and encrypted</span>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'credit_card', label: 'Credit Card', icon: '💳' },
                    { id: 'debit_card', label: 'Debit Card', icon: '💳' },
                    { id: 'paypal', label: 'PayPal', icon: '🔵' },
                    { id: 'apple_pay', label: 'Apple Pay', icon: '🍎' }
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`p-4 border-2 rounded-lg text-left transition-colors ${
                        paymentMethod === method.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{method.icon}</span>
                        <span className="font-medium">{method.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Details */}
              {paymentMethod.includes('card') && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Card Details</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        placeholder="123"
                        maxLength={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Pay Button */}
              <button
                onClick={handlePayment}
                disabled={isProcessing || (paymentMethod.includes('card') && (!cardNumber || !expiryDate || !cvv || !cardholderName))}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing Payment...
                  </div>
                ) : (
                  <>
                    <CreditCard size={20} className="inline mr-2" />
                    Pay £{bookingDetails.totalPrice.toFixed(2)}
                  </>
                )}
              </button>
            </div>

            {/* Booking Summary */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Space:</span>
                    <span className="font-medium">{bookingDetails.spaceName}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Facility:</span>
                    <span className="font-medium">{bookingDetails.facilityName}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{new Date(bookingDetails.date).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{bookingDetails.startTime} - {bookingDetails.endTime}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Participants:</span>
                    <span className="font-medium">{bookingDetails.participants}</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total Amount:</span>
                    <span>£{bookingDetails.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>Deposit:</span>
                    <span>£{bookingDetails.depositAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Remaining:</span>
                    <span>£{(bookingDetails.totalPrice - bookingDetails.depositAmount).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Security Info */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Security & Privacy</h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <div className="flex items-start">
                    <Lock size={16} className="text-blue-600 mr-2 mt-0.5" />
                    <span>Your payment information is encrypted and secure</span>
                  </div>
                  <div className="flex items-start">
                    <Lock size={16} className="text-blue-600 mr-2 mt-0.5" />
                    <span>We never store your full card details</span>
                  </div>
                  <div className="flex items-start">
                    <Lock size={16} className="text-blue-600 mr-2 mt-0.5" />
                    <span>PCI DSS compliant payment processing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
