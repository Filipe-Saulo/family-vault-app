import { useQueryClient } from '@tanstack/react-query';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useCallback, useEffect, useState } from 'react';

import { ACCEPTED_DOCUMENT_TYPES, prepareUploadFile, type PickedAsset } from '@/lib/charge-upload-file';
import { useUploadStatus } from '@/services/charge/get-upload-status-service';
import { useUploadCharge } from '@/services/charge/upload-charge-service';

export type UploadSource = 'file' | 'camera' | 'library';

// After this, the panel stops polling and says the bill shows up in the list when it is ready (a document that is
// not a bill never shows up, and without an AI key on the API the document waits indefinitely).
const POLL_LIMIT_MS = 2 * 60 * 1000;

// JPEG at 0.7 keeps a phone photo well under the API's 10 MB limit.
const IMAGE_QUALITY = 0.7;

async function pickAsset(source: UploadSource): Promise<PickedAsset | { error: string } | null> {
  if (source === 'file') {
    const result = await DocumentPicker.getDocumentAsync({
      type: ACCEPTED_DOCUMENT_TYPES,
      copyToCacheDirectory: true,
    });
    if (result.canceled) return null;
    const asset = result.assets[0];
    return { uri: asset.uri, name: asset.name, mimeType: asset.mimeType, size: asset.size };
  }

  if (source === 'camera') {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      return { error: 'Permita o acesso à câmera nas configurações do aparelho para fotografar a conta.' };
    }
  }

  const options: ImagePicker.ImagePickerOptions = {
    mediaTypes: ['images'],
    quality: IMAGE_QUALITY,
    preferredAssetRepresentationMode: ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
  };
  const result =
    source === 'camera'
      ? await ImagePicker.launchCameraAsync(options)
      : await ImagePicker.launchImageLibraryAsync(options);
  if (result.canceled) return null;
  const asset = result.assets[0];
  return { uri: asset.uri, name: asset.fileName, mimeType: asset.mimeType, size: asset.fileSize };
}

export function useChargeUpload() {
  const queryClient = useQueryClient();
  const [pickError, setPickError] = useState<string | null>(null);
  const [documentId, setDocumentId] = useState<number | null>(null);
  const [timedOut, setTimedOut] = useState(false);

  const { mutate: uploadFile, reset: resetUpload, isPending: isUploading, error: uploadError } = useUploadCharge();
  const status = useUploadStatus(documentId, documentId !== null && !timedOut);
  const statusKind = status.data?.kind;

  useEffect(() => {
    if (documentId === null) return;
    const timer = setTimeout(() => setTimedOut(true), POLL_LIMIT_MS);
    return () => clearTimeout(timer);
  }, [documentId]);

  // The document left processing: refresh the lists so the new bill (or failure) shows up.
  useEffect(() => {
    if (statusKind && statusKind !== 'processing') {
      queryClient.invalidateQueries({ queryKey: ['charges', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['charges', 'failures'] });
    }
  }, [statusKind, queryClient]);

  const clear = useCallback(() => {
    setPickError(null);
    setDocumentId(null);
    setTimedOut(false);
    resetUpload();
  }, [resetUpload]);

  const start = useCallback(
    async (source: UploadSource) => {
      clear();
      let picked: Awaited<ReturnType<typeof pickAsset>>;
      try {
        picked = await pickAsset(source);
      } catch {
        setPickError('Não foi possível abrir o arquivo. Tente de novo.');
        return;
      }
      if (!picked) return;
      if ('error' in picked) {
        setPickError(picked.error);
        return;
      }
      const prepared = prepareUploadFile(picked);
      if ('error' in prepared) {
        setPickError(prepared.error);
        return;
      }
      uploadFile(prepared.file, {
        onSuccess: (result) => setDocumentId(result.documentId),
      });
    },
    [clear, uploadFile]
  );

  return {
    start,
    clear,
    isUploading,
    errorMessage: pickError ?? uploadError?.message ?? null,
    documentId,
    status: status.data,
    statusErrorMessage: status.isError && !status.data ? status.error.message : null,
    retryStatus: () => status.refetch(),
    timedOut,
  };
}
