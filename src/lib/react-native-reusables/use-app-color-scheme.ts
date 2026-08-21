import { colorScheme, useColorScheme } from 'nativewind';
import { useEffect } from 'react';

import { appStorage } from '@/lib/mmkv/mmkv-instance';

const THEME_STORAGE_KEY = 'theme.colorScheme';

type AppColorScheme = 'light' | 'dark';

export function useAppColorScheme() {
  const { colorScheme: resolvedColorScheme } = useColorScheme();

  useEffect(() => {
    const saved = appStorage.getString(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') {
      colorScheme.set(saved);
    }
  }, []);

  function setAppColorScheme(value: AppColorScheme) {
    colorScheme.set(value);
    appStorage.set(THEME_STORAGE_KEY, value);
  }

  return {
    colorScheme: (resolvedColorScheme ?? 'light') as AppColorScheme,
    setColorScheme: setAppColorScheme,
  };
}
