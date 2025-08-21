
import { useState } from "react";
import { ShoppingBag, Menu, X, User, LogIn, UserPlus, Settings, List } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import SearchDialog from "./SearchDialog";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { cartCount } = useCart();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navigateToCategory = (category: string) => {
    navigate(`/collections?category=${category}`);
    if (isOpen) {
      setIsOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    if (isOpen) {
      setIsOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 bg-white bg-opacity-95 backdrop-blur-sm z-50 shadow-sm">
      <div className="container mx-auto px-4 flex justify-between items-center h-20">
        {/* Logo */}
        <Link to="/" className="font-serif text-2xl font-bold">
          DJK
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          <Link to="/collections" className="hover:text-luxury-gold transition-colors">
            Collections
          </Link>
          <button 
            onClick={() => navigateToCategory('clothing')} 
            className="hover:text-luxury-gold transition-colors"
          >
            Clothing
          </button>
          <button 
            onClick={() => navigateToCategory('bags')} 
            className="hover:text-luxury-gold transition-colors"
          >
            Bags
          </button>
          <button 
            onClick={() => navigateToCategory('shoes')} 
            className="hover:text-luxury-gold transition-colors"
          >
            Shoes
          </button>
          <button 
            onClick={() => navigateToCategory('jewelry')} 
            className="hover:text-luxury-gold transition-colors"
          >
            Jewelry
          </button>
        </div>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center space-x-6">
          <SearchDialog />
          {isLoading ? (
            <Skeleton className="h-5 w-5 rounded-full" />
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="hover:text-luxury-gold transition-colors outline-none">
                <User size={20} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {isAuthenticated ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/orders" className="flex items-center cursor-pointer">
                        <List className="mr-2 h-4 w-4" />
                        <span>Orders</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    {user?.role === 'admin' && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="flex items-center cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-500 cursor-pointer" onClick={handleLogout}>
                      <LogIn className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/login" className="flex items-center cursor-pointer">
                        <LogIn className="mr-2 h-4 w-4" />
                        <span>Login</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/register" className="flex items-center cursor-pointer">
                        <UserPlus className="mr-2 h-4 w-4" />
                        <span>Register</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Link to="/cart" className="hover:text-luxury-gold transition-colors relative">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-luxury-gold text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          <Link to="/cart" className="relative">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-luxury-gold text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <button aria-label="Toggle Menu" onClick={toggleMenu}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-20 left-0 right-0 bg-white border-t border-gray-100 shadow-md transition-all duration-300 ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="container mx-auto py-4 px-6 flex flex-col space-y-4">
          <Link to="/" className="py-2 hover:text-luxury-gold transition-colors" onClick={toggleMenu}>
            Home
          </Link>
          <Link to="/collections" className="py-2 hover:text-luxury-gold transition-colors" onClick={toggleMenu}>
            Collections
          </Link>
          <button 
            onClick={() => navigateToCategory('clothing')} 
            className="py-2 text-left hover:text-luxury-gold transition-colors"
          >
            Clothing
          </button>
          <button 
            onClick={() => navigateToCategory('bags')} 
            className="py-2 text-left hover:text-luxury-gold transition-colors"
          >
            Bags
          </button>
          <button 
            onClick={() => navigateToCategory('shoes')} 
            className="py-2 text-left hover:text-luxury-gold transition-colors"
          >
            Shoes
          </button>
          <button 
            onClick={() => navigateToCategory('jewelry')} 
            className="py-2 text-left hover:text-luxury-gold transition-colors"
          >
            Jewelry
          </button>
          <Link to="/about" className="py-2 hover:text-luxury-gold transition-colors" onClick={toggleMenu}>
            About
          </Link>
          <Link to="/contact" className="py-2 hover:text-luxury-gold transition-colors" onClick={toggleMenu}>
            Contact
          </Link>
          <div className="flex flex-col pt-2 space-y-2 border-t border-gray-100">
            <SearchDialog mobile={true} />
            {isLoading ? (
              <Skeleton className="h-6 w-20" />
            ) : isAuthenticated ? (
              <>
                <Link to="/profile" className="py-2 hover:text-luxury-gold transition-colors flex items-center" onClick={toggleMenu}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
                <Link to="/orders" className="py-2 hover:text-luxury-gold transition-colors flex items-center" onClick={toggleMenu}>
                  <List className="mr-2 h-4 w-4" />
                  <span>Orders</span>
                </Link>
                <Link to="/settings" className="py-2 hover:text-luxury-gold transition-colors flex items-center" onClick={toggleMenu}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="py-2 hover:text-luxury-gold transition-colors flex items-center" onClick={toggleMenu}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="py-2 hover:text-luxury-gold transition-colors flex items-center text-red-500"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="py-2 hover:text-luxury-gold transition-colors flex items-center" onClick={toggleMenu}>
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Login</span>
                </Link>
                <Link to="/register" className="py-2 hover:text-luxury-gold transition-colors flex items-center" onClick={toggleMenu}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  <span>Register</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
