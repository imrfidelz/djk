
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Star, Share2, Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import ProductCard from "@/components/ProductCard";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { cartService } from "@/services/cartService";
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import { brandService } from '@/services/brandService';
import { reviewService } from '@/services/reviewService';
import AddProductReviewForm from '@/components/reviews/AddProductReviewForm';
import { useCart } from '@/hooks/useCart';
import { formatCurrency } from '@/lib/currency';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch product data
  const { data: product, isLoading: productLoading, error: productError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => id ? productService.getById(id) : Promise.reject('No product ID'),
    enabled: !!id,
  });

  // Fetch categories and brands for display names
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
  });

  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: brandService.getAll,
  });

  // Fetch related products (same category)
  const { data: allProducts = [] } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getAll,
  });

  // Fetch product reviews
  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => id ? reviewService.getByProduct(id) : Promise.reject('No product ID'),
    enabled: !!id,
  });

  // Get related products from same category
  const relatedProducts = product ? allProducts
    .filter(p => p.category === product.category && p.id !== product.id && p.isLive)
    .slice(0, 4) : [];

  // Helper functions
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const getBrandName = (brandId: string) => {
    const brand = brands.find(b => b.id === brandId);
    return brand ? brand.name : 'Unknown';
  };

  useEffect(() => {
    // Reset state when product changes
    setQuantity(1);
    setSelectedImage(0);
    setSelectedSize(null);
    setSelectedColor(null);
    
    // Scroll to top when navigating between products
    window.scrollTo(0, 0);
  }, [id]);

  const { updateCartCount } = useCart();

  const handleAddToCart = async () => {
    if (!product) return;

    setIsAddingToCart(true);

    try {
      // Validate total quantity across all variants before adding
      const currentTotal = await cartService.getTotalQuantityForProduct(product.id);
      const remaining = Math.max(0, product.stock - currentTotal);
      const addQty = Math.min(quantity, remaining);

      if (addQty <= 0) {
        toast({
          title: 'Stock limit reached',
          description: `You already have the maximum available quantity (${product.stock}) of this product in your cart across variants.`,
        });
        return;
      }

      await cartService.addToCart(
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.mainImage,
          size: selectedSize,
          color: selectedColor,
        },
        addQty
      );

      // Refresh cart badge after successful add
      await updateCartCount();

      // Feedback
      toast({
        title: 'Added to cart',
        description: `${addQty} × ${product?.name} has been added to your cart.${addQty < quantity ? ' (Adjusted due to stock limits)' : ''}`,
      });
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to add item to cart. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);
  
  if (productLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-16 min-h-[60vh] flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="h-8 bg-gray-200 rounded-md w-64 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-200 rounded-md w-40 mx-auto"></div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (productError || !product) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-16 min-h-[60vh] flex flex-col items-center justify-center">
          <h1 className="text-2xl font-serif mb-4">Product Not Found</h1>
          <p className="mb-8 text-gray-600">The product you're looking for doesn't exist or is not available.</p>
          <Link to="/" className="outline-button">
            Return to Homepage
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const categoryName = getCategoryName(product.category);
  const brandName = getBrandName(product.brand);
  const inStock = product.stock > 0;

  return (
    <>
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink to="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink to={`/collections?category=${categoryName.toLowerCase()}`}>
                {categoryName}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink className="text-muted-foreground">
                {product.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden bg-gray-50">
              <img 
                src={product.images[selectedImage] || product.mainImage} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image: string, idx: number) => (
                  <button 
                    key={idx}
                    className={`aspect-square border-2 ${selectedImage === idx ? 'border-luxury-gold' : 'border-transparent'}`}
                    onClick={() => setSelectedImage(idx)}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} view ${idx + 1}`}
                      className="w-full h-full object-cover" 
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div>
            <div className="mb-2 text-sm uppercase tracking-wider text-gray-500">
              {categoryName}
            </div>
            <h1 className="font-serif text-3xl md:text-4xl mb-4">{product.name}</h1>
            <div className="flex items-baseline mb-6">
              <span className="text-2xl font-medium">{formatCurrency(product.price)}</span>
              <span className="ml-2 text-sm text-gray-500">+ Free Shipping</span>
            </div>
            
            <p className="text-gray-600 mb-8">{product.description}</p>
            
            {/* Available Sizes */}
            {product.size && product.size.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium mb-3">Available Sizes</h3>
                <div className="flex flex-wrap gap-2">
                  {product.size.map((size, index) => (
                    <button 
                      key={index}
                      onClick={() => setSelectedSize(size.label)}
                      className={`px-3 py-1 border text-sm transition-colors ${
                        selectedSize === size.label 
                          ? 'border-luxury-gold bg-luxury-gold text-white' 
                          : 'border-gray-300 hover:border-luxury-gold'
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Available Colors */}
            {product.color && product.color.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium mb-3">Available Colors</h3>
                <div className="flex flex-wrap gap-2">
                  {product.color.map((color, index) => (
                    <button 
                      key={index}
                      onClick={() => setSelectedColor(color.label)}
                      className={`px-3 py-1 border text-sm transition-colors ${
                        selectedColor === color.label 
                          ? 'border-luxury-gold bg-luxury-gold text-white' 
                          : 'border-gray-300 hover:border-luxury-gold'
                      }`}
                    >
                      {color.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Stock Status */}
            <div className="mb-4">
              <span className={`text-sm ${inStock ? 'text-green-600' : 'text-red-600'}`}>
                {inStock ? `${product.stock} in stock` : 'Out of Stock'}
              </span>
            </div>
            
            {/* Add to Cart Section */}
            <div className="mb-8 space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                {/* Quantity Selector */}
                <div className="flex items-center border border-gray-300">
                  <button 
                    onClick={decrementQuantity}
                    className="w-10 h-10 flex items-center justify-center border-r border-gray-300 hover:bg-gray-50"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center">{quantity}</span>
                  <button 
                    onClick={incrementQuantity}
                    className="w-10 h-10 flex items-center justify-center border-l border-gray-300 hover:bg-gray-50"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                {/* Add to Cart Button */}
                <button 
                  onClick={handleAddToCart}
                  className="gold-button flex-1 py-2.5 justify-center"
                  disabled={!inStock || isAddingToCart}
                >
                  <ShoppingBag size={18} />
                  {isAddingToCart 
                    ? 'Adding...' 
                    : inStock 
                      ? 'Add to Cart' 
                      : 'Out of Stock'
                  }
                </button>
                
                {/* Wishlist Button */}
                <button className="h-10 w-10 border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                  <Heart size={18} />
                </button>
                
                {/* Share Button */}
                <button className="h-10 w-10 border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                  <Share2 size={18} />
                </button>
              </div>
              
              {/* Product Details */}
              <div className="pt-8 border-t border-gray-200 text-sm space-y-2">
                <div className="flex">
                  <span className="text-gray-500 w-24">Category:</span>
                  <Link to={`/collections?category=${categoryName.toLowerCase()}`} className="hover:text-luxury-gold">
                    {categoryName}
                  </Link>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-24">Brand:</span>
                  <span>{brandName}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-24">SKU:</span>
                  <span>DJK-{product.id.slice(-6).toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start border-b rounded-none gap-8 h-auto pb-0">
              <TabsTrigger 
                value="description" 
                className="pb-4 pt-0 px-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-luxury-gold bg-transparent"
              >
                Description
              </TabsTrigger>
              {product.specifications && product.specifications.length > 0 && (
                <TabsTrigger 
                  value="specifications" 
                  className="pb-4 pt-0 px-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-luxury-gold bg-transparent"
                >
                  Specifications
                </TabsTrigger>
              )}
              <TabsTrigger 
                value="reviews" 
                className="pb-4 pt-0 px-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-luxury-gold bg-transparent"
              >
                Reviews ({reviews.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="pt-8 pb-4">
              <div className="prose max-w-none text-gray-600">
                <p>{product.description}</p>
              </div>
            </TabsContent>
            {product.specifications && product.specifications.length > 0 && (
              <TabsContent value="specifications" className="pt-8 pb-4">
                <div className="border-t border-gray-200">
                  {product.specifications.map((spec, idx) => (
                    <div key={idx} className={`py-4 flex ${idx !== 0 ? 'border-t border-gray-200' : ''}`}>
                      <span className="w-1/3 font-medium">{spec.label}</span>
                      <span className="w-2/3 text-gray-600">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            )}
            <TabsContent value="reviews" className="pt-8 pb-4">
              <div className="mb-8">
                {reviews.length === 0 ? (
                  <p className="text-gray-600 mb-4">There are no reviews yet.</p>
                ) : (
                  <div className="space-y-6 mb-8">
                    {reviews.map((review) => (
                      <div key={review._id} className="border-b border-gray-200 pb-6">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                size={16} 
                                className={star <= review.rating ? 'text-luxury-gold fill-current' : 'text-gray-300'} 
                              />
                            ))}
                          </div>
                          <span className="font-medium">{review.name}</span>
                          <span className="text-gray-500 text-sm">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                <h3 className="font-serif text-lg mb-4">
                  {reviews.length === 0 ? `Be the first to review "${product.name}"` : 'Add your review'}
                </h3>
                <p className="text-gray-600 mb-8">Your email address will not be published. Required fields are marked *</p>
                
                <AddProductReviewForm productId={id!} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="flex justify-between items-end mb-10">
              <h2 className="font-serif text-2xl md:text-3xl">Related Products</h2>
              <Link to={`/collections?category=${categoryName.toLowerCase()}`} className="text-sm flex items-center text-luxury-gold hover:underline">
                View All <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id}>
                  <ProductCard 
                    id={relatedProduct.id}
                    name={relatedProduct.name}
                    price={relatedProduct.price}
                    image={relatedProduct.mainImage}
                    category={getCategoryName(relatedProduct.category)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <Newsletter />
      <Footer />
    </>
  );
};

export default ProductDetails;
