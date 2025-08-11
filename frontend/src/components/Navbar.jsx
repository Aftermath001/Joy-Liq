import { useState } from "react";
import { ShoppingCart, UserPlus, LogIn, LogOut, Lock, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import Logo from "../assets/doubleshasalogo.png";

const Navbar = () => {
  const { user, logout } = useUserStore();
  const isAdmin = user?.role === "admin";
  const { cart } = useCartStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout(navigate);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-[#231f20] bg-opacity-95 backdrop-blur-md shadow-lg z-40 border-b border-[#00adef]">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <img
            onClick={() => navigate("/")}
            className="h-10 w-10 object-cover rounded-full cursor-pointer"
            src={Logo}
            alt="Logo"
          />
          <Link
            to="/"
            className="text-2xl font-bold text-[#00adef] ml-2 hidden sm:flex"
          >
            DOUBLE SHASA
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-4">
          <Link to="/" className="text-[#fefefe] hover:text-[#00adef]">Home</Link>
          <Link to="/about" className="text-[#fefefe] hover:text-[#00adef]">About</Link>
          <Link to="/contact" className="text-[#fefefe] hover:text-[#00adef]">Contact</Link>

          {user && (
            <>
              <Link to="/cart" className="relative group text-[#fefefe] hover:text-[#00adef]">
                <ShoppingCart size={20} className="inline-block mr-1" />
                <span>Cart</span>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -left-2 bg-[#00adef] text-white rounded-full px-2 py-0.5 text-xs">
                    {cart.length}
                  </span>
                )}
              </Link>
              <Link to="/shop" className="text-[#fefefe] hover:text-[#00adef]">🛍️ Shop</Link>
            </>
          )}

          {isAdmin && (
            <Link to="/secret-dashboard" className="bg-[#00adef] text-white px-3 py-1 rounded-md flex items-center">
              <Lock size={18} className="mr-1" /> Dashboard
            </Link>
          )}

          {user ? (
            <button onClick={handleLogout} className="bg-[#848182] text-white py-2 px-4 rounded-md flex items-center">
              <LogOut size={18} className="mr-1" /> Log Out
            </button>
          ) : (
            <>
              <Link to="/signup" className="bg-[#00adef] text-white py-2 px-4 rounded-md flex items-center">
                <UserPlus size={18} className="mr-2" /> Sign Up
              </Link>
              <Link to="/login" className="bg-[#848182] text-white py-2 px-4 rounded-md flex items-center">
                <LogIn size={18} className="mr-2" /> Login
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#231f20] px-4 py-3 space-y-3">
          <Link to="/" className="block text-[#fefefe] hover:text-[#00adef]" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/about" className="block text-[#fefefe] hover:text-[#00adef]" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/contact" className="block text-[#fefefe] hover:text-[#00adef]" onClick={() => setMenuOpen(false)}>Contact</Link>

          {user && (
            <>
              <Link to="/cart" className="block text-[#fefefe] hover:text-[#00adef]" onClick={() => setMenuOpen(false)}>Cart ({cart.length})</Link>
              <Link to="/shop" className="block text-[#fefefe] hover:text-[#00adef]" onClick={() => setMenuOpen(false)}>Shop</Link>
            </>
          )}

          {isAdmin && (
            <Link to="/secret-dashboard" className="block bg-[#00adef] text-white px-3 py-2 rounded-md" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          )}

          {user ? (
            <button
              onClick={() => { handleLogout(); setMenuOpen(false); }}
              className="block w-full bg-[#848182] text-white py-2 px-4 rounded-md"
            >
              Log Out
            </button>
          ) : (
            <>
              <Link to="/signup" className="block bg-[#00adef] text-white py-2 px-4 rounded-md" onClick={() => setMenuOpen(false)}>Sign Up</Link>
              <Link to="/login" className="block bg-[#848182] text-white py-2 px-4 rounded-md" onClick={() => setMenuOpen(false)}>Login</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
