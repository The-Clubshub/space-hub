/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as availability from "../availability.js";
import type * as bookings from "../bookings.js";
import type * as facilities from "../facilities.js";
import type * as favorites from "../favorites.js";
import type * as notifications from "../notifications.js";
import type * as pricing from "../pricing.js";
import type * as promoCodes from "../promoCodes.js";
import type * as reviews from "../reviews.js";
import type * as seed from "../seed.js";
import type * as spaces from "../spaces.js";
import type * as users from "../users.js";
import type * as waitlist from "../waitlist.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  availability: typeof availability;
  bookings: typeof bookings;
  facilities: typeof facilities;
  favorites: typeof favorites;
  notifications: typeof notifications;
  pricing: typeof pricing;
  promoCodes: typeof promoCodes;
  reviews: typeof reviews;
  seed: typeof seed;
  spaces: typeof spaces;
  users: typeof users;
  waitlist: typeof waitlist;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
