
export interface Bank {
  id: string;
  name: string;
  accountNumber: string;
  accountName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BankFormData {
  name: string;
  accountNumber: string;
  accountName: string;
  isActive: boolean;
}
