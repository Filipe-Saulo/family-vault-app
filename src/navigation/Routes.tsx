import { NavigationContainer } from '@react-navigation/native';
import { useEffect } from 'react';

import { useAppColorScheme } from '@/lib/react-native-reusables/use-app-color-scheme';
import { NAV_THEME } from '@/lib/react-native-reusables/theme';
import { useAuthStore } from '@/store/authStore';

import { PrivateTabs } from './private-routes/PrivateTabs';
import { PublicStack } from './public-routes/PublicStack';

export function Routes() {
  const token = useAuthStore((state) => state.token);
  const isRestoring = useAuthStore((state) => state.isRestoring);
  const restoreSession = useAuthStore((state) => state.restoreSession);
  const { colorScheme } = useAppColorScheme();

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  if (isRestoring) {
    return null;
  }

  return (
    <NavigationContainer theme={colorScheme === 'dark' ? NAV_THEME.dark : NAV_THEME.light}>
      {token ? <PrivateTabs /> : <PublicStack />}
    </NavigationContainer>
  );
}
