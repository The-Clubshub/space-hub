import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createPromoCode = mutation({
  args: {
    code: v.string(),
    description: v.string(),
    discountType: v.union(v.literal("percentage"), v.literal("fixed_amount")),
    discountValue: v.number(),
    maxUses: v.optional(v.number()),
    validFrom: v.string(),
    validUntil: v.string(),
  },
  handler: async (ctx, args) => {
    const promoCodeId = await ctx.db.insert("promoCodes", {
      ...args,
      currentUses: 0,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return promoCodeId;
  },
});

export const getByCode = query({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("promoCodes")
      .withIndex("by_code", (q) => q.eq("code", args.code))
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();
  },
});

export const validatePromoCode = query({
  args: {
    code: v.string(),
    userId: v.id("users"),
    bookingAmount: v.number(),
  },
  handler: async (ctx, args) => {
    const promoCode = await ctx.db
      .query("promoCodes")
      .withIndex("by_code", (q) => q.eq("code", args.code))
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();

    if (!promoCode) {
      return { valid: false, error: "Promo code not found" };
    }

    const now = new Date().toISOString();
    if (now < promoCode.validFrom || now > promoCode.validUntil) {
      return { valid: false, error: "Promo code expired or not yet valid" };
    }

    if (promoCode.maxUses && promoCode.currentUses >= promoCode.maxUses) {
      return { valid: false, error: "Promo code usage limit reached" };
    }

    // Check if user has already used this code
    const existingUsage = await ctx.db
      .query("promoCodeUsage")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("promoCodeId"), promoCode._id))
      .first();

    if (existingUsage) {
      return { valid: false, error: "You have already used this promo code" };
    }

    // Calculate discount
    let discountAmount = 0;
    if (promoCode.discountType === "percentage") {
      discountAmount = (args.bookingAmount * promoCode.discountValue) / 100;
    } else {
      discountAmount = Math.min(promoCode.discountValue, args.bookingAmount);
    }

    return {
      valid: true,
      promoCode,
      discountAmount,
    };
  },
});

export const usePromoCode = mutation({
  args: {
    promoCodeId: v.id("promoCodes"),
    userId: v.id("users"),
    bookingId: v.id("bookings"),
    discountAmount: v.number(),
  },
  handler: async (ctx, args) => {
    // Record usage
    await ctx.db.insert("promoCodeUsage", {
      ...args,
      createdAt: Date.now(),
    });

    // Update usage count
    const promoCode = await ctx.db.get(args.promoCodeId);
    if (promoCode) {
      await ctx.db.patch(args.promoCodeId, {
        currentUses: promoCode.currentUses + 1,
        updatedAt: Date.now(),
      });
    }
  },
});

export const listPromoCodes = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("promoCodes")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .order("desc")
      .collect();
  },
});

export const updatePromoCode = mutation({
  args: {
    id: v.id("promoCodes"),
    description: v.optional(v.string()),
    discountValue: v.optional(v.number()),
    maxUses: v.optional(v.number()),
    validFrom: v.optional(v.string()),
    validUntil: v.optional(v.string()),
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

export const deletePromoCode = mutation({
  args: { id: v.id("promoCodes") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
