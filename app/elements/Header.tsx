'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  User,
  Search,
  LogOut,
  LayoutDashboard,
  Heart,
  ShoppingCart,
  Home,
  Store,
  Info,
  Phone,
  Package,
  Sparkles,
  ExternalLink,
  Loader2,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

import { getCartItems } from '@/redux/slice/CartItemSlice';
import { logoutuser, resetState } from '@/redux/slice/AuthSlice';
import { fetchSearchSuggestions, clearSuggestions } from '@/redux/slice/ProductSlice';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';

import { CartPopover } from './CartPopover';
import LoginPopup from './LoginPopup';
import WishlistDrawer from './WishlistDrawer';

import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/* ---------- one-time helper ---------- */
const useOnce = (fn: () => void, condition: boolean) => {
  const ref = React.useRef(false);
  useEffect(() => {
    if (!ref.current && condition) {
      ref.current = true;
      fn();
    }
  }, [fn, condition]);
};

/* ---------- debounce hook ---------- */
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/* ---------- component ---------- */
export default function HeaderImproved() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const [openWishlist, setOpenWishlist] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  /* ---------- redux ---------- */
  const { isAuthenticated, user, message } = useAppSelector(
    (state: RootState) => state.auth
  );

  const { wishlist } = useAppSelector((state: RootState) => state.wishlist);
  const { cart } = useAppSelector((state: RootState) => state.usercart);
  const { suggestions, loading: searchLoading } = useAppSelector((state) => state.product);

  /* ---------- fetch cart once ---------- */
  useOnce(() => dispatch(getCartItems()), isAuthenticated);

  /* ---------- search effect ---------- */
  useEffect(() => {
    if (debouncedSearchQuery.trim().length >= 2) {
      dispatch(fetchSearchSuggestions(debouncedSearchQuery));
    } else {
      dispatch(clearSuggestions());
    }
  }, [debouncedSearchQuery, dispatch]);

  /* ---------- cart items ---------- */
  const cartitems = React.useMemo(
    () =>
      (cart || []).map((c: any) => ({
        _id: c._id,
        name: c.productId?.name ?? 'Unknown',
        image: c.productId?.mainImage ?? '',
        qty: c.quantity ?? 1,
        price: Number(c.productId?.discountPrice || c.productId?.price || 0),
      })),
    [cart]
  );

  /* ---------- auth handlers ---------- */
  const handleUserClick = () => {
    if (!isAuthenticated) {
      setShowLogin(true);
      return;
    }
    setShowProfile((p) => !p);
  };

  useEffect(() => {
    if (isAuthenticated) setShowLogin(false);
  }, [isAuthenticated]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetState());
    }
  }, [message, dispatch]);

  /* ---------- search handlers ---------- */
  const handleSuggestionClick = (product: any) => {
    router.push(`/products/${product.slug}`);
    setSearchQuery('');
    setShowSearchDropdown(false);
    setMobileSearchOpen(false);
    dispatch(clearSuggestions());
  };

  /* ---------- desktop menu (right side) ---------- */
  const desktopMenu = [
    { key: 'home', label: 'Home', href: '/' },
    { key: 'shop', label: 'Shop', href: '/shop' },
    { key: 'about', label: 'About', href: '/about-us' },
    { key: 'contact', label: 'Contact', href: '/contact-us' },
  ];

  /* ---------- mobile menu items ---------- */
  const mobileMenuItems = [
    { key: 'home', label: 'Home', href: '/', icon: Home },
    { key: 'shop', label: 'Shop', href: '/shop', icon: Store },
    { key: 'about', label: 'About Us', href: '/about-us', icon: Info },
    { key: 'contact', label: 'Contact', href: '/contact-us', icon: Phone },
    { key: 'enquiry', label: 'Bulk Enquiry', href: '/enquiry-form', icon: Package },
    { key: 'consultation', label: 'Book Consultation', href: '/styling-consultation-form', icon: Sparkles },
  ];

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.search-container')) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logoutuser());
    setIsMobileMenuOpen(false);
    router.push('/');
  };

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="fixed top-0 left-0 w-full z-[9999] bg-background border-b h-20 px-4 md:px-8 flex items-center justify-between">
        {/* LEFT: Logo */}
        <Link href="/" className="flex-shrink-0">
          <img 
            src="/logo.png" 
            alt="logo" 
            className="h-[50px] w-auto" 
          />
        </Link>

        {/* DESKTOP NAVIGATION - CENTER */}
        <nav className="hidden md:flex items-center gap-8">
          {desktopMenu.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive(item.href) ? "text-primary" : "text-gray-700"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* RIGHT: Desktop Icons + Search + Mobile Hamburger */}
        <div className="flex items-center gap-3">
          {/* DESKTOP SEARCH */}
          <div className="relative w-64 hidden md:block search-container">
            <form>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              
              <input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearchDropdown(true)}
                className="w-full bg-primary text-gray-700 pl-10 pr-10 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    dispatch(clearSuggestions());
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </form>

            {/* SEARCH DROPDOWN */}
            <AnimatePresence>
              {showSearchDropdown && (searchQuery.trim().length >= 2 || suggestions.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.97 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="absolute left-0 mt-3 w-[420px] bg-white border border-gray-200 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] z-[10001] overflow-hidden"
                >
                  <div className="px-5 py-3 border-b flex items-center justify-between">
                    <p className="text-xs uppercase tracking-widest text-gray-500">
                      {searchLoading ? 'Searching...' : suggestions.length > 0 ? 'Suggestions' : 'No results'}
                    </p>
                    {searchLoading && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
                  </div>

                  <div className="max-h-[360px] overflow-y-auto">
                    {suggestions.length === 0 && !searchLoading && searchQuery.trim().length >= 2 && (
                      <div className="px-5 py-8 text-center text-gray-500">
                        <p className="text-sm">No products found</p>
                      </div>
                    )}

                    {suggestions.map((product: any) => (
                      <button
                        key={product._id}
                        onClick={() => handleSuggestionClick(product)}
                        className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors text-left group"
                      >
                        <div className="relative w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                          {product.mainImage ? (
                            <img src={product.mainImage} alt={product.name} className="object-cover w-full h-full" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Search size={16} />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {highlightMatch(product.name, searchQuery)}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            ₹{product.discountPrice || product.price}
                          </p>
                        </div>

                        <ExternalLink size={14} className="text-gray-300 group-hover:text-gray-600" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Search Icon */}
          <button 
            onClick={() => setMobileSearchOpen(true)} 
            className="p-2 md:hidden"
          >
            <Search size={22} />
          </button>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center gap-3">
            {/* User */}
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="cursor-pointer relative" 
                onClick={handleUserClick}
              >
                <User className="w-5 h-5 text-primary" />
              </Button>

              {/* PROFILE DROPDOWN */}
              <AnimatePresence>
                {isAuthenticated && showProfile && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border z-[10001]"
                  >
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-semibold">{user?.name || 'My Account'}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    {user?.role === 'admin' ? (
                      <Link href="/admin" onClick={() => setShowProfile(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100">
                        <LayoutDashboard size={16} /> Admin Panel
                      </Link>
                    ) : (<>
                      <Link href="/dashboard/profile" onClick={() => setShowProfile(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100">
                        <User size={16} /> Profile
                      </Link>
                      <Link href="/dashboard" onClick={() => setShowProfile(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100">
                        <LayoutDashboard size={16} /> Dashboard
                      </Link>
                    </>)}

                    <button
                      onClick={() => {
                        dispatch(logoutuser());
                        setShowProfile(false);
                        router.push('/');
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Wishlist */}
            <button onClick={() => setOpenWishlist(true)} className="relative cursor-pointer p-2">
              <Heart size={20} className='text-primary'/>
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart */}
            <CartPopover items={cartitems} />
          </div>

          {/* Hamburger Menu Button (Mobile Only) */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 md:hidden"
          >
            <Menu size={24} className="text-primary" />
          </button>
        </div>
      </header>

      {/* ================= MOBILE SEARCH OVERLAY ================= */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-[10002] md:hidden"
          >
            <div className="flex items-center gap-3 p-4 border-b">
              <Search size={20} className="text-primary" />
              <div className="flex-1">
                <input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full py-2 text-lg focus:outline-none"
                />
              </div>
              <button 
                onClick={() => {
                  setMobileSearchOpen(false);
                  setSearchQuery('');
                  dispatch(clearSuggestions());
                }}
                className="p-2"
              >
                <X size={24} />
              </button>
            </div>

            <div className="overflow-y-auto h-[calc(100vh-80px)] pb-20">
              {searchLoading && (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              )}

              {!searchLoading && suggestions.length === 0 && searchQuery.trim().length >= 2 && (
                <div className="px-4 py-8 text-center text-gray-500">
                  <p>No products found</p>
                </div>
              )}

              {suggestions.map((product: any) => (
                <button
                  key={product._id}
                  onClick={() => handleSuggestionClick(product)}
                  className="w-full flex items-center gap-4 px-4 py-4 border-b hover:bg-gray-50 text-left"
                >
                  <div className="relative w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                    {product.mainImage ? (
                      <img src={product.mainImage} alt={product.name} className="object-cover w-full h-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Search size={20} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      ₹{product.discountPrice || product.price}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= MOBILE HAMBURGER MENU ================= */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-[10002]"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-[400px] bg-white z-[10003] shadow-2xl overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                <h2 className="font-semibold text-lg">Menu</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={24} />
                </button>
              </div>

              {/* User Info (if authenticated) */}
              {isAuthenticated && user && (
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <div className="p-4">
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Navigation</p>
                <div className="space-y-1">
                  {mobileMenuItems.map((item) => (
                    <Link
                      key={item.key}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-xl transition-colors",
                        isActive(item.href) 
                          ? "bg-primary/10 text-primary" 
                          : "hover:bg-gray-100"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon size={20} className={isActive(item.href) ? "text-primary" : "text-gray-500"} />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* User Actions */}
              <div className="p-4 border-t">
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Account</p>
                <div className="space-y-1">
                  {!isAuthenticated ? (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setShowLogin(true);
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <User size={20} className="text-gray-500" />
                        <span className="font-medium">Login / Register</span>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </button>
                  ) : (
                    <>
                      <Link
                        href="/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-100"
                      >
                        <div className="flex items-center gap-3">
                          <LayoutDashboard size={20} className="text-gray-500" />
                          <span className="font-medium">Dashboard</span>
                        </div>
                        <ChevronRight size={16} className="text-gray-400" />
                      </Link>
                      <Link
                        href="/dashboard/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-100"
                      >
                        <div className="flex items-center gap-3">
                          <User size={20} className="text-gray-500" />
                          <span className="font-medium">Profile</span>
                        </div>
                        <ChevronRight size={16} className="text-gray-400" />
                      </Link>
                    </>
                  )}

                  {/* Cart & Wishlist (Mobile) */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        router.push('/cart');
                      }}
                      className="flex-1 flex items-center justify-center gap-2 p-3 bg-gray-100 rounded-xl"
                    >
                      <ShoppingCart size={20} />
                      <span className="font-medium">Cart ({cartitems.length})</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setOpenWishlist(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 p-3 bg-gray-100 rounded-xl"
                    >
                      <Heart size={20} />
                      <span className="font-medium">Wishlist ({wishlist.length})</span>
                    </button>
                  </div>

                  {/* Logout (if authenticated) */}
                  {isAuthenticated && (
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-between p-3 rounded-xl text-red-600 hover:bg-red-50 mt-2"
                    >
                      <div className="flex items-center gap-3">
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                      </div>
                      <ChevronRight size={16} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ================= LOGIN MODAL ================= */}
      {showLogin && <LoginPopup onClose={() => setShowLogin(false)} />}

      {/* ================= WISHLIST DRAWER ================= */}
      <WishlistDrawer isOpen={openWishlist} onClose={() => setOpenWishlist(false)} />

      {/* ================= MOBILE PROFILE DRAWER ================= */}
      <AnimatePresence>
        {showProfile && isAuthenticated && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-[9998] md:hidden"
              onClick={() => setShowProfile(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed bottom-16 left-0 right-0 z-[9999] bg-white rounded-t-2xl shadow-2xl md:hidden max-h-[70vh] overflow-y-auto"
            >
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {user?.role === 'admin' ? (
                    <Link href="/admin" onClick={() => setShowProfile(false)} className="flex items-center justify-center gap-2 p-3 bg-gray-100 rounded-xl">
                      <LayoutDashboard size={18} /> Admin
                    </Link>
                  ) : (<>
                    <Link href="/dashboard" onClick={() => setShowProfile(false)} className="flex items-center justify-center gap-2 p-3 bg-gray-100 rounded-xl">
                      <LayoutDashboard size={18} /> Dashboard
                    </Link>
                    <Link href="/dashboard/profile" onClick={() => setShowProfile(false)} className="flex items-center justify-center gap-2 p-3 bg-gray-100 rounded-xl">
                      <User size={18} /> Profile
                    </Link>
                  </>)}
                </div>

                {/* Additional Links */}
                <div className="space-y-2 pt-2 border-t">
                  <Link href="/about-us" onClick={() => setShowProfile(false)} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl">
                    <Info size={20} className="text-gray-400" />
                    <span>About Us</span>
                  </Link>
                  <Link href="/contact-us" onClick={() => setShowProfile(false)} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl">
                    <Phone size={20} className="text-gray-400" />
                    <span>Contact</span>
                  </Link>
                  <Link href="/enquiry-form" onClick={() => setShowProfile(false)} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl">
                    <Package size={20} className="text-gray-400" />
                    <span>Bulk Enquiry</span>
                  </Link>
                  <Link href="/styling-consultation-form" onClick={() => setShowProfile(false)} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl">
                    <Sparkles size={20} className="text-gray-400" />
                    <span>Book Consultation</span>
                  </Link>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 p-3 text-red-600 bg-red-50 rounded-xl mt-4"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className="h-9" />
    </>
  );
}

// Helper to highlight matching text
function highlightMatch(text: string, query: string) {
  if (!query) return text;
  
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  
  return parts.map((part, index) => 
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={index} className="text-gray-700 font-semibold bg-primary/10 rounded px-0.5">
        {part}
      </span>
    ) : (
      <span key={index}>{part}</span>
    )
  );
}