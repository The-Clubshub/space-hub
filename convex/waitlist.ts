import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addToWaitlist = mutation({
  args: {
    userId: v.id("users"),
    spaceId: v.id("spaces"),
    facilityId: v.id("facilities"),
    requestedDate: v.string(),
    requestedStartTime: v.string(),
    requestedEndTime: v.string(),
    participants: v.number(),
  },
  handler: async (ctx, args) => {
    const waitlistId = await ctx.db.insert("waitlist", {
      ...args,
      status: "waiting",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return waitlistId;
  },
});

export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("waitlist")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const getBySpace = query({
  args: { spaceId: v.id("spaces") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("waitlist")
      .withIndex("by_space", (q) => q.eq("spaceId", args.spaceId))
      .filter((q) => q.eq(q.field("status"), "waiting"))
      .order("asc")
      .collect();
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("waitlist"),
    status: v.union(v.literal("waiting"), v.literal("notified"), v.literal("expired")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

export const notifyWaitlist = mutation({
  args: {
    spaceId: v.id("spaces"),
    date: v.string(),
    startTime: v.string(),
    endTime: v.string(),
  },
  handler: async (ctx, args) => {
    // Find all waitlist entries for this space and time slot
    const waitlistEntries = await ctx.db
      .query("waitlist")
      .withIndex("by_space", (q) => q.eq("spaceId", args.spaceId))
      .filter((q) => 
        q.and(
          q.eq(q.field("status"), "waiting"),
          q.eq(q.field("requestedDate"), args.date),
          q.eq(q.field("requestedStartTime"), args.startTime),
          q.eq(q.field("requestedEndTime"), args.endTime)
        )
      )
      .collect();

    // Update status to notified
    for (const entry of waitlistEntries) {
      await ctx.db.patch(entry._id, {
        status: "notified",
        updatedAt: Date.now(),
      });
    }

    return waitlistEntries.length;
  },
});

export const removeFromWaitlist = mutation({
  args: { id: v.id("waitlist") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
