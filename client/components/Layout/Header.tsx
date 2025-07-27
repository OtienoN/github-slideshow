import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bars3Icon,
  XMarkIcon,
  ShoppingBagIcon,
  UserIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import SearchModal from '../Search/SearchModal';
import UserDropdown from './UserDropdown';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { cartItems, openCart } = useCart();
  const router = useRouter();

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [router.pathname]);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Categories', href: '/categories', hasDropdown: true },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const categoryDropdown = [
    { name: 'All Products', href: '/products' },
    { name: 'Snacks', href: '/products?category=snacks' },
    { name: 'Cakes', href: '/products?category=cakes' },
    { name: 'Beverages', href: '/products?category=beverages' },
    { name: 'Pastries', href: '/products?category=pastries' },
    { name: 'Seasonal', href: '/products?category=seasonal' },
  ];

  const isActivePath = (path: string) => {
    if (path === '/') {
      return router.pathname === '/';
    }
    return router.pathname.startsWith(path);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200'
            : 'bg-white/90 backdrop-blur-sm'
        }`}
      >
        <div className="container-primary">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <span className="text-2xl">🏰</span>
              <div className="font-display font-bold text-xl text-primary-600 group-hover:text-primary-700 transition-colors">
                Kingdom Snacks
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => (
                <div key={item.name} className="relative group">
                  <Link
                    href={item.href}
                    className={`nav-link ${
                      isActivePath(item.href) ? 'nav-link-active' : ''
                    } flex items-center space-x-1`}
                  >
                    <span>{item.name}</span>
                    {item.hasDropdown && (
                      <ChevronDownIcon className="w-4 h-4 transition-transform group-hover:rotate-180" />
                    )}
                  </Link>

                  {/* Categories Dropdown */}
                  {item.hasDropdown && (
                    <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-48">
                        {categoryDropdown.map((category) => (
                          <Link
                            key={category.name}
                            href={category.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary-600 transition-colors"
                          >
                            {category.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                aria-label="Search products"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              {isAuthenticated && (
                <Link
                  href="/account/wishlist"
                  className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                  aria-label="Wishlist"
                >
                  <HeartIcon className="w-5 h-5" />
                </Link>
              )}

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
                aria-label={`Shopping cart with ${cartItemsCount} items`}
              >
                <ShoppingBagIcon className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemsCount > 9 ? '9+' : cartItemsCount}
                  </span>
                )}
              </button>

              {/* User Menu */}
              {isAuthenticated ? (
                <UserDropdown user={user} />
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/auth/login" className="btn-ghost btn-sm">
                    Login
                  </Link>
                  <Link href="/auth/register" className="btn-primary btn-sm">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-2">
              {/* Mobile Cart Button */}
              <button
                onClick={openCart}
                className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
                aria-label={`Shopping cart with ${cartItemsCount} items`}
              >
                <ShoppingBagIcon className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemsCount > 9 ? '9+' : cartItemsCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden bg-white border-t border-gray-200"
            >
              <div className="container-primary py-4">
                {/* Search Bar */}
                <div className="mb-4">
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="w-full flex items-center space-x-2 p-3 bg-gray-100 rounded-lg text-gray-600"
                  >
                    <MagnifyingGlassIcon className="w-5 h-5" />
                    <span>Search products...</span>
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-2">
                  {navigation.map((item) => (
                    <div key={item.name}>
                      <Link
                        href={item.href}
                        className={`block px-3 py-2 rounded-lg font-medium transition-colors ${
                          isActivePath(item.href)
                            ? 'bg-primary-100 text-primary-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {item.name}
                      </Link>
                      
                      {/* Categories submenu for mobile */}
                      {item.hasDropdown && (
                        <div className="ml-4 mt-2 space-y-1">
                          {categoryDropdown.slice(1).map((category) => (
                            <Link
                              key={category.name}
                              href={category.href}
                              className="block px-3 py-1 text-sm text-gray-600 hover:text-primary-600 transition-colors"
                            >
                              {category.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>

                {/* Mobile User Actions */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      <Link
                        href="/account"
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <UserIcon className="w-5 h-5 text-gray-600" />
                        <div>
                          <div className="font-medium text-gray-900">
                            {user?.firstName} {user?.lastName}
                          </div>
                          <div className="text-sm text-gray-600">View Account</div>
                        </div>
                      </Link>
                      
                      <Link
                        href="/account/wishlist"
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <HeartIcon className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-900">Wishlist</span>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link href="/auth/login" className="btn-outline w-full">
                        Login
                      </Link>
                      <Link href="/auth/register" className="btn-primary w-full">
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Spacer to prevent content from being hidden behind fixed header */}
      <div className="h-16 lg:h-20" />
    </>
  );
};

export default Header;