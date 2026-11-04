// In-memory fakes for native storage modules, shared by every test.
jest.mock('react-native-mmkv', () => {
  const instances = new Map<string, Map<string, string>>();
  return {
    createMMKV: ({ id }: { id: string }) => {
      if (!instances.has(id)) instances.set(id, new Map());
      const data = instances.get(id)!;
      return {
        getString: (key: string) => data.get(key),
        set: (key: string, value: string) => void data.set(key, value),
        remove: (key: string) => data.delete(key),
        clearAll: () => data.clear(),
      };
    },
  };
});

jest.mock('expo-secure-store', () => {
  const data = new Map<string, string>();
  return {
    getItem: jest.fn((key: string) => data.get(key) ?? null),
    setItem: jest.fn((key: string, value: string) => void data.set(key, value)),
    deleteItemAsync: jest.fn(async (key: string) => void data.delete(key)),
  };
});
