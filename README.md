# 🏰 Kingdom Snacks - E-commerce Platform

## 📖 Overview

Kingdom Snacks is a comprehensive full-stack e-commerce platform built for a snacks and cakes business located in Musanze, Kigali, Rwanda. The platform features modern web technologies, robust security measures, and a beautiful user interface designed to provide an exceptional shopping experience.

## ✨ Features

### 🔐 Authentication & Security
- **JWT-based authentication** with refresh tokens
- **Role-based access control** (Customer, Admin, Super Admin)
- **Password hashing** with bcrypt (12 rounds)
- **Account lockout** after failed login attempts
- **Email verification** and password reset
- **Two-factor authentication** ready structure
- **Rate limiting** to prevent abuse
- **OWASP security standards** implementation

### 👥 User Management
- **User registration and login**
- **Membership tiers** (Bronze, Silver, Gold, Platinum)
- **Loyalty points system**
- **Birthday rewards program**
- **User profile management**
- **Address book management**
- **Order history tracking**

### 🛍️ E-commerce Features
- **Product catalog** with categories and filtering
- **Shopping cart** with session persistence
- **Order management** system
- **Payment integration** (Stripe ready)
- **Inventory management**
- **Product variants** support
- **Discount and coupon** system
- **Wishlist functionality**

### 📦 Order Management
- **Order tracking** with status updates
- **Delivery management**
- **Order confirmation emails**
- **WhatsApp integration** for orders
- **Admin order dashboard**
- **Automated order numbering**
- **Order analytics**

### 🎨 Frontend Features
- **Responsive design** with Tailwind CSS
- **Modern UI/UX** with Framer Motion animations
- **PWA support** for mobile app-like experience
- **Image optimization** with Next.js
- **SEO optimization**
- **Newsletter subscription**
- **Customer testimonials**
- **Product gallery**

### 🔧 Admin Panel
- **Product management** (CRUD operations)
- **Order management** and tracking
- **User management**
- **Sales analytics** and reporting
- **Inventory tracking**
- **Content management**
- **Email templates management**

## 🏗️ Technical Architecture

### Backend (Node.js/Express)
```
server/
├── index.js              # Main server entry point
├── models/               # MongoDB models
│   ├── User.js          # User model with auth & loyalty
│   ├── Product.js       # Product model with variants
│   ├── Order.js         # Order management model
│   └── Review.js        # Product reviews model
├── routes/              # API routes
│   ├── auth.js          # Authentication routes
│   ├── users.js         # User management
│   ├── products.js      # Product operations
│   ├── orders.js        # Order management
│   ├── admin.js         # Admin operations
│   └── contact.js       # Contact forms
├── middleware/          # Custom middleware
│   ├── auth.js          # Authentication middleware
│   ├── errorHandler.js  # Error handling
│   └── validation.js    # Input validation
├── utils/               # Utility functions
│   ├── logger.js        # Winston logging
│   ├── sendEmail.js     # Email service
│   └── cloudinary.js    # Image upload service
└── config/              # Configuration files
```

### Frontend (Next.js/React)
```
client/
├── pages/               # Next.js pages
│   ├── index.tsx        # Homepage
│   ├── products/        # Product pages
│   ├── auth/            # Authentication pages
│   ├── account/         # User dashboard
│   ├── admin/           # Admin panel
│   └── api/             # API routes (optional proxy)
├── components/          # Reusable components
│   ├── Layout/          # Layout components
│   ├── Product/         # Product components
│   ├── Auth/            # Authentication forms
│   ├── Cart/            # Shopping cart
│   └── Admin/           # Admin components
├── hooks/               # Custom React hooks
├── store/               # State management (Zustand)
├── utils/               # Utility functions
├── styles/              # Global styles
└── public/              # Static assets
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB 5.0+
- Cloudinary account (for image uploads)
- Stripe account (for payments)
- Gmail account (for emails)

### 1. Clone the Repository
```bash
git clone https://github.com/your-repo/kingdom-snacks.git
cd kingdom-snacks
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install all dependencies (client + server)
npm run install:all
```

### 3. Environment Setup

#### Server Environment (.env)
```bash
cd server
cp .env.example .env
```

Edit `server/.env` with your configuration:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/kingdom_snacks

# JWT Secrets (generate strong random strings)
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
JWT_REFRESH_SECRET=your_super_secret_refresh_jwt_key_min_32_characters

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@kingdomsnacks.rw

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Stripe (for payments)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Admin Configuration
ADMIN_EMAIL=admin@kingdomsnacks.rw
ADMIN_PASSWORD=Admin@123456
```

#### Client Environment
```bash
cd client
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
echo "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key" >> .env.local
echo "NEXT_PUBLIC_WHATSAPP_PHONE=+250788123456" >> .env.local
```

### 4. Database Setup
```bash
# Start MongoDB service
sudo systemctl start mongod

# The application will automatically create collections on first run
```

### 5. Run the Application
```bash
# Development mode (runs both client and server)
npm run dev

# Or run separately:
npm run server:dev  # Backend on http://localhost:5000
npm run client:dev  # Frontend on http://localhost:3000
```

### 6. Access the Application
- **Homepage**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **API Health**: http://localhost:5000/api/health

## 📱 Progressive Web App (PWA)

Kingdom Snacks includes PWA features:
- **Offline support**
- **Add to home screen**
- **Push notifications** (ready structure)
- **App-like experience** on mobile devices

## 🎨 Design System

### Brand Colors
- **Primary Orange**: `#ff8c00` - Main brand color
- **Secondary Cream**: `#e89c74` - Complementary warm tone
- **Accent Brown**: `#a67c69` - Supporting color for text/backgrounds

### Typography
- **Display Font**: Poppins (headings and hero text)
- **Body Font**: Inter (readable body text)
- **Mono Font**: JetBrains Mono (code and technical text)

### Components
The design system includes pre-built components:
- Buttons (primary, secondary, outline)
- Cards with hover effects
- Form inputs with validation states
- Loading states and animations

## 🔒 Security Features

### Authentication Security
- **Password requirements**: 8+ chars with mixed case, numbers, symbols
- **Account lockout**: 5 failed attempts = 2-hour lock
- **Session management**: Secure JWT with refresh tokens
- **Email verification**: Required for account activation

### API Security
- **Rate limiting**: 100 requests per 15 minutes (general), 5 per 15 minutes (auth)
- **Input sanitization**: XSS and NoSQL injection prevention
- **CORS protection**: Restricted origins
- **Helmet.js**: Security headers
- **Data validation**: Comprehensive input validation

### Database Security
- **Parameterized queries**: MongoDB injection prevention
- **Password hashing**: bcrypt with 12 rounds
- **Sensitive data**: Excluded from API responses
- **Audit logging**: Comprehensive activity tracking

## 📊 Analytics & Monitoring

### Logging
- **Winston logging** with different levels
- **Request/response logging**
- **Error tracking** with stack traces
- **Security event logging**
- **Performance monitoring**

### Metrics
- **Order analytics**: Revenue, popular products, customer behavior
- **User analytics**: Registration trends, engagement metrics
- **Performance metrics**: Response times, error rates

## 🚀 Deployment

### Production Build
```bash
# Build both client and server
npm run build

# Start production server
npm start
```

### Docker Deployment (Optional)
```dockerfile
# Dockerfile example for production deployment
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000
CMD ["npm", "start"]
```

### Environment Variables for Production
Ensure all environment variables are properly set for production:
- Use strong, unique JWT secrets
- Configure proper CORS origins
- Set up production database
- Configure email service
- Set up image storage (Cloudinary)
- Configure payment processor (Stripe)

## 🤝 Contributing

### Development Guidelines
1. **Code Style**: Follow ESLint and Prettier configurations
2. **Commits**: Use conventional commit messages
3. **Testing**: Write tests for new features
4. **Documentation**: Update README for new features

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add your feature description"

# Push and create pull request
git push origin feature/your-feature-name
```

## 📞 Support & Contact

### Business Information
- **Business Name**: Kingdom Snacks
- **Location**: Musanze, Kigali, Rwanda
- **Phone**: +250 788 123 456
- **Email**: info@kingdomsnacks.rw

### Technical Support
- **Documentation**: See this README and inline comments
- **Issues**: Create GitHub issues for bugs
- **Features**: Submit feature requests via GitHub

## 📄 License

This project is proprietary software developed for Kingdom Snacks. All rights reserved.

---

## 🙏 Acknowledgments

- **Next.js** team for the amazing React framework
- **Tailwind CSS** for the utility-first CSS framework
- **Framer Motion** for smooth animations
- **MongoDB** for the flexible database solution
- **Stripe** for secure payment processing

---

**Built with ❤️ for Kingdom Snacks - Rwanda's Finest Treats!** 🇷🇼
