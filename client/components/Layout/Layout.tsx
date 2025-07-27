import React, { ReactNode } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Header from './Header';
import Footer from './Footer';
import WhatsAppFloat from '../UI/WhatsAppFloat';
import CartSidebar from '../Cart/CartSidebar';
import { useCart } from '../../contexts/CartContext';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  noHeader?: boolean;
  noFooter?: boolean;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title = 'Kingdom Snacks - Fresh Snacks & Cakes in Rwanda',
  description = 'Order fresh snacks and custom cakes from Kingdom Snacks in Musanze, Rwanda. Fast delivery, premium quality, and affordable prices.',
  keywords = 'snacks, cakes, Rwanda, Musanze, Kigali, delivery, fresh, premium, birthday cakes, treats',
  ogImage = '/images/kingdom-snacks-og.jpg',
  noHeader = false,
  noFooter = false,
  className = '',
}) => {
  const router = useRouter();
  const { isCartOpen } = useCart();
  
  const isAdminRoute = router.pathname.startsWith('/admin');
  const isAuthRoute = router.pathname.startsWith('/auth');
  
  // Admin and auth routes use their own layouts
  if (isAdminRoute || isAuthRoute) {
    return <>{children}</>;
  }

  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kingdomsnacks.rw'}${router.asPath}`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Kingdom Snacks" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content="Kingdom Snacks" />
        <meta property="og:locale" content="en_RW" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={ogImage} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ff8c00" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: 'Kingdom Snacks',
              description: 'Fresh snacks and custom cakes in Musanze, Rwanda',
              url: 'https://kingdomsnacks.rw',
              telephone: '+250788123456',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Musanze',
                addressLocality: 'Musanze',
                addressRegion: 'Northern Province',
                addressCountry: 'Rwanda',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: -1.4849,
                longitude: 29.6341,
              },
              openingHoursSpecification: [
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                  opens: '07:00',
                  closes: '20:00',
                },
              ],
              servesCuisine: ['Snacks', 'Cakes', 'Pastries'],
              priceRange: '$$',
              image: ogImage,
            }),
          }}
        />
      </Head>

      <div className={`min-h-screen flex flex-col ${className}`}>
        {!noHeader && <Header />}
        
        <main className="flex-1">
          {children}
        </main>
        
        {!noFooter && <Footer />}
        
        {/* Floating Elements */}
        <WhatsAppFloat />
        
        {/* Cart Sidebar */}
        <CartSidebar />
        
        {/* Scroll to Top Button */}
        <ScrollToTopButton />
      </div>
    </>
  );
};

// Scroll to Top Button Component
const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-20 right-4 z-50 bg-primary-500 hover:bg-primary-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
      aria-label="Scroll to top"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
};

export default Layout;