import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
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
    sportType: v.optional(v.string()),
    capacity: v.number(),
    images: v.array(v.string()),
    amenities: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const spaceId = await ctx.db.insert("spaces", {
      ...args,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return spaceId;
  },
});

export const get = query({
  args: { id: v.id("spaces") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByFacility = query({
  args: { facilityId: v.id("facilities") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("spaces")
      .withIndex("by_facility", (q) => q.eq("facilityId", args.facilityId))
      .order("desc")
      .collect();
  },
});

export const getByType = query({
  args: { type: v.union(
    v.literal("sports_pitch"),
    v.literal("meeting_room"),
    v.literal("hot_desk"),
    v.literal("event_hall"),
    v.literal("equipment"),
    v.literal("other")
  ) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("spaces")
      .withIndex("by_type", (q) => q.eq("type", args.type))
      .order("desc")
      .collect();
  },
});

export const update = mutation({
  args: {
    id: v.id("spaces"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    type: v.optional(v.union(
      v.literal("sports_pitch"),
      v.literal("meeting_room"),
      v.literal("hot_desk"),
      v.literal("event_hall"),
      v.literal("equipment"),
      v.literal("other")
    )),
    sportType: v.optional(v.string()),
    capacity: v.optional(v.number()),
    images: v.optional(v.array(v.string())),
    amenities: v.optional(v.array(v.string())),
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

export const deleteSpace = mutation({
  args: { id: v.id("spaces") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("spaces")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .order("desc")
      .collect();
  },
}); 