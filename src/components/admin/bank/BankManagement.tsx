
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Bank, BankFormData } from '../types/bank.types';
import AddBankButton from './components/AddBankButton';
import BankTable from './components/BankTable';
import { bankService } from '@/services/bankService';

const BankManagement: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch banks
  const { data: banks = [], isLoading, error } = useQuery({
    queryKey: ['banks'],
    queryFn: bankService.getAll,
  });

  // Create bank mutation
  const createMutation = useMutation({
    mutationFn: bankService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banks'] });
      toast({
        title: 'Bank added',
        description: 'The bank account has been successfully added.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete bank mutation
  const deleteMutation = useMutation({
    mutationFn: bankService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banks'] });
      toast({
        title: 'Bank deleted',
        description: 'The bank account has been successfully deleted.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Update bank mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BankFormData> }) =>
      bankService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banks'] });
      toast({
        title: 'Bank updated',
        description: 'The bank account has been successfully updated.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleAddBank = (newBankData: BankFormData) => {
    createMutation.mutate(newBankData);
  };

  const handleDeleteBank = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleUpdateBank = (updatedBank: Bank) => {
    updateMutation.mutate({
      id: updatedBank.id,
      data: {
        name: updatedBank.name,
        accountNumber: updatedBank.accountNumber,
        accountName: updatedBank.accountName,
        isActive: updatedBank.isActive,
      },
    });
  };

  const handleToggleStatus = (id: string) => {
    const bank = banks.find(b => b.id === id);
    if (bank) {
      updateMutation.mutate({
        id,
        data: { isActive: !bank.isActive },
      });
    }
  };

  const maxBanksReached = banks.length >= 3;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif">Bank Account Management</h1>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif">Bank Account Management</h1>
            <p className="text-destructive">Error loading banks: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif">Bank Account Management</h1>
          <p className="text-muted-foreground">Manage bank accounts for receiving payments</p>
          {maxBanksReached && (
            <p className="text-sm text-orange-600 mt-1">
              Maximum of 3 bank accounts allowed
            </p>
          )}
        </div>
        <AddBankButton onAdd={handleAddBank} disabled={maxBanksReached || createMutation.isPending} />
      </div>

      <BankTable
        banks={banks}
        onDelete={handleDeleteBank}
        onUpdate={handleUpdateBank}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
};

export default BankManagement;
