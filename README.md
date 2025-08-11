# SpaceHub - Convex + React + Capacitor Mobile App

A modern community platform built with Convex backend, React frontend, and Capacitor for mobile deployment.

## 🚀 Features

- **Real-time Backend**: Powered by Convex for instant data synchronization
- **Modern UI**: Built with React and Tailwind CSS
- **Mobile Ready**: Capacitor integration for iOS and Android deployment
- **Community Spaces**: Create and join interest-based communities
- **Real-time Posts**: Share and interact with posts in real-time
- **User Profiles**: Manage your profile and spaces
- **Responsive Design**: Works seamlessly on desktop and mobile

## 🛠 Tech Stack

- **Backend**: Convex (Database + Backend Functions)
- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Mobile**: Capacitor
- **Icons**: Lucide React
- **Routing**: React Router DOM

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd space-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Convex**
   ```bash
   # Install Convex CLI globally
   npm install -g convex
   
   # Initialize Convex (you'll need to create a Convex account)
   npx convex dev
   ```

4. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_CONVEX_URL=your_convex_deployment_url
   ```

## 🚀 Development

### Start the development server
```bash
npm run dev
```

### Start Convex development server
```bash
npm run convex:dev
```

### Build for production
```bash
npm run build
```

## 📱 Mobile Setup

### Install Capacitor
```bash
npm install @capacitor/cli @capacitor/core
npx cap init
```

### Add platforms
```bash
# For iOS
npm install @capacitor/ios
npx cap add ios

# For Android
npm install @capacitor/android
npx cap add android
```

### Sync and run
```bash
# Build the web app
npm run build

# Sync with native projects
npx cap sync

# Open in native IDE
npx cap open ios     # Opens Xcode
npx cap open android # Opens Android Studio
```

## 🏗 Project Structure

```
space-hub/
├── convex/                 # Convex backend functions
│   ├── schema.ts          # Database schema
│   ├── users.ts           # User management functions
│   ├── spaces.ts          # Space management functions
│   └── posts.ts           # Post management functions
├── src/
│   ├── components/        # Reusable React components
│   ├── pages/            # Page components
│   ├── App.tsx           # Main app component
│   └── main.tsx          # App entry point
├── capacitor.config.ts    # Capacitor configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── package.json          # Dependencies and scripts
```

## 📊 Database Schema

The application uses the following data models:

- **Users**: User profiles and authentication
- **Spaces**: Community spaces/groups
- **Posts**: Content shared within spaces
- **SpaceMembers**: User membership in spaces
- **Likes**: Post likes/reactions
- **Comments**: Post comments

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run convex:dev` - Start Convex development server
- `npm run convex:deploy` - Deploy Convex functions
- `npm run convex:codegen` - Generate Convex types
- `npm run cap:sync` - Sync web build with native projects
- `npm run cap:open` - Open native IDE

## 🎨 Customization

### Styling
The app uses Tailwind CSS for styling. You can customize the design by modifying:
- `tailwind.config.js` - Theme configuration
- `src/index.css` - Global styles and component classes

### Components
All reusable components are in `src/components/`. The app follows a component-based architecture for easy maintenance and reusability.

## 📱 Mobile Features

The app is optimized for mobile with:
- Touch-friendly navigation
- Responsive design
- Native-like interactions
- Capacitor plugins for device features

## 🚀 Deployment

### Web Deployment
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting provider

### Mobile Deployment
1. Build the project: `npm run build`
2. Sync with native projects: `npx cap sync`
3. Open in native IDE and build for distribution

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the [Convex documentation](https://docs.convex.dev/)
2. Review the [Capacitor documentation](https://capacitorjs.com/docs)
3. Open an issue in this repository

---

Built with ❤️ using Convex, React, and Capacitor
