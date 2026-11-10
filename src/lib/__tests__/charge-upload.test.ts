import { MAX_UPLOAD_BYTES, prepareUploadFile } from '@/lib/charge-upload-file';
import { resolveUploadStatus } from '@/lib/charge-upload-status';
import type { Charge, ChargeFailure } from '@/types/entities/charge';

function makeCharge(overrides: Partial<Charge>): Charge {
  return {
    chargeId: 1,
    documentId: 10,
    source: 'Upload',
    issuer: null,
    description: null,
    amount: null,
    dueDate: null,
    barcode: null,
    suggestedCategoryId: null,
    possibleDuplicateTransactionId: null,
    status: 'PendingReview',
    transactionId: null,
    createdAt: '2026-11-10T12:00:00',
    ...overrides,
  };
}

function makeFailure(overrides: Partial<ChargeFailure>): ChargeFailure {
  return {
    documentId: 20,
    source: 'Upload',
    sender: null,
    receivedAt: '2026-11-10T12:00:00',
    failureReason: 'O PDF está protegido por senha.',
    ...overrides,
  };
}

describe('prepareUploadFile', () => {
  it('keeps a PDF from the document picker', () => {
    expect(
      prepareUploadFile({ uri: 'file:///cache/conta.pdf', name: 'conta.pdf', mimeType: 'application/pdf', size: 1000 })
    ).toEqual({ file: { uri: 'file:///cache/conta.pdf', name: 'conta.pdf', type: 'application/pdf' } });
  });

  it('infers the type from the extension and names a photo without fileName', () => {
    expect(prepareUploadFile({ uri: 'file:///cache/ABC.jpg', name: null, mimeType: null })).toEqual({
      file: { uri: 'file:///cache/ABC.jpg', name: 'conta.jpg', type: 'image/jpeg' },
    });
  });

  it('normalizes image/jpg', () => {
    expect(prepareUploadFile({ uri: 'file:///a', name: 'a.jpg', mimeType: 'image/jpg' })).toMatchObject({
      file: { type: 'image/jpeg' },
    });
  });

  it('rejects HEIC and unknown types', () => {
    expect(prepareUploadFile({ uri: 'file:///a.heic', name: 'a.heic', mimeType: 'image/heic' })).toHaveProperty(
      'error'
    );
    expect(prepareUploadFile({ uri: 'file:///a', name: 'a' })).toHaveProperty('error');
  });

  it('rejects a file over 10 MB', () => {
    expect(
      prepareUploadFile({ uri: 'file:///a.pdf', name: 'a.pdf', mimeType: 'application/pdf', size: MAX_UPLOAD_BYTES + 1 })
    ).toEqual({ error: 'O arquivo excede o tamanho máximo de 10 MB.' });
  });
});

describe('resolveUploadStatus', () => {
  it('is processing while the document has neither a charge nor a failure', () => {
    expect(resolveUploadStatus(99, [makeCharge({})], [makeFailure({})])).toEqual({ kind: 'processing' });
  });

  it('is ready when a pending charge points to the document', () => {
    const charge = makeCharge({ documentId: 99 });
    expect(resolveUploadStatus(99, [charge], [])).toEqual({ kind: 'ready', charge });
  });

  it('is already handled when the same file was confirmed before', () => {
    const charge = makeCharge({ documentId: 99, status: 'Confirmed' });
    expect(resolveUploadStatus(99, [charge], [])).toEqual({ kind: 'already-handled', charge });
  });

  it('is failed with the reason from the API', () => {
    expect(resolveUploadStatus(20, [], [makeFailure({})])).toEqual({
      kind: 'failed',
      reason: 'O PDF está protegido por senha.',
    });
  });
});
