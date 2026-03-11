import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.myred.myapplication',
  appName: 'The Snippet',
  webDir: 'dist',
  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ['google.com'],
    },
    StatusBar: {
      style: 'DARK',
      overlaysWebView: false
    },
    FirebaseMessaging: {
      presentationOptions: ["badge", "sound", "alert"],
    }
  },
};

export default config;





