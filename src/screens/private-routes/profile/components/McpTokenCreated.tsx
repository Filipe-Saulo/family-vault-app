import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';

interface McpTokenCreatedProps {
  name: string;
  token: string;
  copied: boolean;
  copyErrorMessage: string | null;
  onCopy: () => void;
  onDone: () => void;
}

export function McpTokenCreated({ name, token, copied, copyErrorMessage, onCopy, onDone }: McpTokenCreatedProps) {
  return (
    <Card>
      <CardContent className="gap-3 pt-6">
        <Text className="font-medium">Token &quot;{name}&quot; criado</Text>
        <Text variant="muted" className="text-sm">
          Copie agora: ele não será mostrado de novo, nem se você sair desta tela. Quem tiver este valor lê os seus dados financeiros pelo MCP.
        </Text>
        <Text selectable className="rounded-md border border-border p-3 font-mono text-xs">
          {token}
        </Text>
        {copyErrorMessage && <Text className="text-sm text-error">{copyErrorMessage}</Text>}
        <View className="flex-row gap-2">
          <Button className="flex-1" onPress={onCopy}>
            <Text>{copied ? 'Copiado' : 'Copiar'}</Text>
          </Button>
          <Button className="flex-1" variant="outline" onPress={onDone}>
            <Text>Já copiei</Text>
          </Button>
        </View>
      </CardContent>
    </Card>
  );
}
