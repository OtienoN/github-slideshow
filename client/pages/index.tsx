import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBagIcon, 
  StarIcon, 
  TruckIcon, 
  HeartIcon,
  GiftIcon,
  SparklesIcon,
  MapPinIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// Components (we'll create these)
import Layout from '../components/Layout/Layout';
import ProductCard from '../components/Product/ProductCard';
import TestimonialCard from '../components/Testimonial/TestimonialCard';
import NewsletterSignup from '../components/Newsletter/NewsletterSignup';

// Sample data (this would come from API)
const heroSlides = [
  {
    id: 1,
    title: "Fresh Baked Daily",
    subtitle: "Experience Rwanda's Finest Snacks & Cakes",
    description: "Handcrafted with love in Musanze, delivered fresh to your doorstep",
    image: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    cta: "Order Now",
    ctaLink: "/products"
  },
  {
    id: 2,
    title: "Birthday Cakes",
    subtitle: "Make Every Celebration Special",
    description: "Custom birthday cakes designed to make your special day unforgettable",
    image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    cta: "Browse Cakes",
    ctaLink: "/products?category=cakes"
  },
  {
    id: 3,
    title: "Premium Snacks",
    subtitle: "Satisfy Your Cravings",
    description: "From traditional Rwandan treats to international favorites",
    image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    cta: "View Snacks",
    ctaLink: "/products?category=snacks"
  }
];

const featuredProducts = [
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
    isOnSale: true
  },
  {
    id: 2,
    name: "Mixed Nuts Pack",
    price: 3500,
    category: "snacks",
    image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    rating: 4.7,
    reviews: 89,
    isFeatured: true
  },
  {
    id: 3,
    name: "Vanilla Cupcakes (6-pack)",
    price: 8000,
    category: "cakes",
    image: "https://images.unsplash.com/photo-1587668178277-295251f900ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    rating: 4.8,
    reviews: 156,
    isFeatured: true
  },
  {
    id: 4,
    name: "Traditional Rwandan Cookies",
    price: 2500,
    category: "snacks",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    rating: 4.6,
    reviews: 67,
    isFeatured: true
  }
];

const testimonials = [
  {
    id: 1,
    name: "Marie Uwimana",
    location: "Musanze",
    rating: 5,
    comment: "The best cakes in Rwanda! My daughter's birthday cake was absolutely perfect. Fresh, delicious, and beautifully decorated.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
  },
  {
    id: 2,
    name: "Jean Baptiste",
    location: "Kigali",
    rating: 5,
    comment: "Fast delivery and amazing quality! The snacks are always fresh and the prices are very reasonable. Highly recommended!",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
  },
  {
    id: 3,
    name: "Grace Mukamana",
    location: "Ruhengeri",
    rating: 5,
    comment: "Kingdom Snacks saved my party! Last-minute order and they delivered exactly on time with the most delicious treats.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
  }
];

const Home: NextPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <Layout>
      <Head>
        <title>Kingdom Snacks - Fresh Snacks & Cakes in Musanze, Rwanda</title>
        <meta 
          name="description" 
          content="Order fresh snacks and custom cakes from Kingdom Snacks in Musanze, Rwanda. Fast delivery, premium quality, and affordable prices. Experience Rwanda's finest treats!" 
        />
        <meta name="keywords" content="snacks, cakes, Rwanda, Musanze, Kigali, delivery, fresh, premium, birthday cakes, treats" />
        <meta property="og:title" content="Kingdom Snacks - Fresh Snacks & Cakes in Rwanda" />
        <meta property="og:description" content="Order fresh snacks and custom cakes from Kingdom Snacks in Musanze, Rwanda." />
        <meta property="og:image" content="/images/kingdom-snacks-og.jpg" />
        <meta property="og:url" content="https://kingdomsnacks.rw" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://kingdomsnacks.rw" />
      </Head>

      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          spaceBetween={0}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          effect="fade"
          loop
          onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
          className="h-full"
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={slide.id}>
              <div className="relative h-full">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-black bg-opacity-40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white max-w-4xl px-6">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.8 }}
                    >
                      <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 text-gradient">
                        {slide.title}
                      </h1>
                      <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                        {slide.subtitle}
                      </h2>
                      <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
                        {slide.description}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href={slide.ctaLink}>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-primary text-lg px-8 py-4"
                          >
                            <ShoppingBagIcon className="w-5 h-5 mr-2 inline" />
                            {slide.cta}
                          </motion.button>
                        </Link>
                        <Link href="/menu">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-outline text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-gray-900"
                          >
                            View Menu
                          </motion.button>
                        </Link>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Floating Action Button */}
        <div className="absolute bottom-8 right-8 z-10">
          <motion.a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <PhoneIcon className="w-6 h-6" />
          </motion.a>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6"
            >
              Why Choose Kingdom Snacks?
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              We're committed to delivering the finest quality snacks and cakes with exceptional service
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                icon: SparklesIcon,
                title: "Fresh Daily",
                description: "All products made fresh daily with premium ingredients"
              },
              {
                icon: TruckIcon,
                title: "Fast Delivery",
                description: "Quick delivery across Musanze and surrounding areas"
              },
              {
                icon: GiftIcon,
                title: "Custom Orders",
                description: "Personalized cakes and snacks for special occasions"
              },
              {
                icon: HeartIcon,
                title: "Quality Guaranteed",
                description: "100% satisfaction guarantee on all our products"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center p-6 card card-hover"
              >
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6"
            >
              Featured Products
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
            >
              Discover our most popular snacks and cakes, loved by customers across Rwanda
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link href="/products">
                <button className="btn-outline">
                  View All Products
                </button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {featuredProducts.map((product) => (
              <motion.div key={product.id} variants={fadeInUp}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-primary-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
                About Kingdom Snacks
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Located in the heart of Musanze, Kingdom Snacks has been serving Rwanda's finest 
                snacks and cakes since our founding. We believe in using only the freshest ingredients 
                and traditional baking methods to create treats that bring joy to every occasion.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Our commitment to hygiene, quality, and customer satisfaction has made us the 
                preferred choice for celebrations and everyday indulgences across Northern Province.
              </p>
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <MapPinIcon className="w-5 h-5 text-primary-600 mr-2" />
                  <span className="text-gray-700">Musanze, Kigali, Rwanda</span>
                </div>
                <div className="flex items-center">
                  <PhoneIcon className="w-5 h-5 text-primary-600 mr-2" />
                  <span className="text-gray-700">+250 788 123 456</span>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <Image
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Kingdom Snacks Bakery"
                width={800}
                height={600}
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">5+</div>
                  <div className="text-sm text-gray-600">Years Serving</div>
                  <div className="text-sm text-gray-600">Fresh Treats</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6"
            >
              What Our Customers Say
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Don't just take our word for it - hear from our happy customers
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000 }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
              }}
              className="pb-12"
            >
              {testimonials.map((testimonial) => (
                <SwiperSlide key={testimonial.id}>
                  <motion.div variants={fadeInUp}>
                    <TestimonialCard testimonial={testimonial} />
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Stay Updated with Kingdom Snacks
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Subscribe to our newsletter for exclusive offers, new product announcements, 
              and special promotions delivered to your inbox.
            </p>
            <NewsletterSignup />
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Ready to Order?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Experience the taste of Kingdom Snacks today. Fresh, delicious, and delivered to your doorstep.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200"
                >
                  <ShoppingBagIcon className="w-5 h-5 mr-2 inline" />
                  Shop Now
                </motion.button>
              </Link>
              <motion.a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200"
              >
                <PhoneIcon className="w-5 h-5 mr-2 inline" />
                WhatsApp Order
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;