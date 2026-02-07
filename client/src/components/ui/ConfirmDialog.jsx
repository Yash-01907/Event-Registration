import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

/**
 * Reusable confirmation dialog for delete, deregister, or any confirm action.
 *
 * @param {boolean} open - Whether the dialog is open
 * @param {function} onOpenChange - Called when dialog open state changes
 * @param {string} title - Dialog title (e.g. "Delete Event")
 * @param {string} description - Message to show (e.g. "Are you sure...?")
 * @param {string} [confirmLabel="Confirm"] - Text for confirm button
 * @param {string} [cancelLabel="Cancel"] - Text for cancel button
 * @param {function} onConfirm - Called when user confirms (can be async)
 * @param {"danger"|"default"} [variant="danger"] - danger = red confirm button, default = neutral
 * @param {boolean} [loading=false] - Show loading spinner on confirm button
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  variant = 'danger',
  loading = false,
}) {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      onOpenChange(false);
    } catch {
      // Parent threw - don't close so user can retry or cancel
    }
  };

  const handleCancel = () => {
    if (!loading) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className='sm:max-w-md'
        onPointerDownOutside={(e) => loading && e.preventDefault()}
        onEscapeKeyDown={(e) => loading && e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className='text-xl font-heading'>{title}</DialogTitle>
          <DialogDescription className='text-gray-400 pt-1'>
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='flex gap-2 sm:gap-0 pt-4'>
          <Button
            variant='outline'
            onClick={handleCancel}
            disabled={loading}
            className='border-gray-700 text-gray-300 hover:bg-white/5'
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            variant={variant === 'danger' ? 'destructive' : 'default'}
          >
            {loading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Please wait...
              </>
            ) : (
              confirmLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
