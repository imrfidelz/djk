
import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash } from 'lucide-react';
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Category } from '../types/category.types';
import { Brand } from '../types/brand.types';
import { Product } from '../types/product.types';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { categoryService } from '@/services/categoryService';
import { brandService } from '@/services/brandService';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  price: z.number(),
  stock: z.number(),
  brand: z.string(),
  category: z.string(),
  images: z.array(z.any()),
  mainImageIndex: z.number(),
  mainImage: z.string(),
  slug: z.string(),
  size: z.array(z.object({ label: z.string() })),
  specifications: z.array(z.object({ label: z.string(), value: z.string() })),
  color: z.array(z.object({ label: z.string() })),
  isLive: z.boolean(),
  isMain: z.boolean(),
  isFeatured: z.boolean(),
  isHotDeal: z.boolean(),
});

export interface ProductFormValues {
  name: string;
  description: string;
  price: number;
  stock: number;
  brand: string;
  category: string;
  images: File[];
  mainImageIndex: number;
  mainImage: string;
  slug: string;
  size: { label: string }[];
  specifications: { label: string; value: string }[];
  color: { label: string }[];
  isLive: boolean;
  isMain: boolean;
  isFeatured: boolean;
  isHotDeal: boolean;
}

interface ProductFormProps {
  onSubmit: (values: FormData) => void;
  onCancel: () => void;
  product?: Product;
  isLoading?: boolean;
  isEdit?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, onCancel, product, isLoading, isEdit }) => {
  const { toast } = useToast();
  const [images, setImages] = useState<File[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState<number>(0);
  const [size, setSize] = useState<{ label: string }[]>([{ label: '' }]);
  const [specifications, setSpecifications] = useState<{ label: string; value: string }[]>([{ label: '', value: '' }]);
  const [color, setColor] = useState<{ label: string }[]>([{ label: '' }]);

  // Fetch categories and brands
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
  });

  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: brandService.getAll,
  });

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || 0,
      stock: product?.stock || 0,
      brand: product?.brand || "",
      category: product?.category || "",
      images: [],
      mainImageIndex: 0,
      mainImage: product?.mainImage || "",
      slug: product?.slug || "",
      size: product?.size || [{ label: '' }],
      specifications: product?.specifications || [{ label: '', value: '' }],
      color: product?.color || [{ label: '' }],
      isLive: product?.isLive || false,
      isMain: product?.isMain || false,
      isFeatured: product?.isFeatured || false,
      isHotDeal: product?.isHotDeal || false,
    },
  })

  // Initialize local state when product changes
  useEffect(() => {
    if (product) {
      // Reset form with product data
      form.reset({
        name: product.name || "",
        description: product.description || "",
        price: product.price || 0,
        stock: product.stock || 0,
        brand: product.brand || "",
        category: product.category || "",
        images: [],
        mainImageIndex: 0,
        mainImage: product.mainImage || "",
        slug: product.slug || "",
        size: product.size || [{ label: '' }],
        specifications: product.specifications || [{ label: '', value: '' }],
        color: product.color || [{ label: '' }],
        isLive: product.isLive || false,
        isMain: product.isMain || false,
        isFeatured: product.isFeatured || false,
        isHotDeal: product.isHotDeal || false,
      });
      
      // Update local state arrays
      setSize(product.size || [{ label: '' }]);
      setSpecifications(product.specifications || [{ label: '', value: '' }]);
      setColor(product.color || [{ label: '' }]);
      
      // Reset image-related state for edit mode
      setImages([]);
      setMainImageIndex(0);
    } else {
      // Reset form for add mode
      form.reset({
        name: "",
        description: "",
        price: 0,
        stock: 0,
        brand: "",
        category: "",
        images: [],
        mainImageIndex: 0,
        mainImage: "",
        slug: "",
        size: [{ label: '' }],
        specifications: [{ label: '', value: '' }],
        color: [{ label: '' }],
        isLive: false,
        isMain: false,
        isFeatured: false,
        isHotDeal: false,
      });
      
      // Reset local state for add mode
      setSize([{ label: '' }]);
      setSpecifications([{ label: '', value: '' }]);
      setColor([{ label: '' }]);
      setImages([]);
      setMainImageIndex(0);
    }
  }, [product, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length !== 4) {
      toast({
        title: "Error",
        description: "Please select exactly 4 images",
        variant: "destructive",
      });
      return;
    }
    setImages(files);
  };

  const handleMainImageChange = (index: number) => {
    setMainImageIndex(index);
  };

  const handleAddSize = () => {
    setSize([...size, { label: '' }]);
  };

  const handleSizeChange = (index: number, value: string) => {
    const newSize = [...size];
    newSize[index] = { label: value };
    setSize(newSize);
  };

  const handleRemoveSize = (index: number) => {
    if (size.length > 1) {
      const newSize = [...size];
      newSize.splice(index, 1);
      setSize(newSize);
    }
  };

  const handleAddSpecification = () => {
    setSpecifications([...specifications, { label: '', value: '' }]);
  };

  const handleSpecificationChange = (index: number, field: 'label' | 'value', value: string) => {
    const newSpecifications = [...specifications];
    newSpecifications[index][field] = value;
    setSpecifications(newSpecifications);
  };

  const handleRemoveSpecification = (index: number) => {
    if (specifications.length > 1) {
      const newSpecifications = [...specifications];
      newSpecifications.splice(index, 1);
      setSpecifications(newSpecifications);
    }
  };

  const handleAddColor = () => {
    setColor([...color, { label: '' }]);
  };

  const handleColorChange = (index: number, value: string) => {
    const newColor = [...color];
    newColor[index] = { label: value };
    setColor(newColor);
  };

  const handleRemoveColor = (index: number) => {
    if (color.length > 1) {
      const newColor = [...color];
      newColor.splice(index, 1);
      setColor(newColor);
    }
  };

  const onSubmitHandler = (values: ProductFormValues) => {
    // Validate that we have exactly 4 images for new products
    if (!isEdit && images.length !== 4) {
      toast({
        title: "Error",
        description: "Please select exactly 4 images",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('price', values.price.toString());
    formData.append('stock', values.stock.toString());
    formData.append('brand', values.brand);
    formData.append('category', values.category);
    formData.append('slug', values.slug);
    formData.append('isLive', values.isLive.toString());
    formData.append('isMain', values.isMain.toString());
    formData.append('isFeatured', values.isFeatured.toString());
    formData.append('isHotDeal', values.isHotDeal.toString());
    formData.append('mainImageIndex', mainImageIndex.toString());

    // Filter and send arrays as JSON strings (to match backend expectations)
    const filteredSize = size.filter(s => s.label.trim());
    const filteredSpecifications = specifications.filter(spec => spec.label.trim() && spec.value.trim());
    const filteredColor = color.filter(c => c.label.trim());

    if (filteredSize.length > 0) {
      formData.append('size', JSON.stringify(filteredSize));
    }

    if (filteredSpecifications.length > 0) {
      formData.append('specifications', JSON.stringify(filteredSpecifications));
    }

    if (filteredColor.length > 0) {
      formData.append('color', JSON.stringify(filteredColor));
    }

    // Append images
    images.forEach((image) => {
      formData.append('images', image);
    });

    onSubmit(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Product Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="Product Slug" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Product description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Price" 
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Stock" 
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a brand" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Images (Required: exactly 4 images)</FormLabel>
          <FormControl>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
          </FormControl>
          <FormDescription>
            Upload exactly 4 product images. One will be selected as the main image.
          </FormDescription>
          <FormMessage />
        </div>

        {images.length > 0 && (
          <div>
            <FormLabel>Select Main Image</FormLabel>
            <div className="flex gap-4 flex-wrap">
              {images.map((image, index) => (
                <div key={index} className="relative cursor-pointer" onClick={() => handleMainImageChange(index)}>
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Image ${index + 1}`}
                    className={cn(
                      "w-24 h-24 object-cover rounded border-2",
                      mainImageIndex === index ? "border-blue-500" : "border-gray-200"
                    )}
                  />
                  {mainImageIndex === index && (
                    <Badge variant="secondary" className="absolute top-1 right-1 text-xs">
                      Main
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <FormLabel>Size</FormLabel>
          <div className="space-y-2">
            {size.map((s, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Size"
                  value={s.label}
                  onChange={(e) => handleSizeChange(index, e.target.value)}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="icon" 
                  onClick={() => handleRemoveSize(index)}
                  disabled={size.length === 1}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" size="sm" onClick={handleAddSize} className="mt-2">
            <Plus className="h-4 w-4 mr-2" />
            Add Size
          </Button>
        </div>

        <div>
          <FormLabel>Specifications</FormLabel>
          <div className="space-y-2">
            {specifications.map((spec, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Specification"
                  value={spec.label}
                  onChange={(e) => handleSpecificationChange(index, 'label', e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="text"
                  placeholder="Value"
                  value={spec.value}
                  onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="icon" 
                  onClick={() => handleRemoveSpecification(index)}
                  disabled={specifications.length === 1}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" size="sm" onClick={handleAddSpecification} className="mt-2">
            <Plus className="h-4 w-4 mr-2" />
            Add Specification
          </Button>
        </div>

        <div>
          <FormLabel>Color</FormLabel>
          <div className="space-y-2">
            {color.map((c, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Color"
                  value={c.label}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="icon" 
                  onClick={() => handleRemoveColor(index)}
                  disabled={color.length === 1}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" size="sm" onClick={handleAddColor} className="mt-2">
            <Plus className="h-4 w-4 mr-2" />
            Add Color
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="isLive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Live</FormLabel>
                  <FormDescription>
                    Set product live
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isMain"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Main</FormLabel>
                  <FormDescription>
                    Set as main product
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Featured</FormLabel>
                  <FormDescription>
                    Set as featured product
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isHotDeal"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Hot Deal</FormLabel>
                  <FormDescription>
                    Set as hot deal product
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : isEdit ? "Update Product" : "Add Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
