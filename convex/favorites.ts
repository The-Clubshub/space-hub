import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addToFavorites = mutation({
  args: {
    userId: v.id("users"),
    spaceId: v.id("spaces"),
  },
  handler: async (ctx, args) => {
    // Check if already in favorites
    const existing = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_and_space", (q) => 
        q.eq("userId", args.userId).eq("spaceId", args.spaceId)
      )
      .first();

    if (existing) {
      return existing._id; // Already in favorites
    }

    const favoriteId = await ctx.db.insert("userFavorites", {
      ...args,
      createdAt: Date.now(),
    });
    return favoriteId;
  },
});

export const removeFromFavorites = mutation({
  args: {
    userId: v.id("users"),
    spaceId: v.id("spaces"),
  },
  handler: async (ctx, args) => {
    const favorite = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_and_space", (q) => 
        q.eq("userId", args.userId).eq("spaceId", args.spaceId)
      )
      .first();

    if (favorite) {
      await ctx.db.delete(favorite._id);
    }
  },
});

export const getUserFavorites = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userFavorites")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const isFavorite = query({
  args: {
    userId: v.id("users"),
    spaceId: v.id("spaces"),
  },
  handler: async (ctx, args) => {
    const favorite = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_and_space", (q) => 
        q.eq("userId", args.userId).eq("spaceId", args.spaceId)
      )
      .first();

    return !!favorite;
  },
});
