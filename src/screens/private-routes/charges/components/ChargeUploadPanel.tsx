import { Camera, FileText, Image as ImageIcon } from 'lucide-react-native';
import { ActivityIndicator, View } from 'react-native';

import { ErrorState } from '@/components/ErrorState';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import type { UploadStatus } from '@/lib/charge-upload-status';
import type { Charge } from '@/types/entities/charge';

import type { UploadSource } from '../containers/use-charge-upload';

interface ChargeUploadPanelProps {
  onPick: (source: UploadSource) => void;
  onClear: () => void;
  onReview: (charge: Charge) => void;
  onRetryStatus: () => void;
  isUploading: boolean;
  errorMessage: string | null;
  isTracking: boolean;
  status: UploadStatus | undefined;
  statusErrorMessage: string | null;
  timedOut: boolean;
}

function StatusMessage({
  status,
  statusErrorMessage,
  timedOut,
  onReview,
  onRetryStatus,
}: Pick<ChargeUploadPanelProps, 'status' | 'statusErrorMessage' | 'timedOut' | 'onReview' | 'onRetryStatus'>) {
  if (status?.kind === 'ready') {
    return (
      <View className="gap-2">
        <Text className="text-sm text-success">A conta está pronta para revisão.</Text>
        <Button size="sm" onPress={() => onReview(status.charge)}>
          <Text>Revisar agora</Text>
        </Button>
      </View>
    );
  }
  if (status?.kind === 'already-handled') {
    return (
      <Text className="text-sm">
        Este arquivo já foi enviado e a conta foi {status.charge.status === 'Confirmed' ? 'confirmada' : 'descartada'}.
      </Text>
    );
  }
  if (status?.kind === 'failed') {
    return (
      <View className="gap-1">
        <Text className="text-sm text-error">{status.reason}</Text>
        <Text variant="muted" className="text-xs">
          Envie outro arquivo ou lance a despesa à mão em Transações.
        </Text>
      </View>
    );
  }
  if (statusErrorMessage && !timedOut) {
    return <ErrorState message={statusErrorMessage} onRetry={onRetryStatus} />;
  }
  if (timedOut) {
    return (
      <Text variant="muted" className="text-sm">
        A leitura está demorando. A conta aparece em &quot;Para revisar&quot; quando ficar pronta. Não aparece se o
        arquivo não for uma conta, ou se ele já tinha sido enviado e a conta já foi confirmada ou descartada.
      </Text>
    );
  }
  return (
    <View className="flex-row items-center gap-2">
      <ActivityIndicator />
      <Text className="text-sm">Lendo a conta. Isso leva alguns segundos.</Text>
    </View>
  );
}

export function ChargeUploadPanel({
  onPick,
  onClear,
  onReview,
  onRetryStatus,
  isUploading,
  errorMessage,
  isTracking,
  status,
  statusErrorMessage,
  timedOut,
}: ChargeUploadPanelProps) {
  return (
    <Card className="mb-4">
      <CardContent className="gap-3">
        <Text className="font-medium">Enviar conta</Text>
        <View className="flex-row gap-2">
          <Button
            className="flex-1"
            variant="outline"
            size="sm"
            disabled={isUploading}
            accessibilityLabel="Enviar PDF ou imagem"
            onPress={() => onPick('file')}>
            <Icon as={FileText} />
            <Text>Arquivo</Text>
          </Button>
          <Button
            className="flex-1"
            variant="outline"
            size="sm"
            disabled={isUploading}
            accessibilityLabel="Fotografar a conta"
            onPress={() => onPick('camera')}>
            <Icon as={Camera} />
            <Text>Câmera</Text>
          </Button>
          <Button
            className="flex-1"
            variant="outline"
            size="sm"
            disabled={isUploading}
            accessibilityLabel="Escolher foto da galeria"
            onPress={() => onPick('library')}>
            <Icon as={ImageIcon} />
            <Text>Galeria</Text>
          </Button>
        </View>

        {isUploading && (
          <View className="flex-row items-center gap-2">
            <ActivityIndicator />
            <Text className="text-sm">Enviando...</Text>
          </View>
        )}

        {errorMessage && <Text className="text-sm text-error">{errorMessage}</Text>}

        {isTracking && (
          <StatusMessage
            status={status}
            statusErrorMessage={statusErrorMessage}
            timedOut={timedOut}
            onReview={onReview}
            onRetryStatus={onRetryStatus}
          />
        )}

        {(isTracking || errorMessage) && !isUploading && (
          <Button variant="ghost" size="sm" onPress={onClear}>
            <Text>Fechar</Text>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
