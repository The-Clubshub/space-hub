import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email('Please enter a valid email address');
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters');
export const phoneSchema = z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number');

// User schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  phone: phoneSchema.optional(),
  organization: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Space Type enum
export const spaceTypeSchema = z.enum([
  'sports_pitch',
  'meeting_room',
  'hot_desk',
  'event_hall',
  'equipment',
  'other'
]);

// Day of week schema for availability
export const dayOfWeekSchema = z.object({
  isOpen: z.boolean(),
  openTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  closeTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  isPeak: z.boolean(),
  peakStartTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  peakEndTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
}).refine((data) => {
  if (!data.isOpen) return true;
  
  const openTime = new Date(`2000-01-01T${data.openTime}`);
  const closeTime = new Date(`2000-01-01T${data.closeTime}`);
  return openTime < closeTime;
}, {
  message: "Close time must be after open time",
  path: ["closeTime"],
}).refine((data) => {
  if (!data.isPeak || !data.isOpen) return true;
  
  const peakStart = new Date(`2000-01-01T${data.peakStartTime}`);
  const peakEnd = new Date(`2000-01-01T${data.peakEndTime}`);
  const openTime = new Date(`2000-01-01T${data.openTime}`);
  const closeTime = new Date(`2000-01-01T${data.closeTime}`);
  
  return peakStart >= openTime && peakEnd <= closeTime && peakStart < peakEnd;
}, {
  message: "Peak hours must be within operating hours and peak start must be before peak end",
  path: ["peakEndTime"],
});

// Schedule schema for all days
export const scheduleSchema = z.object({
  monday: dayOfWeekSchema,
  tuesday: dayOfWeekSchema,
  wednesday: dayOfWeekSchema,
  thursday: dayOfWeekSchema,
  friday: dayOfWeekSchema,
  saturday: dayOfWeekSchema,
  sunday: dayOfWeekSchema,
});

// Create Space schema
export const createSpaceSchema = z.object({
  name: z.string().min(2, 'Space name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  type: spaceTypeSchema,
  sportType: z.string().optional(),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  images: z.array(z.string().url('Invalid image URL')).min(1, 'At least one image is required'),
  amenities: z.array(z.string()),
  facilityId: z.string().min(1, 'Please select a facility'),
  
  // Pricing
  basePrice: z.number().min(0, 'Base price must be 0 or greater'),
  peakPrice: z.number().min(0, 'Peak price must be 0 or greater').optional(),
  offPeakPrice: z.number().min(0, 'Off-peak price must be 0 or greater').optional(),
  weekendPrice: z.number().min(0, 'Weekend price must be 0 or greater').optional(),
  depositPercentage: z.number().min(0, 'Deposit percentage must be 0 or greater').max(100, 'Deposit percentage cannot exceed 100'),
  minBookingDuration: z.number().min(0.5, 'Minimum booking duration must be at least 0.5 hours'),
  maxBookingDuration: z.number().min(1, 'Maximum booking duration must be at least 1 hour').optional(),
  
  // Schedule
  schedule: scheduleSchema,
}).refine((data) => {
  if (data.maxBookingDuration && data.maxBookingDuration < data.minBookingDuration) {
    return false;
  }
  return true;
}, {
  message: "Maximum booking duration must be greater than minimum booking duration",
  path: ["maxBookingDuration"],
}).refine((data) => {
  if (data.type === 'sports_pitch' && !data.sportType) {
    return false;
  }
  return true;
}, {
  message: "Sport type is required for sports pitches",
  path: ["sportType"],
});

// Booking schema
export const bookingSchema = z.object({
  spaceId: z.string().min(1, 'Space ID is required'),
  selectedDate: z.string().min(1, 'Please select a date'),
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid start time format'),
  endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid end time format'),
  participants: z.number().min(1, 'At least 1 participant is required'),
  specialRequests: z.string().optional(),
  isRecurring: z.boolean(),
  recurringPattern: z.enum(['weekly', 'monthly']).optional(),
  promoCode: z.string().optional(),
}).refine((data) => {
  const startTime = new Date(`2000-01-01T${data.startTime}`);
  const endTime = new Date(`2000-01-01T${data.endTime}`);
  return startTime < endTime;
}, {
  message: "End time must be after start time",
  path: ["endTime"],
}).refine((data) => {
  const selectedDate = new Date(data.selectedDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate >= today;
}, {
  message: "Cannot book for past dates",
  path: ["selectedDate"],
});

// Payment schema
export const paymentSchema = z.object({
  paymentMethod: z.enum(['credit_card', 'debit_card', 'paypal', 'apple_pay', 'google_pay']),
  cardNumber: z.string().regex(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/, 'Invalid card number format').optional(),
  expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, 'Invalid expiry date format (MM/YY)').optional(),
  cvv: z.string().regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits').optional(),
  cardholderName: z.string().min(2, 'Cardholder name is required').optional(),
}).refine((data) => {
  if (data.paymentMethod === 'credit_card' || data.paymentMethod === 'debit_card') {
    return !!(data.cardNumber && data.expiryDate && data.cvv && data.cardholderName);
  }
  return true;
}, {
  message: "Card details are required for card payments",
  path: ["cardNumber"],
});

// Export types
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type CreateSpaceFormData = z.infer<typeof createSpaceSchema>;
export type BookingFormData = z.infer<typeof bookingSchema>;
export type PaymentFormData = z.infer<typeof paymentSchema>;
export type DayOfWeek = z.infer<typeof dayOfWeekSchema>;
export type Schedule = z.infer<typeof scheduleSchema>;
