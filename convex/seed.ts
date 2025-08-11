import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Seed data for facilities
const facilities = [
  {
    name: "Sports Complex Central",
    description: "Premier sports facility with multiple pitches and amenities",
    address: "123 Sports Lane",
    city: "Manchester",
    state: "Greater Manchester",
    zipCode: "M1 1AA",
    country: "UK",
    contactPhone: "+44 161 123 4567",
    contactEmail: "info@sportscomplexcentral.com",
    website: "https://sportscomplexcentral.com",
    latitude: 53.4808,
    longitude: -2.2426,
    images: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800"],
    isActive: true,
  },
  {
    name: "Business Hub",
    description: "Modern business center with meeting rooms and coworking spaces",
    address: "456 Business Street",
    city: "Manchester",
    state: "Greater Manchester",
    zipCode: "M2 2BB",
    country: "UK",
    contactPhone: "+44 161 234 5678",
    contactEmail: "hello@businesshub.com",
    website: "https://businesshub.com",
    latitude: 53.4810,
    longitude: -2.2430,
    images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=800"],
    isActive: true,
  },
  {
    name: "Community Center",
    description: "Multi-purpose community facility for events and activities",
    address: "789 Community Road",
    city: "Manchester",
    state: "Greater Manchester",
    zipCode: "M3 3CC",
    country: "UK",
    contactPhone: "+44 161 345 6789",
    contactEmail: "contact@communitycenter.com",
    website: "https://communitycenter.com",
    latitude: 53.4812,
    longitude: -2.2434,
    images: ["https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800"],
    isActive: true,
  }
];

// Seed data for spaces
const spaces = [
  {
    facilityName: "Sports Complex Central", // Will be replaced with actual facility ID
    name: "Premium Football Pitch",
    description: "Professional-grade football pitch with floodlights and changing rooms. Perfect for competitive matches and training sessions.",
    type: "sports_pitch" as const,
    sportType: "football",
    capacity: 22,
    images: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800"],
    amenities: ["Floodlights", "Changing Rooms", "Parking", "Refreshments"],
    isActive: true,
  },
  {
    facilityName: "Sports Complex Central",
    name: "Tennis Court",
    description: "Professional tennis court with excellent surface quality and lighting for evening games.",
    type: "sports_pitch" as const,
    sportType: "tennis",
    capacity: 4,
    images: ["https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800"],
    amenities: ["Floodlights", "Equipment Rental", "Water Dispenser"],
    isActive: true,
  },
  {
    facilityName: "Business Hub",
    name: "Meeting Room A",
    description: "Modern meeting room equipped with presentation facilities and comfortable seating.",
    type: "meeting_room" as const,
    capacity: 12,
    images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=800"],
    amenities: ["Projector", "Whiteboard", "Coffee Service", "WiFi"],
    isActive: true,
  },
  {
    facilityName: "Business Hub",
    name: "Hot Desk Area",
    description: "Flexible coworking space with high-speed internet and printing facilities.",
    type: "hot_desk" as const,
    capacity: 20,
    images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=800"],
    amenities: ["WiFi", "Printing", "Coffee Service", "Meeting Rooms"],
    isActive: true,
  },
  {
    facilityName: "Community Center",
    name: "Event Hall",
    description: "Large event space perfect for conferences, parties, and community gatherings.",
    type: "event_hall" as const,
    capacity: 100,
    images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=800"],
    amenities: ["Stage", "Sound System", "Lighting", "Kitchen", "Parking"],
    isActive: true,
  }
];

// Seed data for pricing rules
const pricingRules = [
  {
    spaceName: "Premium Football Pitch", // Will be replaced with actual space ID
    name: "Premium Football Pitch Pricing",
    basePrice: 80,
    peakPrice: 120,
    offPeakPrice: 60,
    weekendPrice: 100,
    depositPercentage: 25,
    minBookingDuration: 1,
    maxBookingDuration: 4,
    isActive: true,
  },
  {
    spaceName: "Tennis Court",
    name: "Tennis Court Pricing",
    basePrice: 40,
    peakPrice: 60,
    offPeakPrice: 30,
    weekendPrice: 50,
    depositPercentage: 25,
    minBookingDuration: 1,
    maxBookingDuration: 3,
    isActive: true,
  },
  {
    spaceName: "Meeting Room A",
    name: "Meeting Room A Pricing",
    basePrice: 50,
    peakPrice: 75,
    offPeakPrice: 35,
    weekendPrice: 60,
    depositPercentage: 50,
    minBookingDuration: 1,
    maxBookingDuration: 8,
    isActive: true,
  },
  {
    spaceName: "Hot Desk Area",
    name: "Hot Desk Pricing",
    basePrice: 15,
    peakPrice: 20,
    offPeakPrice: 10,
    weekendPrice: 12,
    depositPercentage: 0,
    minBookingDuration: 1,
    maxBookingDuration: 12,
    isActive: true,
  },
  {
    spaceName: "Event Hall",
    name: "Event Hall Pricing",
    basePrice: 200,
    peakPrice: 300,
    offPeakPrice: 150,
    weekendPrice: 250,
    depositPercentage: 50,
    minBookingDuration: 2,
    maxBookingDuration: 24,
    isActive: true,
  }
];

export const seedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    console.log("Starting database seeding...");

    // First, create a default admin user
    const adminUserId = await ctx.db.insert("users", {
      name: "Admin User",
      email: "admin@spacehub.com",
      phone: "+44 161 123 4567",
      role: "admin",
      membershipStatus: "enterprise",
      isVerified: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    console.log(`Created admin user with ID: ${adminUserId}`);

    // Create facilities
    const facilityIds: { [key: string]: any } = {};
    for (const facility of facilities) {
      const facilityId = await ctx.db.insert("facilities", {
        ...facility,
        ownerId: adminUserId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      facilityIds[facility.name] = facilityId;
      console.log(`Created facility: ${facility.name} with ID: ${facilityId}`);
    }

    // Create spaces
    const spaceIds: { [key: string]: any } = {};
    for (const space of spaces) {
      const facilityId = facilityIds[space.facilityName];
      if (!facilityId) {
        console.error(`Facility not found: ${space.facilityName}`);
        continue;
      }
      
      const spaceId = await ctx.db.insert("spaces", {
        facilityId,
        name: space.name,
        description: space.description,
        type: space.type,
        sportType: space.sportType,
        capacity: space.capacity,
        images: space.images,
        amenities: space.amenities,
        isActive: space.isActive,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      spaceIds[space.name] = spaceId;
      console.log(`Created space: ${space.name} with ID: ${spaceId}`);
    }

    // Create pricing rules
    for (const pricing of pricingRules) {
      const spaceId = spaceIds[pricing.spaceName];
      if (!spaceId) {
        console.error(`Space not found: ${pricing.spaceName}`);
        continue;
      }
      
      await ctx.db.insert("pricingRules", {
        spaceId,
        name: pricing.name,
        basePrice: pricing.basePrice,
        peakPrice: pricing.peakPrice,
        offPeakPrice: pricing.offPeakPrice,
        weekendPrice: pricing.weekendPrice,
        depositPercentage: pricing.depositPercentage,
        minBookingDuration: pricing.minBookingDuration,
        maxBookingDuration: pricing.maxBookingDuration,
        isActive: pricing.isActive,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      console.log(`Created pricing rule for space: ${pricing.name}`);
    }

    console.log("Database seeding completed successfully!");
    return { success: true, facilitiesCreated: facilities.length, spacesCreated: spaces.length };
  },
});
