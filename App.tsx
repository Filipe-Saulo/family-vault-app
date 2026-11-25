import './global.css';
import 'react-native-gesture-handler';

import { PortalHost } from '@rn-primitives/portal';
import { QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { SystemBars } from '@/components/SystemBars';
import { queryClient } from '@/lib/react-query/react-query-client';
import { Routes } from '@/navigation/Routes';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Routes />
        <PortalHost />
        <SystemBars />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
