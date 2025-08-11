import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createNotification = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const notificationId = await ctx.db.insert("notifications", {
      ...args,
      isRead: false,
      isEmailSent: false,
      isSMSSent: false,
      isPushSent: false,
      createdAt: Date.now(),
    });
    return notificationId;
  },
});

export const getUserNotifications = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const getUnreadNotifications = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("isRead"), false))
      .order("desc")
      .collect();
  },
});

export const markAsRead = mutation({
  args: { id: v.id("notifications") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      isRead: true,
    });
  },
});

export const markAllAsRead = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const unreadNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("isRead"), false))
      .collect();

    for (const notification of unreadNotifications) {
      await ctx.db.patch(notification._id, {
        isRead: true,
      });
    }
  },
});

export const deleteNotification = mutation({
  args: { id: v.id("notifications") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Create booking confirmation notification
export const createBookingConfirmation = mutation({
  args: {
    userId: v.id("users"),
    bookingId: v.id("bookings"),
    spaceName: v.string(),
    facilityName: v.string(),
    date: v.string(),
    startTime: v.string(),
    endTime: v.string(),
  },
  handler: async (ctx, args) => {
    const notificationId = await ctx.db.insert("notifications", {
      userId: args.userId,
      type: "booking_confirmation",
      title: "Booking Confirmed!",
      message: `Your booking for ${args.spaceName} at ${args.facilityName} on ${args.date} from ${args.startTime} to ${args.endTime} has been confirmed.`,
      bookingId: args.bookingId,
      isRead: false,
      isEmailSent: false,
      isSMSSent: false,
      isPushSent: false,
      createdAt: Date.now(),
    });
    return notificationId;
  },
});

// Create booking reminder notification
export const createBookingReminder = mutation({
  args: {
    userId: v.id("users"),
    bookingId: v.id("bookings"),
    spaceName: v.string(),
    facilityName: v.string(),
    date: v.string(),
    startTime: v.string(),
  },
  handler: async (ctx, args) => {
    const notificationId = await ctx.db.insert("notifications", {
      userId: args.userId,
      type: "booking_reminder",
      title: "Booking Reminder",
      message: `Reminder: You have a booking for ${args.spaceName} at ${args.facilityName} tomorrow (${args.date}) at ${args.startTime}.`,
      bookingId: args.bookingId,
      isRead: false,
      isEmailSent: false,
      isSMSSent: false,
      isPushSent: false,
      createdAt: Date.now(),
    });
    return notificationId;
  },
});

// Create waitlist notification
export const createWaitlistNotification = mutation({
  args: {
    userId: v.id("users"),
    spaceName: v.string(),
    facilityName: v.string(),
    date: v.string(),
    startTime: v.string(),
    endTime: v.string(),
  },
  handler: async (ctx, args) => {
    const notificationId = await ctx.db.insert("notifications", {
      userId: args.userId,
      type: "waitlist_available",
      title: "Space Available!",
      message: `Good news! ${args.spaceName} at ${args.facilityName} is now available for ${args.date} from ${args.startTime} to ${args.endTime}. Book quickly before it's gone!`,
      isRead: false,
      isEmailSent: false,
      isSMSSent: false,
      isPushSent: false,
      createdAt: Date.now(),
    });
    return notificationId;
  },
});
