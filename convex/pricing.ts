import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    spaceId: v.id("spaces"),
    name: v.string(),
    basePrice: v.number(),
    peakPrice: v.optional(v.number()),
    offPeakPrice: v.optional(v.number()),
    weekendPrice: v.optional(v.number()),
    holidayPrice: v.optional(v.number()),
    depositPercentage: v.number(),
    minBookingDuration: v.number(),
    maxBookingDuration: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const pricingId = await ctx.db.insert("pricingRules", {
      ...args,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return pricingId;
  },
});

export const get = query({
  args: { id: v.id("pricingRules") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getBySpace = query({
  args: { spaceId: v.id("spaces") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pricingRules")
      .withIndex("by_space", (q) => q.eq("spaceId", args.spaceId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("pricingRules")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

export const update = mutation({
  args: {
    id: v.id("pricingRules"),
    name: v.optional(v.string()),
    basePrice: v.optional(v.number()),
    peakPrice: v.optional(v.number()),
    offPeakPrice: v.optional(v.number()),
    weekendPrice: v.optional(v.number()),
    holidayPrice: v.optional(v.number()),
    depositPercentage: v.optional(v.number()),
    minBookingDuration: v.optional(v.number()),
    maxBookingDuration: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Calculate price for a booking
export const calculatePrice = query({
  args: {
    spaceId: v.id("spaces"),
    startTime: v.string(),
    endTime: v.string(),
    participants: v.number(),
  },
  handler: async (ctx, args) => {
    const pricing = await ctx.db
      .query("pricingRules")
      .withIndex("by_space", (q) => q.eq("spaceId", args.spaceId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();

    if (!pricing) {
      return { error: "No pricing rules found for this space" };
    }

    const startDate = new Date(args.startTime);
    const endDate = new Date(args.endTime);
    const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60); // hours
    const dayOfWeek = startDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const hour = startDate.getHours();
    const isPeak = hour >= 17 || hour <= 9; // Peak hours: 5 PM - 9 AM

    let hourlyRate = pricing.basePrice;
    
    if (isWeekend && pricing.weekendPrice) {
      hourlyRate = pricing.weekendPrice;
    } else if (isPeak && pricing.peakPrice) {
      hourlyRate = pricing.peakPrice;
    } else if (!isPeak && pricing.offPeakPrice) {
      hourlyRate = pricing.offPeakPrice;
    }

    const totalPrice = hourlyRate * duration;
    const depositAmount = (totalPrice * pricing.depositPercentage) / 100;

    return {
      hourlyRate,
      duration,
      totalPrice,
      depositAmount,
      pricing,
    };
  },
});
