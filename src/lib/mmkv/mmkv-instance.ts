import { createMMKV } from 'react-native-mmkv';

export const secureStorage = createMMKV({ id: 'secure-storage' });
export const appStorage = createMMKV({ id: 'app-storage' });
