import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createSchedule = mutation({
  args: {
    spaceId: v.id("spaces"),
    dayOfWeek: v.number(),
    openTime: v.string(),
    closeTime: v.string(),
    isAvailable: v.boolean(),
  },
  handler: async (ctx, args) => {
    const scheduleId = await ctx.db.insert("availabilitySchedules", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return scheduleId;
  },
});

export const getBySpace = query({
  args: { spaceId: v.id("spaces") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("availabilitySchedules")
      .withIndex("by_space", (q) => q.eq("spaceId", args.spaceId))
      .order("asc")
      .collect();
  },
});

export const updateSchedule = mutation({
  args: {
    id: v.id("availabilitySchedules"),
    openTime: v.optional(v.string()),
    closeTime: v.optional(v.string()),
    isAvailable: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

export const createBlackoutDate = mutation({
  args: {
    spaceId: v.id("spaces"),
    startDate: v.string(),
    endDate: v.string(),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const blackoutId = await ctx.db.insert("blackoutDates", {
      ...args,
      isActive: true,
      createdAt: Date.now(),
    });
    return blackoutId;
  },
});

export const getBlackoutDates = query({
  args: { spaceId: v.id("spaces") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("blackoutDates")
      .withIndex("by_space", (q) => q.eq("spaceId", args.spaceId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

// Check if a specific date/time is available
export const checkAvailability = query({
  args: {
    spaceId: v.id("spaces"),
    date: v.string(), // YYYY-MM-DD
    startTime: v.string(), // HH:MM
    endTime: v.string(), // HH:MM
  },
  handler: async (ctx, args) => {
    const dayOfWeek = new Date(args.date).getDay();
    
    // Check availability schedule
    const schedule = await ctx.db
      .query("availabilitySchedules")
      .withIndex("by_space", (q) => q.eq("spaceId", args.spaceId))
      .filter((q) => q.eq(q.field("dayOfWeek"), dayOfWeek))
      .first();

    if (!schedule || !schedule.isAvailable) {
      return { isAvailable: false, reason: "Space not available on this day" };
    }

    if (args.startTime < schedule.openTime || args.endTime > schedule.closeTime) {
      return { isAvailable: false, reason: "Outside operating hours" };
    }

    // Check blackout dates
    const blackoutDates = await ctx.db
      .query("blackoutDates")
      .withIndex("by_space", (q) => q.eq("spaceId", args.spaceId))
      .filter((q) => 
        q.and(
          q.eq(q.field("isActive"), true),
          q.or(
            q.and(
              q.lte(q.field("startDate"), args.date),
              q.gte(q.field("endDate"), args.date)
            )
          )
        )
      )
      .collect();

    if (blackoutDates.length > 0) {
      return { isAvailable: false, reason: blackoutDates[0].reason };
    }

    // Check existing bookings
    const startDateTime = `${args.date}T${args.startTime}:00`;
    const endDateTime = `${args.date}T${args.endTime}:00`;

    const conflictingBookings = await ctx.db
      .query("bookings")
      .withIndex("by_space", (q) => q.eq("spaceId", args.spaceId))
      .filter((q) => 
        q.and(
          q.neq(q.field("status"), "cancelled"),
          q.or(
            q.and(
              q.lte(q.field("startTime"), startDateTime),
              q.gt(q.field("endTime"), startDateTime)
            ),
            q.and(
              q.lt(q.field("startTime"), endDateTime),
              q.gte(q.field("endTime"), endDateTime)
            ),
            q.and(
              q.gte(q.field("startTime"), startDateTime),
              q.lte(q.field("endTime"), endDateTime)
            )
          )
        )
      )
      .collect();

    return {
      isAvailable: conflictingBookings.length === 0,
      conflictingBookings,
      schedule,
    };
  },
});

// Get available time slots for a specific date
export const getAvailableSlots = query({
  args: {
    spaceId: v.id("spaces"),
    date: v.string(), // YYYY-MM-DD
    duration: v.number(), // in hours
  },
  handler: async (ctx, args) => {
    const dayOfWeek = new Date(args.date).getDay();
    
    // Get schedule for this day
    const schedule = await ctx.db
      .query("availabilitySchedules")
      .withIndex("by_space", (q) => q.eq("spaceId", args.spaceId))
      .filter((q) => q.eq(q.field("dayOfWeek"), dayOfWeek))
      .first();

    if (!schedule || !schedule.isAvailable) {
      return { slots: [] };
    }

    // Get existing bookings for this date
    const startOfDay = `${args.date}T00:00:00`;
    const endOfDay = `${args.date}T23:59:59`;

    const existingBookings = await ctx.db
      .query("bookings")
      .withIndex("by_space", (q) => q.eq("spaceId", args.spaceId))
      .filter((q) => 
        q.and(
          q.neq(q.field("status"), "cancelled"),
          q.gte(q.field("startTime"), startOfDay),
          q.lte(q.field("startTime"), endOfDay)
        )
      )
      .collect();

    // Generate time slots
    const slots = [];
    const startHour = parseInt(schedule.openTime.split(':')[0]);
    const endHour = parseInt(schedule.closeTime.split(':')[0]);
    
    for (let hour = startHour; hour <= endHour - args.duration; hour++) {
      const slotStart = `${hour.toString().padStart(2, '0')}:00`;
      const slotEnd = `${(hour + args.duration).toString().padStart(2, '0')}:00`;
      
      // Check if this slot conflicts with existing bookings
      const slotStartDateTime = `${args.date}T${slotStart}:00`;
      const slotEndDateTime = `${args.date}T${slotEnd}:00`;
      
      const hasConflict = existingBookings.some(booking => {
        return (
          (booking.startTime < slotEndDateTime && booking.endTime > slotStartDateTime)
        );
      });

      if (!hasConflict) {
        slots.push({
          startTime: slotStart,
          endTime: slotEnd,
          isAvailable: true,
        });
      }
    }

    return { slots };
  },
});
