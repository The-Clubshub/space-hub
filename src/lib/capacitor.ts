import { StatusBar, Style } from '@capacitor/status-bar';

// Initialize StatusBar plugin
export const initializeStatusBar = async () => {
  try {
    // Set status bar style and background
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#ffffff' });
    await StatusBar.setOverlaysWebView({ overlay: false });
  } catch (error) {
    console.log('StatusBar plugin not available:', error);
  }
};

// Set status bar style
export const setStatusBarStyle = async (style: Style) => {
  try {
    await StatusBar.setStyle({ style });
  } catch (error) {
    console.log('StatusBar plugin not available:', error);
  }
};

// Set status bar background color
export const setStatusBarBackgroundColor = async (color: string) => {
  try {
    await StatusBar.setBackgroundColor({ color });
  } catch (error) {
    console.log('StatusBar plugin not available:', error);
  }
};
