#!/bin/bash

# Start both Convex and React dev servers
echo "🚀 Starting SpaceHub development servers..."

# Start Convex in the background
echo "📡 Starting Convex dev server..."
bun run convex:dev &
CONVEX_PID=$!

# Wait a moment for Convex to start
sleep 3

# Start React dev server
echo "⚛️  Starting React dev server..."
bun run dev &
VITE_PID=$!

echo "✅ Both servers are starting..."
echo "📱 Convex dev server PID: $CONVEX_PID"
echo "🌐 React dev server PID: $VITE_PID"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $CONVEX_PID 2>/dev/null
    kill $VITE_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait
