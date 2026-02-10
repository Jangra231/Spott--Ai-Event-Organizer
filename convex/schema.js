import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users Table
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(), // Clerk user id for authentication
    email: v.string(),
    imageUrl: v.optional(v.string()),

    //Onboarding
    hasCompletedOnboarding: v.boolean(),

    location: v.optional(
      v.object({
        city: v.string(),
        state: v.optional(v.string()),
        country: v.string(),
      }),
    ),
    interests: v.optional(v.array(v.string())), // Min 3 categories

    // Organizer tracking (User Subscription)
    freeEventsCreated: v.number(), // Number of free events created

    //Time Stamps
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_token", ["tokenIdentifier"]),

  events: defineTable({
    title: v.string(),
    description: v.string(),
    slug: v.string(),

    //Organizer
    organizerId: v.id("users"),
    organizerName: v.string(),

    // Event Details
    category: v.string(),
    tags: v.array(v.string()),

    //Date & Time
    startDate: v.number(),
    endDate: v.number(),
    timezone: v.string(),

    //Location
    locationType: v.union(v.literal("physical"), v.literal("online")),
    venue: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.string(),
    state: v.optional(v.string()),

    //Capacity & Ticketing
    capacity: v.number(),
    ticketTypes: v.union(v.literal("free"), v.literal("paid")),
    ticketPrice: v.optional(v.number()), // Only if ticketTypes is "paid"
    registrationCount: v.number(), // Number of users registered

    //Customization
    coverImage: v.optional(v.string()),
    themeColor: v.optional(v.string()),

    //Time Stamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organizer", ["organizerId"])
    .index("by_category", ["category"])
    .index("by_startDate", ["startDate"])
    .index("by_slug", ["slug"])
    .searchIndex("search_title", {
      searchField: "title",
    }),

  registrations: defineTable({
    eventId: v.id("events"),
    userId: v.id("users"),

    //Attendee Info
    attendeeName: v.string(),
    attendeeEmail: v.string(),

    //QR Code for entry
    qrCode: v.string(),

    //check-in status
    checkedIn: v.boolean(),
    checkedInAt: v.optional(v.number()),

    //Status
    status: v.union(v.literal("confirmed"), v.literal("cancelled")),

    registeredAt: v.number(),
  })
    .index("by_event", ["eventId"])
    .index("by_user", ["userId"])
    .index("by_event_users", ["eventId", "userId"])
    .index("by_qrCode", ["qrCode"]),
});
