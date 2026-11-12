import { ActivityIndicator, View } from 'react-native';

import { ErrorState } from '@/components/ErrorState';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { describeMcpTokenExpiry, describeMcpTokenLastUse } from '@/lib/mcp-tokens';
import type { McpToken } from '@/types/entities/mcp-token';

interface McpTokenListProps {
  tokens: McpToken[] | undefined;
  isLoading: boolean;
  errorMessage: string | null;
  onRetry: () => void;
  onRevoke: (token: McpToken) => void;
}

export function McpTokenList({ tokens, isLoading, errorMessage, onRetry, onRevoke }: McpTokenListProps) {
  if (isLoading) return <ActivityIndicator />;
  // A failed refetch keeps the list on screen, so revoking stays possible.
  if (errorMessage && !tokens?.length) return <ErrorState message={errorMessage} onRetry={onRetry} />;
  if (!tokens?.length) {
    return (
      <Text variant="muted" className="text-sm">
        Nenhum token criado.
      </Text>
    );
  }
  return (
    <View className="gap-3">
      {tokens.map((token) => (
        <View key={token.id} className="flex-row items-center justify-between gap-2 rounded-md border border-border p-3">
          <View className="flex-1 gap-0.5">
            <Text className="font-medium" numberOfLines={1}>
              {token.name}
            </Text>
            <Text className={token.isExpired ? 'text-xs text-error' : 'text-xs text-muted-foreground'}>
              {describeMcpTokenExpiry(token)}
            </Text>
            <Text variant="muted" className="text-xs">
              {describeMcpTokenLastUse(token)}
            </Text>
          </View>
          <Button
            variant="outline"
            size="sm"
            accessibilityLabel={`Revogar o token ${token.name}`}
            onPress={() => onRevoke(token)}>
            <Text>Revogar</Text>
          </Button>
        </View>
      ))}
    </View>
  );
}
