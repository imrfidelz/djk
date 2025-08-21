import React, { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { orderService } from '@/services/orderService';
import type { Order } from '@/components/admin/types/order.types';
import { toast } from '@/hooks/use-toast';

interface StatusUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  onUpdated: (newStatus: string) => void;
}

const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Canceled'] as const;

const nextStatusMap: Record<string, string | null> = {
  Pending: 'Processing',
  Processing: 'Shipped',
  Shipped: 'Delivered',
  Delivered: null,
  Canceled: null,
};

export default function StatusUpdateDialog({ open, onOpenChange, order, onUpdated }: StatusUpdateDialogProps) {
  const [selected, setSelected] = useState<string>('Pending');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && order) {
      setSelected(order.status);
      setReason('');
    }
  }, [open, order]);

  const isTerminal = (status: string) => status === 'Delivered' || status === 'Canceled';

  const isAllowed = useMemo(() => {
    if (!order) return (status: string) => false;
    return (target: string) => {
      const from = order.status;
      if (from === target) return true;
      if (isTerminal(from)) return false;
      if (target === 'Canceled') return true; // allow cancel until delivered
      const next = nextStatusMap[from];
      return next === target;
    };
  }, [order]);

  const canSubmit = order && selected !== order.status && isAllowed(selected);

  const handleSubmit = async () => {
    if (!order || !canSubmit || submitting) return;

    setSubmitting(true);
    const t = toast({
      title: 'Updating order status...',
      description: `Changing to ${selected}`,
    });

    try {
      await orderService.updateStatus(order._id, selected);
      onUpdated(selected);
      t.update?.({
        title: 'Order updated',
        description: `Status changed to ${selected}`,
      });
      onOpenChange(false);
    } catch (e: any) {
      t.update?.({
        title: 'Update failed',
        description: e?.message || 'Could not update order status',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
          <DialogDescription>
            {order ? `Order ${(order as any).orderNumber || order._id?.slice(-6)}` : ''}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Select new status</p>
            <RadioGroup value={selected} onValueChange={setSelected} className="gap-3">
              {statuses.map((s) => {
                const disabled = !isAllowed(s);
                return (
                  <div key={s} className="flex items-center gap-3">
                    <RadioGroupItem id={`status-${s}`} value={s} disabled={disabled} />
                    <Label htmlFor={`status-${s}`} className={disabled ? 'text-muted-foreground' : ''}>
                      {s}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          {selected === 'Canceled' && (
            <div className="space-y-2">
              <Label htmlFor="cancel-reason">Cancellation reason (optional)</Label>
              <Textarea
                id="cancel-reason"
                placeholder="Provide a reason to help your team and the customer"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Note: Reason is for internal notes only and may not be sent to the backend.</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit || submitting}>
            {submitting ? 'Updating...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
