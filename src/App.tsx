import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { Suspense } from 'react';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';
import './App.css';

// Import components
import LoadingSpinner from './components/LoadingSpinner';

// Initialize Convex client
const convexUrl = import.meta.env.VITE_CONVEX_URL;
if (!convexUrl) {
  throw new Error("VITE_CONVEX_URL is not set. Please check your .env.local file.");
}
const convex = new ConvexReactClient(convexUrl);

function App() {
  return (
    <ConvexProvider client={convex}>
      <div className="App">
        <Suspense fallback={<LoadingSpinner />}>
          <RouterProvider router={router} />
        </Suspense>
      </div>
    </ConvexProvider>
  );
}

export default App;
