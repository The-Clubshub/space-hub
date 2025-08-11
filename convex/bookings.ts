import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    userId: v.id("users"),
    spaceId: v.id("spaces"),
    facilityId: v.id("facilities"),
    startTime: v.string(),
    endTime: v.string(),
    duration: v.number(),
    participants: v.number(),
    totalPrice: v.number(),
    depositAmount: v.number(),
    specialRequests: v.optional(v.string()),
    isRecurring: v.boolean(),
    recurringPattern: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const bookingId = await ctx.db.insert("bookings", {
      ...args,
      status: "pending",
      paymentStatus: "pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return bookingId;
  },
});

export const get = query({
  args: { id: v.id("bookings") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("bookings")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const getBySpace = query({
  args: { spaceId: v.id("spaces") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("bookings")
      .withIndex("by_space", (q) => q.eq("spaceId", args.spaceId))
      .order("desc")
      .collect();
  },
});

export const getByFacility = query({
  args: { facilityId: v.id("facilities") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("bookings")
      .withIndex("by_facility", (q) => q.eq("facilityId", args.facilityId))
      .order("desc")
      .collect();
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("bookings"),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("cancelled"),
      v.literal("completed"),
      v.literal("no_show")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

export const updatePaymentStatus = mutation({
  args: {
    id: v.id("bookings"),
    paymentStatus: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("partially_paid"),
      v.literal("refunded")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      paymentStatus: args.paymentStatus,
      updatedAt: Date.now(),
    });
  },
});

export const cancel = mutation({
  args: { id: v.id("bookings") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "cancelled",
      updatedAt: Date.now(),
    });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("bookings").order("desc").collect();
  },
});

// Check availability for a specific time slot
export const checkAvailability = query({
  args: {
    spaceId: v.id("spaces"),
    startTime: v.string(),
    endTime: v.string(),
  },
  handler: async (ctx, args) => {
    const conflictingBookings = await ctx.db
      .query("bookings")
      .withIndex("by_space", (q) => q.eq("spaceId", args.spaceId))
      .filter((q) => 
        q.and(
          q.neq(q.field("status"), "cancelled"),
          q.or(
            q.and(
              q.lte(q.field("startTime"), args.startTime),
              q.gt(q.field("endTime"), args.startTime)
            ),
            q.and(
              q.lt(q.field("startTime"), args.endTime),
              q.gte(q.field("endTime"), args.endTime)
            ),
            q.and(
              q.gte(q.field("startTime"), args.startTime),
              q.lte(q.field("endTime"), args.endTime)
            )
          )
        )
      )
      .collect();
    
    return {
      isAvailable: conflictingBookings.length === 0,
      conflictingBookings,
    };
  },
});
