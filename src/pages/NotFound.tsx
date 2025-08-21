
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  return (
    <>
      <Navbar />
      
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
        <h1 className="font-serif text-5xl md:text-6xl mb-4 text-luxury-gold">404</h1>
        <p className="text-xl md:text-2xl mb-8 font-serif">Page Not Found</p>
        <p className="text-gray-600 mb-8 text-center max-w-md">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        <Link 
          to="/"
          className="outline-button"
        >
          Return to Homepage
        </Link>
      </div>
      
      <Footer />
    </>
  );
};

export default NotFound;
