// The API accepts PDF, JPEG and PNG up to 10 MB (it checks the first bytes, not the declared type).
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export const ACCEPTED_DOCUMENT_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

const EXTENSION_TYPES: Record<string, string> = {
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
};

const FALLBACK_NAMES: Record<string, string> = {
  'application/pdf': 'conta.pdf',
  'image/jpeg': 'conta.jpg',
  'image/png': 'conta.png',
};

export interface ChargeUploadFile {
  uri: string;
  name: string;
  type: string;
}

/** What the document and image pickers return, reduced to the fields the upload needs. */
export interface PickedAsset {
  uri: string;
  name?: string | null;
  mimeType?: string | null;
  size?: number | null;
}

export type PrepareUploadResult = { file: ChargeUploadFile } | { error: string };

function extensionOf(value: string | null | undefined): string | undefined {
  const match = value?.split('?')[0].match(/\.([a-z0-9]+)$/i);
  return match?.[1].toLowerCase();
}

function resolveType(asset: PickedAsset): string | undefined {
  const mime = asset.mimeType?.toLowerCase();
  if (mime === 'image/jpg') return 'image/jpeg';
  if (mime) return mime;
  const extension = extensionOf(asset.name) ?? extensionOf(asset.uri);
  return extension ? EXTENSION_TYPES[extension] : undefined;
}

export function prepareUploadFile(asset: PickedAsset): PrepareUploadResult {
  const type = resolveType(asset);
  if (!type || !ACCEPTED_DOCUMENT_TYPES.includes(type)) {
    return { error: 'Tipo de arquivo não suportado. Envie um PDF, JPEG ou PNG.' };
  }
  if (asset.size != null && asset.size > MAX_UPLOAD_BYTES) {
    return { error: 'O arquivo excede o tamanho máximo de 10 MB.' };
  }
  return { file: { uri: asset.uri, name: asset.name || FALLBACK_NAMES[type], type } };
}
