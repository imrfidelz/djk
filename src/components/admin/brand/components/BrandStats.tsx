import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Users, TrendingUp, Eye } from 'lucide-react';
import { Brand } from '../../types/brand.types';

interface BrandStatsProps {
  brands: Brand[];
}

const BrandStats: React.FC<BrandStatsProps> = ({ brands }) => {
  const totalBrands = brands.length;
  const activeBrands = brands.filter(b => b.isActive).length;
  const totalProducts = brands.reduce((sum, brand) => sum + brand.productCount, 0);
  const averageProductsPerBrand = totalBrands > 0 ? Math.round(totalProducts / totalBrands) : 0;

  const stats = [
    {
      title: "Total Brands",
      value: totalBrands,
      icon: Package,
      description: "Registered brands",
      color: "text-blue-600"
    },
    {
      title: "Active Brands",
      value: activeBrands,
      icon: Eye,
      description: "Currently active",
      color: "text-green-600"
    },
    {
      title: "Total Products",
      value: totalProducts,
      icon: Users,
      description: "Across all brands",
      color: "text-purple-600"
    },
    {
      title: "Avg Products",
      value: averageProductsPerBrand,
      icon: TrendingUp,
      description: "Per brand",
      color: "text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BrandStats;