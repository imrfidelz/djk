
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Bank } from '../../types/bank.types';
import BankActions from './BankActions';

interface BankTableProps {
  banks: Bank[];
  onDelete: (id: string) => void;
  onUpdate: (bank: Bank) => void;
  onToggleStatus: (id: string) => void;
}

const BankTable: React.FC<BankTableProps> = ({
  banks,
  onDelete,
  onUpdate,
  onToggleStatus,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(banks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBanks = banks.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (banks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No bank accounts found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Bank Name</TableHead>
              <TableHead className="hidden md:table-cell">Account Number</TableHead>
              <TableHead className="hidden lg:table-cell">Account Name</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="hidden sm:table-cell w-[120px]">Created</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentBanks.map((bank) => (
              <TableRow key={bank.id}>
                <TableCell className="font-medium">{bank.name}</TableCell>
                <TableCell className="hidden md:table-cell font-mono text-sm">
                  {bank.accountNumber}
                </TableCell>
                <TableCell className="hidden lg:table-cell">{bank.accountName}</TableCell>
                <TableCell>
                  <Badge variant={bank.isActive ? 'default' : 'secondary'}>
                    {bank.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {new Date(bank.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <BankActions
                    bank={bank}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                    onToggleStatus={onToggleStatus}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards View */}
      <div className="md:hidden space-y-4">
        {currentBanks.map((bank) => (
          <div key={bank.id} className="border rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{bank.name}</h3>
                <p className="text-sm text-muted-foreground font-mono">{bank.accountNumber}</p>
                <p className="text-sm text-muted-foreground">{bank.accountName}</p>
              </div>
              <BankActions
                bank={bank}
                onDelete={onDelete}
                onUpdate={onUpdate}
                onToggleStatus={onToggleStatus}
              />
            </div>
            <div className="flex justify-between items-center pt-2">
              <Badge variant={bank.isActive ? 'default' : 'secondary'}>
                {bank.isActive ? 'Active' : 'Inactive'}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {new Date(bank.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, banks.length)} of {banks.length} banks
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankTable;
