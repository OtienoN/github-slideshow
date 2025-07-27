import { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

import Layout from '../../components/Layout/Layout';
import ProductCard from '../../components/Product/ProductCard';
import ProductFilters from '../../components/Product/ProductFilters';
import ProductSort from '../../components/Product/ProductSort';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import EmptyState from '../../components/UI/EmptyState';
import Pagination from '../../components/UI/Pagination';
import Breadcrumb from '../../components/UI/Breadcrumb';

// Mock data - replace with API calls
const mockProducts = [
  {
    id: 1,
    name: "Chocolate Birthday Cake",
    price: 15000,
    originalPrice: 18000,
    category: "cakes",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    rating: 4.9,
    reviews: 124,
    isFeatured: true,
    isOnSale: true,
    description: "Rich chocolate cake perfect for birthdays",
    tags: ["chocolate", "birthday", "celebration"]
  },
  {
    id: 2,
    name: "Mixed Nuts Pack",
    price: 3500,
    category: "snacks",
    image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    rating: 4.7,
    reviews: 89,
    isFeatured: true,
    description: "Premium mixed nuts for healthy snacking",
    tags: ["nuts", "healthy", "protein"]
  },
  {
    id: 3,
    name: "Vanilla Cupcakes (6-pack)",
    price: 8000,
    category: "cakes",
    image: "https://images.unsplash.com/photo-1587668178277-295251f900ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    rating: 4.8,
    reviews: 156,
    isFeatured: true,
    description: "Delicious vanilla cupcakes with cream frosting",
    tags: ["vanilla", "cupcakes", "party"]
  },
  {
    id: 4,
    name: "Traditional Rwandan Cookies",
    price: 2500,
    category: "snacks",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    rating: 4.6,
    reviews: 67,
    isFeatured: true,
    description: "Authentic Rwandan cookies made with local ingredients",
    tags: ["traditional", "cookies", "local"]
  },
  // Add more mock products for demonstration
  ...Array.from({ length: 16 }, (_, i) => ({
    id: i + 5,
    name: `Sample Product ${i + 5}`,
    price: Math.floor(Math.random() * 20000) + 1000,
    category: ["snacks", "cakes", "beverages", "pastries"][Math.floor(Math.random() * 4)],
    image: `https://images.unsplash.com/photo-${1500000000000 + i}?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80`,
    rating: 4 + Math.random(),
    reviews: Math.floor(Math.random() * 200) + 10,
    description: `High-quality product ${i + 5} for your enjoyment`,
    tags: ["quality", "delicious"]
  }))
];

const categories = [
  { id: 'all', name: 'All Products', count: mockProducts.length },
  { id: 'snacks', name: 'Snacks', count: mockProducts.filter(p => p.category === 'snacks').length },
  { id: 'cakes', name: 'Cakes', count: mockProducts.filter(p => p.category === 'cakes').length },
  { id: 'beverages', name: 'Beverages', count: mockProducts.filter(p => p.category === 'beverages').length },
  { id: 'pastries', name: 'Pastries', count: mockProducts.filter(p => p.category === 'pastries').length },
];

const ProductsPage: NextPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState(mockProducts);
  const [loading, setLoading] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(mockProducts.length);
  
  const productsPerPage = 12;

  // Get filters from URL
  const {
    category = 'all',
    minPrice,
    maxPrice,
    rating,
    sort = 'featured',
    page = '1',
    search = '',
  } = router.query;

  // Filter and sort products
  useEffect(() => {
    let filteredProducts = mockProducts;

    // Apply category filter
    if (category !== 'all') {
      filteredProducts = filteredProducts.filter(product => product.category === category);
    }

    // Apply search filter
    if (search) {
      const searchTerm = search.toString().toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Apply price filter
    if (minPrice) {
      filteredProducts = filteredProducts.filter(product => product.price >= parseInt(minPrice.toString()));
    }
    if (maxPrice) {
      filteredProducts = filteredProducts.filter(product => product.price <= parseInt(maxPrice.toString()));
    }

    // Apply rating filter
    if (rating) {
      filteredProducts = filteredProducts.filter(product => product.rating >= parseFloat(rating.toString()));
    }

    // Apply sorting
    switch (sort) {
      case 'price-low':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filteredProducts.sort((a, b) => b.id - a.id);
        break;
      case 'name':
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: // featured
        filteredProducts.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return b.rating - a.rating;
        });
    }

    // Calculate pagination
    const startIndex = (parseInt(page.toString()) - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    setProducts(paginatedProducts);
    setTotalProducts(filteredProducts.length);
    setTotalPages(Math.ceil(filteredProducts.length / productsPerPage));
    setCurrentPage(parseInt(page.toString()));
  }, [category, minPrice, maxPrice, rating, sort, page, search]);

  // Update URL with filters
  const updateFilters = (newFilters: Record<string, string | number | undefined>) => {
    const query = { ...router.query, ...newFilters };
    
    // Remove undefined values
    Object.keys(query).forEach(key => {
      if (query[key] === undefined || query[key] === '') {
        delete query[key];
      }
    });

    // Reset to page 1 when filters change
    if (newFilters.page === undefined) {
      query.page = '1';
    }

    router.push({ pathname: router.pathname, query }, undefined, { shallow: true });
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    ...(category !== 'all' ? [{ label: categories.find(c => c.id === category)?.name || '', href: '' }] : []),
  ];

  const pageTitle = category !== 'all' 
    ? `${categories.find(c => c.id === category)?.name || ''} - Kingdom Snacks`
    : 'All Products - Kingdom Snacks';

  const pageDescription = category !== 'all'
    ? `Shop our selection of ${category} at Kingdom Snacks. Fresh, high-quality products delivered to your door in Rwanda.`
    : 'Browse all our fresh snacks, cakes, and treats at Kingdom Snacks. Premium quality products delivered fresh in Rwanda.';

  return (
    <Layout title={pageTitle} description={pageDescription}>
      <Head>
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://kingdomsnacks.rw/products${category !== 'all' ? `?category=${category}` : ''}`} />
      </Head>

      <div className="container-primary py-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="section-title mb-2">
              {category !== 'all' ? categories.find(c => c.id === category)?.name : 'All Products'}
            </h1>
            <p className="text-gray-600">
              {search ? `Search results for "${search}"` : 'Discover our fresh snacks and delicious cakes'}
              {totalProducts > 0 && (
                <span className="ml-2 text-sm">
                  ({totalProducts} product{totalProducts !== 1 ? 's' : ''})
                </span>
              )}
            </p>
          </div>

          {/* Desktop Sort */}
          <div className="hidden lg:flex items-center space-x-4 mt-4 lg:mt-0">
            <ProductSort
              currentSort={sort.toString()}
              onSortChange={(newSort) => updateFilters({ sort: newSort })}
            />
            <button
              onClick={() => setIsFiltersOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FunnelIcon className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="lg:hidden flex items-center justify-between mb-6">
          <button
            onClick={() => setIsFiltersOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FunnelIcon className="w-4 h-4" />
            <span>Filters</span>
          </button>
          
          <ProductSort
            currentSort={sort.toString()}
            onSortChange={(newSort) => updateFilters({ sort: newSort })}
            isMobile
          />
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <ProductFilters
              categories={categories}
              selectedCategory={category.toString()}
              minPrice={minPrice?.toString()}
              maxPrice={maxPrice?.toString()}
              selectedRating={rating?.toString()}
              onFiltersChange={updateFilters}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : products.length === 0 ? (
              <EmptyState
                title="No products found"
                description="Try adjusting your filters or search terms"
                action={{
                  label: "Clear filters",
                  onClick: () => router.push('/products')
                }}
              />
            ) : (
              <>
                {/* Products Grid */}
                <motion.div
                  className="product-grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <AnimatePresence mode="popLayout">
                    {products.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={(page) => updateFilters({ page: page.toString() })}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      <AnimatePresence>
        {isFiltersOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setIsFiltersOpen(false)}
            />
            
            {/* Modal */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween' }}
              className="absolute left-0 top-0 bottom-0 w-80 max-w-full bg-white shadow-xl overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button
                    onClick={() => setIsFiltersOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>

                <ProductFilters
                  categories={categories}
                  selectedCategory={category.toString()}
                  minPrice={minPrice?.toString()}
                  maxPrice={maxPrice?.toString()}
                  selectedRating={rating?.toString()}
                  onFiltersChange={(filters) => {
                    updateFilters(filters);
                    setIsFiltersOpen(false);
                  }}
                  isMobile
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default ProductsPage;