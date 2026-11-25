import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';

import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Text } from '@/components/ui/text';
import { countActiveMcpTokens, DEFAULT_MCP_TOKEN_VALIDITY, MAX_ACTIVE_MCP_TOKENS } from '@/lib/mcp-tokens';
import {
  createMcpTokenRequestSchema,
  type CreateMcpTokenRequestSchema,
} from '@/schemas/services/mcp-token/create-mcp-token-request-schema';
import { useCreateMcpToken } from '@/services/mcp-token/create-mcp-token-service';
import { useMcpTokens } from '@/services/mcp-token/list-mcp-tokens-service';
import { useRevokeMcpToken } from '@/services/mcp-token/revoke-mcp-token-service';
import type { McpToken } from '@/types/entities/mcp-token';

import { McpTokenCreated } from '../components/McpTokenCreated';
import { McpTokenCreateForm } from '../components/McpTokenCreateForm';
import { McpTokenList } from '../components/McpTokenList';

interface CreatedToken {
  name: string;
  token: string;
}

export function McpTokensContainer() {
  const queryClient = useQueryClient();
  const { data: tokens, isLoading, error, refetch } = useMcpTokens();
  const createMutation = useCreateMcpToken();
  const revokeMutation = useRevokeMcpToken();

  // The value lives only in this state: leaving the screen or "Já copiei" drops it for good.
  const [created, setCreated] = useState<CreatedToken | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyErrorMessage, setCopyErrorMessage] = useState<string | null>(null);
  // Kept after closing so the dialog text does not flash empty during the exit animation.
  const [tokenToRevoke, setTokenToRevoke] = useState<McpToken | null>(null);
  const [isRevokeOpen, setIsRevokeOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateMcpTokenRequestSchema>({
    resolver: zodResolver(createMcpTokenRequestSchema),
    defaultValues: { name: '', expiresInDays: DEFAULT_MCP_TOKEN_VALIDITY },
  });

  const onSubmit = handleSubmit((values) => {
    createMutation.mutate(values, {
      onSuccess: (result) => {
        setCreated({ name: result.name, token: result.token });
        setCopied(false);
        setCopyErrorMessage(null);
        // With gcTime 0 on the mutation, reset drops the value from the cache too; the screen state is its only copy.
        createMutation.reset();
        reset({ name: '', expiresInDays: DEFAULT_MCP_TOKEN_VALIDITY });
        queryClient.invalidateQueries({ queryKey: ['mcpTokens'] });
      },
      // A 409 means the cached list is stale (tokens created elsewhere).
      onError: () => queryClient.invalidateQueries({ queryKey: ['mcpTokens'] }),
    });
  });

  const handleCopy = async () => {
    if (!created) return;
    try {
      await Clipboard.setStringAsync(created.token);
      setCopied(true);
      setCopyErrorMessage(null);
    } catch {
      setCopyErrorMessage('Não foi possível copiar. Selecione o texto e copie à mão.');
    }
  };

  const handleRevoke = () => {
    if (!tokenToRevoke) return;
    revokeMutation.mutate(tokenToRevoke.id, {
      onSuccess: () => {
        setIsRevokeOpen(false);
        queryClient.invalidateQueries({ queryKey: ['mcpTokens'] });
      },
      // A 404 means it was already revoked elsewhere: refresh the list.
      onError: () => queryClient.invalidateQueries({ queryKey: ['mcpTokens'] }),
    });
  };

  const atLimit = countActiveMcpTokens(tokens) >= MAX_ACTIVE_MCP_TOKENS;

  return (
    <View className="gap-6">
      <Text variant="muted" className="text-sm">
        Um token deixa um cliente de IA (como o Claude Code) ler, sem alterar nada, as suas transações, o resumo, as
        categorias e as contas para revisar. Cada token só vê os seus dados.
      </Text>

      {created ? (
        <McpTokenCreated
          name={created.name}
          token={created.token}
          copied={copied}
          copyErrorMessage={copyErrorMessage}
          onCopy={handleCopy}
          onDone={() => setCreated(null)}
        />
      ) : atLimit ? (
        <Text variant="muted" className="text-sm">
          Você já tem {MAX_ACTIVE_MCP_TOKENS} tokens ativos. Revogue um para criar outro.
        </Text>
      ) : (
        <McpTokenCreateForm
          control={control}
          errors={errors}
          onSubmit={onSubmit}
          isSubmitting={createMutation.isPending}
          apiErrorMessage={createMutation.error?.message ?? null}
        />
      )}

      <View className="gap-2">
        <Text className="font-medium">Seus tokens</Text>
        <McpTokenList
          tokens={tokens}
          isLoading={isLoading}
          errorMessage={error?.message ?? null}
          onRetry={() => refetch()}
          onRevoke={(token) => {
            setTokenToRevoke(token);
            setIsRevokeOpen(true);
          }}
        />
      </View>

      <ConfirmDialog
        open={isRevokeOpen}
        onOpenChange={setIsRevokeOpen}
        title="Revogar token"
        description={`O token "${tokenToRevoke?.name ?? ''}" para de funcionar na hora. Quem o usa vai precisar de um novo.`}
        confirmLabel="Revogar"
        confirmingLabel="Revogando..."
        isConfirming={revokeMutation.isPending}
        errorMessage={revokeMutation.error?.message}
        onOpen={revokeMutation.reset}
        onConfirm={handleRevoke}
      />
    </View>
  );
}
