import { NavigationBar } from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';

import { NAV_THEME } from '@/lib/react-native-reusables/theme';
import { useAppColorScheme } from '@/lib/react-native-reusables/use-app-color-scheme';

// Status bar icons, Android navigation bar buttons and the root view background follow the app's theme (the
// Profile switch), not the phone's: "auto" would keep dark icons on the dark theme when the phone is in light mode.
export function SystemBars() {
  const { colorScheme } = useAppColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(NAV_THEME[colorScheme].colors.background).catch(() => {
      // Only cosmetic: the screens paint their own background.
    });
  }, [colorScheme]);

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <NavigationBar style={isDark ? 'dark' : 'light'} />
    </>
  );
}
