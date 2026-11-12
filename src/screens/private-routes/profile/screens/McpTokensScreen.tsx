import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';

import { McpTokensContainer } from '../containers/McpTokensContainer';

export function McpTokensScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerClassName="px-4 pb-8 pt-4" keyboardShouldPersistTaps="handled">
        <Text variant="h2" className="mb-4">
          Tokens do MCP
        </Text>
        <McpTokensContainer />
      </ScrollView>
    </SafeAreaView>
  );
}
