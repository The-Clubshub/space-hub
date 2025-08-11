import { createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router'
import HomePage from './pages/HomePage'
import SpacesPage from './pages/SpacesPage'
import SpaceDetailPage from './pages/SpaceDetailPage'
import CreateSpacePage from './pages/CreateSpacePage'
import EditSpacePage from './pages/EditSpacePage'
import BookingPage from './pages/BookingPage'
import PaymentPage from './pages/PaymentPage'
import BookingSuccessPage from './pages/BookingSuccessPage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Navigation from './components/Navigation'

// Root route
const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-gray-50">
      {/* Status bar spacing for iOS */}
      <div className="lg:hidden status-bar-height bg-white"></div>
      <Navigation />
      <main className="lg:container lg:mx-auto px-4 py-4 lg:py-8">
        <Outlet />
      </main>
    </div>
  ),
})

// Index route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

// Spaces routes
const spacesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/spaces',
  component: SpacesPage,
})

const spaceDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/spaces/$spaceId',
  component: SpaceDetailPage,
})

const createSpaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/spaces/create',
  component: CreateSpacePage,
})

const editSpaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/spaces/$spaceId/edit',
  component: EditSpacePage,
})

// Booking routes
const bookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/spaces/$spaceId/book',
  component: BookingPage,
})

const paymentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment',
  component: PaymentPage,
})

const bookingSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/booking-success',
  component: BookingSuccessPage,
})

// Auth routes
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPage,
})

// Route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  spacesRoute,
  spaceDetailRoute,
  createSpaceRoute,
  editSpaceRoute,
  bookingRoute,
  paymentRoute,
  bookingSuccessRoute,
  profileRoute,
  loginRoute,
  registerRoute,
])

// Create router
export const router = createRouter({ routeTree })

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
