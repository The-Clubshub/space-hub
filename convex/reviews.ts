import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createReview = mutation({
  args: {
    userId: v.id("users"),
    spaceId: v.id("spaces"),
    facilityId: v.id("facilities"),
    bookingId: v.id("bookings"),
    rating: v.number(),
    comment: v.optional(v.string()),
    isPublic: v.boolean(),
  },
  handler: async (ctx, args) => {
    const reviewId = await ctx.db.insert("reviews", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return reviewId;
  },
});

export const getBySpace = query({
  args: { spaceId: v.id("spaces") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reviews")
      .withIndex("by_space", (q) => q.eq("spaceId", args.spaceId))
      .filter((q) => q.eq(q.field("isPublic"), true))
      .order("desc")
      .collect();
  },
});

export const getByFacility = query({
  args: { facilityId: v.id("facilities") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reviews")
      .withIndex("by_facility", (q) => q.eq("facilityId", args.facilityId))
      .filter((q) => q.eq(q.field("isPublic"), true))
      .order("desc")
      .collect();
  },
});

export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reviews")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const updateReview = mutation({
  args: {
    id: v.id("reviews"),
    rating: v.optional(v.number()),
    comment: v.optional(v.string()),
    isPublic: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

export const deleteReview = mutation({
  args: { id: v.id("reviews") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Get average rating for a space
export const getAverageRating = query({
  args: { spaceId: v.id("spaces") },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_space", (q) => q.eq("spaceId", args.spaceId))
      .filter((q) => q.eq(q.field("isPublic"), true))
      .collect();

    if (reviews.length === 0) {
      return { averageRating: 0, totalReviews: 0 };
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    return {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      totalReviews: reviews.length,
    };
  },
});
