
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface ReviewSearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const ReviewSearchBar: React.FC<ReviewSearchBarProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative">
      <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search reviews..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-8"
      />
    </div>
  );
};

export default ReviewSearchBar;
