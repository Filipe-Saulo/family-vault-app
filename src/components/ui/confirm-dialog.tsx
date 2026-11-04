import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Text } from '@/components/ui/text';

interface ConfirmDialogProps {
  trigger: ReactNode;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  isConfirming?: boolean;
  errorMessage?: string | null;
  /** Called when the dialog opens, e.g. to reset a previous failed mutation. */
  onOpen?: () => void;
}

export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = 'Excluir',
  onConfirm,
  isConfirming,
  errorMessage,
  onOpen,
}: ConfirmDialogProps) {
  return (
    <Dialog onOpenChange={(open) => open && onOpen?.()}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {errorMessage && <Text className="text-center text-sm text-error">{errorMessage}</Text>}
        <DialogFooter>
          <Button variant="destructive" onPress={onConfirm} disabled={isConfirming}>
            <Text>{isConfirming ? 'Excluindo...' : confirmLabel}</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
