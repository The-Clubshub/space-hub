import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // User Management
  users: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    avatar: v.optional(v.string()),
    bio: v.optional(v.string()),
    organization: v.optional(v.string()),
    role: v.union(v.literal("user"), v.literal("admin"), v.literal("staff"), v.literal("manager")),
    membershipStatus: v.union(v.literal("basic"), v.literal("premium"), v.literal("enterprise")),
    isVerified: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_role", ["role"])
    .index("by_created_at", ["createdAt"]),

  // Facility/Venue Management
  facilities: defineTable({
    name: v.string(),
    description: v.string(),
    address: v.string(),
    city: v.string(),
    state: v.string(),
    zipCode: v.string(),
    country: v.string(),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    contactPhone: v.string(),
    contactEmail: v.string(),
    website: v.optional(v.string()),
    images: v.array(v.string()),
    isActive: v.boolean(),
    ownerId: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_owner", ["ownerId"])
    .index("by_location", ["city", "state"])
    .index("by_active", ["isActive"])
    .index("by_created_at", ["createdAt"]),

  // Space/Resource Types
  spaces: defineTable({
    facilityId: v.id("facilities"),
    name: v.string(),
    description: v.string(),
    type: v.union(
      v.literal("sports_pitch"),
      v.literal("meeting_room"),
      v.literal("hot_desk"),
      v.literal("event_hall"),
      v.literal("equipment"),
      v.literal("other")
    ),
    sportType: v.optional(v.string()), // For sports pitches
    capacity: v.number(),
    images: v.array(v.string()),
    amenities: v.array(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_facility", ["facilityId"])
    .index("by_type", ["type"])
    .index("by_active", ["isActive"])
    .index("by_created_at", ["createdAt"]),

  // Pricing Rules
  pricingRules: defineTable({
    spaceId: v.id("spaces"),
    name: v.string(),
    basePrice: v.number(), // Price per hour
    peakPrice: v.optional(v.number()),
    offPeakPrice: v.optional(v.number()),
    weekendPrice: v.optional(v.number()),
    holidayPrice: v.optional(v.number()),
    depositPercentage: v.number(), // Percentage of total price
    minBookingDuration: v.number(), // In hours
    maxBookingDuration: v.optional(v.number()), // In hours
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_space", ["spaceId"])
    .index("by_active", ["isActive"]),

  // Availability Schedule
  availabilitySchedules: defineTable({
    spaceId: v.id("spaces"),
    dayOfWeek: v.number(), // 0-6 (Sunday-Saturday)
    openTime: v.string(), // HH:MM format
    closeTime: v.string(), // HH:MM format
    isAvailable: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_space", ["spaceId"])
    .index("by_day", ["dayOfWeek"]),

  // Blackout Dates (Maintenance, Holidays, etc.)
  blackoutDates: defineTable({
    spaceId: v.id("spaces"),
    startDate: v.string(), // YYYY-MM-DD format
    endDate: v.string(), // YYYY-MM-DD format
    reason: v.string(),
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_space", ["spaceId"])
    .index("by_date_range", ["startDate", "endDate"])
    .index("by_active", ["isActive"]),

  // Bookings
  bookings: defineTable({
    userId: v.id("users"),
    spaceId: v.id("spaces"),
    facilityId: v.id("facilities"),
    startTime: v.string(), // ISO datetime string
    endTime: v.string(), // ISO datetime string
    duration: v.number(), // In hours
    participants: v.number(),
    totalPrice: v.number(),
    depositAmount: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("cancelled"),
      v.literal("completed"),
      v.literal("no_show")
    ),
    paymentStatus: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("partially_paid"),
      v.literal("refunded")
    ),
    specialRequests: v.optional(v.string()),
    isRecurring: v.boolean(),
    recurringPattern: v.optional(v.string()), // JSON string for recurring pattern
    parentBookingId: v.optional(v.id("bookings")), // For recurring bookings
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_space", ["spaceId"])
    .index("by_facility", ["facilityId"])
    .index("by_status", ["status"])
    .index("by_date", ["startTime"])
    .index("by_created_at", ["createdAt"]),

  // Payments
  payments: defineTable({
    bookingId: v.id("bookings"),
    userId: v.id("users"),
    amount: v.number(),
    currency: v.string(),
    paymentMethod: v.union(
      v.literal("credit_card"),
      v.literal("debit_card"),
      v.literal("paypal"),
      v.literal("apple_pay"),
      v.literal("google_pay"),
      v.literal("cash"),
      v.literal("bank_transfer")
    ),
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("refunded")
    ),
    transactionId: v.optional(v.string()),
    receiptUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_booking", ["bookingId"])
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_created_at", ["createdAt"]),

  // Waitlist
  waitlist: defineTable({
    userId: v.id("users"),
    spaceId: v.id("spaces"),
    facilityId: v.id("facilities"),
    requestedDate: v.string(), // YYYY-MM-DD format
    requestedStartTime: v.string(), // HH:MM format
    requestedEndTime: v.string(), // HH:MM format
    participants: v.number(),
    status: v.union(v.literal("waiting"), v.literal("notified"), v.literal("expired")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_space", ["spaceId"])
    .index("by_date", ["requestedDate"])
    .index("by_status", ["status"]),

  // User Favorites
  userFavorites: defineTable({
    userId: v.id("users"),
    spaceId: v.id("spaces"),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_space", ["spaceId"])
    .index("by_user_and_space", ["userId", "spaceId"]),

  // Notifications
  notifications: defineTable({
    userId: v.id("users"),
    type: v.union(
      v.literal("booking_confirmation"),
      v.literal("booking_reminder"),
      v.literal("booking_cancellation"),
      v.literal("payment_receipt"),
      v.literal("waitlist_available"),
      v.literal("system_message")
    ),
    title: v.string(),
    message: v.string(),
    bookingId: v.optional(v.id("bookings")),
    isRead: v.boolean(),
    isEmailSent: v.boolean(),
    isSMSSent: v.boolean(),
    isPushSent: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_type", ["type"])
    .index("by_read", ["isRead"])
    .index("by_created_at", ["createdAt"]),

  // Reviews & Ratings
  reviews: defineTable({
    userId: v.id("users"),
    spaceId: v.id("spaces"),
    facilityId: v.id("facilities"),
    bookingId: v.id("bookings"),
    rating: v.number(), // 1-5 stars
    comment: v.optional(v.string()),
    isPublic: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_space", ["spaceId"])
    .index("by_facility", ["facilityId"])
    .index("by_booking", ["bookingId"])
    .index("by_rating", ["rating"])
    .index("by_created_at", ["createdAt"]),

  // Promo Codes
  promoCodes: defineTable({
    code: v.string(),
    description: v.string(),
    discountType: v.union(v.literal("percentage"), v.literal("fixed_amount")),
    discountValue: v.number(),
    maxUses: v.optional(v.number()),
    currentUses: v.number(),
    validFrom: v.string(), // ISO datetime string
    validUntil: v.string(), // ISO datetime string
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_code", ["code"])
    .index("by_active", ["isActive"])
    .index("by_validity", ["validFrom", "validUntil"]),

  // Promo Code Usage
  promoCodeUsage: defineTable({
    promoCodeId: v.id("promoCodes"),
    userId: v.id("users"),
    bookingId: v.id("bookings"),
    discountAmount: v.number(),
    createdAt: v.number(),
  })
    .index("by_promo_code", ["promoCodeId"])
    .index("by_user", ["userId"])
    .index("by_booking", ["bookingId"]),
}); 