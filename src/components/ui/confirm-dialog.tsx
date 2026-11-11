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
  /** Omit when the dialog is controlled through `open`/`onOpenChange`. */
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  isConfirming?: boolean;
  errorMessage?: string | null;
  /** Called when the dialog opens, e.g. to reset a previous failed mutation. */
  onOpen?: () => void;
  /** Button text while `isConfirming`. */
  confirmingLabel?: string;
  /** Extra content between the description and the error, e.g. an option. */
  children?: ReactNode;
}

export function ConfirmDialog({
  trigger,
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Excluir',
  onConfirm,
  isConfirming,
  errorMessage,
  onOpen,
  confirmingLabel = 'Excluindo...',
  children,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange?.(nextOpen);
        if (nextOpen) onOpen?.();
      }}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        {errorMessage && <Text className="text-center text-sm text-error">{errorMessage}</Text>}
        <DialogFooter>
          <Button variant="destructive" onPress={onConfirm} disabled={isConfirming}>
            <Text>{isConfirming ? confirmingLabel : confirmLabel}</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
