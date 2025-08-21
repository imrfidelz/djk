import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Package, Calendar, MoreVertical, Edit, Trash2, Eye, EyeOff, Image } from 'lucide-react';
import { Brand } from '../../types/brand.types';

interface BrandCardProps {
  brand: Brand;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

const BrandCard: React.FC<BrandCardProps> = ({
  brand,
  onEdit,
  onDelete,
  onToggleStatus
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Brand Logo */}
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0 border">
              {brand.logo ? (
                <img 
                  src={brand.logo} 
                  alt={brand.name}
                  className="w-8 h-8 object-contain rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <Package className={`h-6 w-6 text-primary/60 ${brand.logo ? 'hidden' : ''}`} />
            </div>
            
            {/* Brand Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-base truncate">{brand.name}</h3>
                <Badge 
                  variant={brand.isActive ? "default" : "secondary"} 
                  className="text-xs px-2 py-0.5"
                >
                  {brand.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Package className="h-3.5 w-3.5" />
                  <span>{brand.productCount} products</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{formatDate(brand.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={onEdit} className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit Brand
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onToggleStatus} className="flex items-center gap-2">
                {brand.isActive ? (
                  <>
                    <EyeOff className="h-4 w-4" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={onDelete} 
                className="flex items-center gap-2 text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Delete Brand
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {brand.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {brand.description}
          </p>
        )}
        
        {/* Quick Actions */}
        <div className="flex gap-2 mt-4 pt-3 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="flex-1 h-8 text-xs"
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleStatus}
            className={`flex-1 h-8 text-xs ${
              brand.isActive 
                ? 'text-orange-600 hover:text-orange-700 border-orange-200' 
                : 'text-green-600 hover:text-green-700 border-green-200'
            }`}
          >
            {brand.isActive ? (
              <>
                <EyeOff className="h-3 w-3 mr-1" />
                Deactivate
              </>
            ) : (
              <>
                <Eye className="h-3 w-3 mr-1" />
                Activate
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrandCard;