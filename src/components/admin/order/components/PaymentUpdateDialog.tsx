import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Order } from '@/components/admin/types/order.types';
import { orderService } from '@/services/orderService';
import { toast } from '@/hooks/use-toast';

interface PaymentUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  onUpdated: (updated: Order) => void;
}

export default function PaymentUpdateDialog({ open, onOpenChange, order, onUpdated }: PaymentUpdateDialogProps) {
  const [submitting, setSubmitting] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    if (open && order) {
      setIsPaid(!!order.isPaid);
    }
  }, [open, order]);

  const handleConfirm = async () => {
    if (!order || submitting || isPaid) return;
    setSubmitting(true);

    const t = toast({
      title: 'Marking order as paid...',
      description: `Order ${(order as any).orderNumber || order._id?.slice(-6)}`,
    });

    try {
      const updated = await orderService.markAsPaid(order._id);
      onUpdated(updated);
      setIsPaid(true);
      t.update?.({ title: 'Order marked as paid', description: 'Payment status updated successfully' });
      onOpenChange(false);
    } catch (e: any) {
      t.update?.({
        title: 'Failed to update payment',
        description: e?.message || 'Could not mark order as paid',
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
          <DialogTitle>Confirm Payment Update</DialogTitle>
          <DialogDescription>
            {order ? `Order ${(order as any).orderNumber || order._id?.slice(-6)}` : ''}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <p>Mark this order as paid? This will set isPaid to true and record the paid timestamp.</p>
          {order && (
            <div className="text-sm text-muted-foreground">
              <p><span className="font-medium">Payment method:</span> {order.paymentMethod}</p>
              <p><span className="font-medium">Current status:</span> {order.isPaid ? 'Paid' : 'Unpaid'}</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={submitting || isPaid}>
            {submitting ? 'Updating...' : 'Mark as Paid'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
