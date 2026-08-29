import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";
import { Menu, Search, X, Ticket, Heart, ShieldCheck } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { useAppContext } from "../context/AppContext";
import AdminLoginModal from "./AdminLoginModal";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const { favoriteMovies } = useAppContext();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Movies", path: "/movies" },
    { name: "My Bookings", path: "/my-bookings" },
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <>
    <header className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${scrolled ? 'glass-nav py-3 shadow-2xl shadow-black/40' : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group cursor-pointer">
          <img src={assets.logo} alt="QuickShow" className="w-36 sm:w-40 h-auto transition-transform duration-300 group-hover:scale-105" />
        </Link>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-2 rounded-full shadow-inner">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => scrollTo(0, 0)}
              className={`relative px-4 py-1.5 text-sm font-medium transition-all duration-300 rounded-full ${
                isActive(link.path)
                  ? 'text-white bg-gradient-to-r from-primary to-primary-dull shadow-md shadow-primary/30'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {link.name}
            </Link>
          ))}
          {favoriteMovies && favoriteMovies.length > 0 && (
            <Link
              to="/favorite"
              onClick={() => scrollTo(0, 0)}
              className={`relative px-4 py-1.5 text-sm font-medium transition-all duration-300 rounded-full flex items-center gap-1.5 ${
                isActive("/favorite")
                  ? 'text-white bg-gradient-to-r from-primary to-primary-dull shadow-md shadow-primary/30'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-current text-primary" />
              Favorites ({favoriteMovies.length})
            </Link>
          )}
          <button
            id="nav-admin-btn"
            onClick={() => setIsAdminModalOpen(true)}
            className={`relative px-4 py-1.5 text-sm font-medium transition-all duration-300 rounded-full flex items-center gap-1.5 ${
              isActive("/admin")
                ? 'text-white bg-gradient-to-r from-primary to-primary-dull shadow-md shadow-primary/30'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            Admin
          </button>
        </nav>

        {/* Actions & User Menu */}
        <div className="flex items-center gap-4">
          <Link to="/movies" className="hidden sm:flex items-center gap-2 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition">
            <Search className="w-5 h-5" />
          </Link>

          {!user ? (
            <button
              onClick={openSignIn}
              className="glow-btn px-5 py-2 text-sm bg-gradient-to-r from-primary to-primary-dull hover:from-primary-dull hover:to-primary text-white font-medium rounded-full cursor-pointer shadow-lg shadow-primary/30 transition-all duration-300 active:scale-95"
            >
              Sign In
            </button>
          ) : (
            <div className="p-0.5 rounded-full bg-gradient-to-r from-primary via-purple-500 to-primary p-[2px] shadow-md shadow-primary/20">
              <UserButton />
            </div>
          )}

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl bg-white/10 border border-white/10 text-gray-200 hover:text-white"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-black/90 backdrop-blur-2xl transition-all duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-6 px-6">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-gray-300 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>

          <Link
            onClick={() => { scrollTo(0, 0); setIsOpen(false); }}
            to="/"
            className="text-2xl font-semibold text-gray-200 hover:text-primary transition"
          >
            Home
          </Link>
          <Link
            onClick={() => { scrollTo(0, 0); setIsOpen(false); }}
            to="/movies"
            className="text-2xl font-semibold text-gray-200 hover:text-primary transition"
          >
            Movies
          </Link>
          <Link
            onClick={() => { scrollTo(0, 0); setIsOpen(false); }}
            to="/my-bookings"
            className="text-2xl font-semibold text-gray-200 hover:text-primary transition flex items-center gap-2"
          >
            <Ticket className="w-5 h-5 text-primary" />
            My Bookings
          </Link>
          {favoriteMovies && favoriteMovies.length > 0 && (
            <Link
              onClick={() => { scrollTo(0, 0); setIsOpen(false); }}
              to="/favorite"
              className="text-2xl font-semibold text-gray-200 hover:text-primary transition flex items-center gap-2"
            >
              <Heart className="w-5 h-5 text-primary fill-primary" />
              Favorites ({favoriteMovies.length})
            </Link>
          )}
          <button
            id="nav-admin-btn-mobile"
            onClick={() => { setIsOpen(false); setIsAdminModalOpen(true); }}
            className="text-2xl font-semibold text-gray-400 hover:text-primary transition flex items-center gap-2"
          >
            <ShieldCheck className="w-5 h-5 text-primary" />
            Admin
          </button>
        </div>
      </div>
    </header>

    <AdminLoginModal
      isOpen={isAdminModalOpen}
      onClose={() => setIsAdminModalOpen(false)}
    />
    </>
  );
};

export default Navbar;
