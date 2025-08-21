
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Category } from '../../types/category.types';
import CategoryActions from './CategoryActions';
import { Input } from '@/components/ui/input';
import { Search, Package } from 'lucide-react';

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({ categories, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mobile card view for small screens
  const MobileCategoryCard = ({ category }: { category: Category }) => {
    return (
      <div className="border border-border rounded-lg p-4 space-y-3 bg-card">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage 
                src={category.image || ''} 
                alt={category.name}
                className="object-cover"
              />
              <AvatarFallback className="bg-muted">
                <Package className="h-4 w-4 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-card-foreground truncate">
                {category.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {category.productCount} products
              </p>
            </div>
          </div>
          <CategoryActions 
            category={category}
            onEdit={() => onEdit(category)}
            onDelete={() => onDelete(category)}
          />
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {category.description}
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="relative px-4 md:px-6">
        <Search className="absolute left-7 md:left-9 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          placeholder="Search categories..." 
          className="pl-10" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Mobile view */}
      <div className="md:hidden space-y-3 px-4">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <MobileCategoryCard key={category.id} category={category} />
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p>No categories found. Create your first category.</p>
          </div>
        )}
      </div>

      {/* Desktop view */}
      <div className="hidden md:block">
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden lg:table-cell">Description</TableHead>
                  <TableHead className="text-center min-w-[80px]">Products</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <Avatar className="h-10 w-10">
                          <AvatarImage 
                            src={category.image || ''} 
                            alt={category.name}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-muted">
                            <Package className="h-4 w-4 text-muted-foreground" />
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell className="hidden lg:table-cell">{category.description}</TableCell>
                      <TableCell className="text-center">{category.productCount}</TableCell>
                      <TableCell>
                        <CategoryActions 
                          category={category}
                          onEdit={() => onEdit(category)}
                          onDelete={() => onDelete(category)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No categories found. Create your first category.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryTable;
