
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/productService";
import { formatCurrency } from '@/lib/currency';

// Products will be loaded via react-query inside the component


interface SearchDialogProps {
  mobile?: boolean;
}

const SearchDialog: React.FC<SearchDialogProps> = ({ mobile = false }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  
  const { data: liveProducts = [], isLoading } = useQuery({
    queryKey: ['liveProducts'],
    queryFn: productService.getLive,
  });
  
  const filteredProducts = (liveProducts || []).filter((product) => {
    const q = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(q) ||
      (product.description || '').toLowerCase().includes(q)
    );
  });

  const handleProductSelect = (productId: string) => {
    setOpen(false);
    navigate(`/product/${productId}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
    navigate(`/collections?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mobile ? (
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search size={20} />
          </Button>
        ) : (
          <Button variant="ghost" size="icon" className="hover:text-luxury-gold transition-colors" aria-label="Search">
            <Search size={20} />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-center">Search Products</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <Input 
              placeholder="Search for products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
              autoFocus
            />
            <Button type="submit">Search</Button>
          </form>

          <Command className="rounded-lg border shadow-md">
            <CommandList>
              {searchQuery.length > 0 && (
                <>
                  {isLoading ? <CommandEmpty>Loading products...</CommandEmpty> : <CommandEmpty>No products found.</CommandEmpty>}
                  {filteredProducts.length > 0 && (
                    <CommandGroup heading="Products">
                      {filteredProducts.slice(0, 5).map((product) => (
                        <CommandItem 
                          key={product.id}
                          onSelect={() => handleProductSelect(product.id)}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <div className="h-10 w-10 overflow-hidden rounded-md">
                              <img 
                                src={product.mainImage} 
                                alt={`${product.name} product image`} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex flex-col">
                              <p className="text-sm font-medium">{product.name}</p>
                              <p className="text-xs text-gray-500">{formatCurrency(product.price)}</p>
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                      {filteredProducts.length > 5 && (
                        <div className="py-2 px-2 text-sm text-gray-500">
                          + {filteredProducts.length - 5} more results
                        </div>
                      )}
                    </CommandGroup>
                  )}
                </>
              )}
            </CommandList>
          </Command>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
