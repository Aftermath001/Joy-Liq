// ✅ 1. UPDATE: Navbar with About & Contact Routes

import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import Logo from "../assets/doubleshasalogo.png"

const Navbar = () => {
  const { user, logout } = useUserStore();
  const isAdmin = user?.role === "admin";
  const { cart } = useCartStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout(navigate);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-[#231f20] bg-opacity-95 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-[#00adef]">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap justify-between items-center">
          {/* Logo */}
          <div className='flex items-center p-0 m-0'>
            <img
              onClick={() => navigate('/')}
              className='h-20 w-20 object-cover rounded-full cursor-pointer'
              src={Logo}
              alt='Logo'
            />
          </div>
          <Link
            to="/"
            className="text-2xl font-bold text-[#00adef] items-center space-x-2 flex"
          >
            DOUBLE SHASA
          </Link>

          <nav className="flex flex-wrap items-center gap-4">
            <Link
              to="/"
              className="text-[#fefefe] hover:text-[#00adef] transition duration-300"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-[#fefefe] hover:text-[#00adef] transition duration-300"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-[#fefefe] hover:text-[#00adef] transition duration-300"
            >
              Contact
            </Link>

            {user && (
              <>
              <Link
                to="/cart"
                className="relative group text-[#fefefe] hover:text-[#00adef] transition duration-300"
              >
                <ShoppingCart
                  className="inline-block mr-1 group-hover:text-[#00adef]"
                  size={20}
                />
                <span className="hidden sm:inline">Cart</span>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -left-2 bg-[#00adef] text-white rounded-full px-2 py-0.5 text-xs">
                    {cart.length}
                  </span>
                )}
              </Link>

              <Link
                to="/shop"
                className="relative group text-[#fefefe] hover:text-[#00adef] transition duration-300"
              >
                🛍️ <span className="inline-block mr-1 group-hover:text-[#00adef]">Shop</span>
              </Link>
              </>

            )}


          {isAdmin && (
            <Link
              to="/secret-dashboard"
              className="bg-[#00adef] hover:bg-[#0097d1] text-white px-3 py-1 rounded-md font-medium flex items-center"
            >
              <Lock className="inline-block mr-1" size={18} />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          )}

          {user ? (
            <button
              className="bg-[#848182] hover:bg-[#989697] text-white py-2 px-4 rounded-md flex items-center"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              <span className="hidden sm:inline ml-2">Log Out</span>
            </button>
          ) : (
            <>
              <Link
                to="/signup"
                className="bg-[#00adef] hover:bg-[#0097d1] text-white py-2 px-4 rounded-md flex items-center"
              >
                <UserPlus className="mr-2" size={18} /> Sign Up
              </Link>
              <Link
                to="/login"
                className="bg-[#848182] hover:bg-[#989697] text-white py-2 px-4 rounded-md flex items-center"
              >
                <LogIn className="mr-2" size={18} /> Login
              </Link>
            </>
          )}
        </nav>
      </div>
    </div>
    </header >
  );
};

export default Navbar;