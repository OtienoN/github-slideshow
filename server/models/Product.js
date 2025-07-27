const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters'],
    index: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    index: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['snacks', 'cakes', 'beverages', 'pastries', 'seasonal'],
    index: true
  },
  subcategory: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  comparePrice: {
    type: Number,
    min: [0, 'Compare price cannot be negative']
  },
  cost: {
    type: Number,
    min: [0, 'Cost cannot be negative'],
    select: false // Hide from public queries
  },
  // Inventory Management
  inventory: {
    quantity: {
      type: Number,
      required: [true, 'Inventory quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0
    },
    trackQuantity: {
      type: Boolean,
      default: true
    },
    continueSellingWhenOutOfStock: {
      type: Boolean,
      default: false
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
      min: 0
    }
  },
  // Images
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    isPrimary: {
      type: Boolean,
      default: false
    },
    publicId: String // For Cloudinary
  }],
  // Product specifications
  specifications: {
    weight: {
      value: Number,
      unit: {
        type: String,
        enum: ['g', 'kg', 'ml', 'l'],
        default: 'g'
      }
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: {
        type: String,
        enum: ['cm', 'mm', 'in'],
        default: 'cm'
      }
    },
    ingredients: [String],
    allergens: [String],
    nutritionalInfo: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
      sugar: Number,
      sodium: Number
    },
    shelfLife: {
      value: Number,
      unit: {
        type: String,
        enum: ['hours', 'days', 'weeks', 'months'],
        default: 'days'
      }
    },
    storageInstructions: String
  },
  // Status and visibility
  status: {
    type: String,
    enum: ['active', 'inactive', 'discontinued'],
    default: 'active',
    index: true
  },
  isVisible: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  },
  isOnSale: {
    type: Boolean,
    default: false,
    index: true
  },
  // Dates
  availableFrom: {
    type: Date,
    default: Date.now
  },
  availableUntil: Date,
  // SEO and Marketing
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  tags: [String],
  // Ratings and Reviews
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  // Sales metrics
  salesMetrics: {
    totalSold: {
      type: Number,
      default: 0,
      min: 0
    },
    totalRevenue: {
      type: Number,
      default: 0,
      min: 0
    },
    viewCount: {
      type: Number,
      default: 0,
      min: 0
    },
    addToCartCount: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  // Vendor/Admin information
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Variants (for products with different sizes, flavors, etc.)
  variants: [{
    name: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    price: Number,
    inventory: {
      quantity: Number,
      sku: String
    },
    image: String
  }],
  // Related products
  relatedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  // Discounts
  discounts: [{
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true
    },
    value: {
      type: Number,
      required: true,
      min: 0
    },
    membershipTier: {
      type: String,
      enum: ['bronze', 'silver', 'gold', 'platinum']
    },
    validFrom: {
      type: Date,
      default: Date.now
    },
    validUntil: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  // Custom fields for specific product types
  customFields: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ 'ratings.average': -1 });
productSchema.index({ isFeatured: 1, status: 1 });
productSchema.index({ isOnSale: 1, status: 1 });

// Virtual for primary image
productSchema.virtual('primaryImage').get(function() {
  const primaryImg = this.images.find(img => img.isPrimary);
  return primaryImg || this.images[0];
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
  if (!this.inventory.trackQuantity) return 'in-stock';
  if (this.inventory.quantity <= 0) return 'out-of-stock';
  if (this.inventory.quantity <= this.inventory.lowStockThreshold) return 'low-stock';
  return 'in-stock';
});

// Virtual for final price (considering discounts)
productSchema.virtual('finalPrice').get(function() {
  // This would typically be calculated based on user's membership tier
  // For now, return the base price
  return this.price;
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (!this.comparePrice || this.comparePrice <= this.price) return 0;
  return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
});

// Virtual for availability status
productSchema.virtual('isAvailable').get(function() {
  const now = new Date();
  const isDateAvailable = this.availableFrom <= now && 
    (!this.availableUntil || this.availableUntil >= now);
  const isInStock = !this.inventory.trackQuantity || 
    this.inventory.quantity > 0 || 
    this.inventory.continueSellingWhenOutOfStock;
  
  return this.status === 'active' && this.isVisible && isDateAvailable && isInStock;
});

// Pre-save middleware to generate slug
productSchema.pre('save', function(next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
    
    // Add timestamp if slug might not be unique
    if (this.isNew) {
      this.slug += '-' + Date.now();
    }
  }
  next();
});

// Pre-save middleware to update SEO fields
productSchema.pre('save', function(next) {
  if (!this.seo.title) {
    this.seo.title = this.name;
  }
  if (!this.seo.description) {
    this.seo.description = this.shortDescription || this.description.substring(0, 160);
  }
  next();
});

// Pre-save middleware to ensure one primary image
productSchema.pre('save', function(next) {
  if (this.images && this.images.length > 0) {
    const primaryImages = this.images.filter(img => img.isPrimary);
    
    if (primaryImages.length === 0) {
      // Set first image as primary if none selected
      this.images[0].isPrimary = true;
    } else if (primaryImages.length > 1) {
      // Ensure only one primary image
      this.images.forEach((img, index) => {
        img.isPrimary = index === 0;
      });
    }
  }
  next();
});

// Instance method to calculate price for specific membership tier
productSchema.methods.getPriceForMembershipTier = function(membershipTier) {
  let finalPrice = this.price;
  
  // Apply membership discounts
  const applicableDiscounts = this.discounts.filter(discount => 
    discount.isActive &&
    (!discount.membershipTier || discount.membershipTier === membershipTier) &&
    discount.validFrom <= new Date() &&
    (!discount.validUntil || discount.validUntil >= new Date())
  );
  
  // Apply the best discount
  if (applicableDiscounts.length > 0) {
    const bestDiscount = applicableDiscounts.reduce((best, current) => {
      const currentValue = current.type === 'percentage' 
        ? (finalPrice * current.value / 100)
        : current.value;
      const bestValue = best.type === 'percentage'
        ? (finalPrice * best.value / 100)
        : best.value;
      
      return currentValue > bestValue ? current : best;
    });
    
    if (bestDiscount.type === 'percentage') {
      finalPrice = finalPrice * (1 - bestDiscount.value / 100);
    } else {
      finalPrice = Math.max(0, finalPrice - bestDiscount.value);
    }
  }
  
  return Math.round(finalPrice);
};

// Instance method to update stock
productSchema.methods.updateStock = function(quantity, operation = 'subtract') {
  if (!this.inventory.trackQuantity) return this;
  
  if (operation === 'subtract') {
    this.inventory.quantity = Math.max(0, this.inventory.quantity - quantity);
  } else if (operation === 'add') {
    this.inventory.quantity += quantity;
  }
  
  return this;
};

// Instance method to add review rating
productSchema.methods.addRating = function(rating) {
  const currentTotal = this.ratings.average * this.ratings.count;
  this.ratings.count += 1;
  this.ratings.average = (currentTotal + rating) / this.ratings.count;
  this.ratings.average = Math.round(this.ratings.average * 10) / 10; // Round to 1 decimal
  
  return this;
};

// Static method to get featured products
productSchema.statics.getFeatured = function(limit = 8) {
  return this.find({
    isFeatured: true,
    status: 'active',
    isVisible: true
  })
  .limit(limit)
  .sort({ createdAt: -1 });
};

// Static method to get products on sale
productSchema.statics.getOnSale = function(limit = 12) {
  return this.find({
    isOnSale: true,
    status: 'active',
    isVisible: true
  })
  .limit(limit)
  .sort({ createdAt: -1 });
};

// Static method to search products
productSchema.statics.searchProducts = function(query, options = {}) {
  const {
    category,
    minPrice,
    maxPrice,
    sortBy = 'relevance',
    limit = 20,
    skip = 0
  } = options;
  
  const searchQuery = {
    status: 'active',
    isVisible: true,
    $text: { $search: query }
  };
  
  if (category) searchQuery.category = category;
  if (minPrice || maxPrice) {
    searchQuery.price = {};
    if (minPrice) searchQuery.price.$gte = minPrice;
    if (maxPrice) searchQuery.price.$lte = maxPrice;
  }
  
  let sort = {};
  switch (sortBy) {
    case 'price-low':
      sort = { price: 1 };
      break;
    case 'price-high':
      sort = { price: -1 };
      break;
    case 'newest':
      sort = { createdAt: -1 };
      break;
    case 'rating':
      sort = { 'ratings.average': -1 };
      break;
    case 'popular':
      sort = { 'salesMetrics.totalSold': -1 };
      break;
    default:
      sort = { score: { $meta: 'textScore' } };
  }
  
  return this.find(searchQuery)
    .sort(sort)
    .limit(limit)
    .skip(skip);
};

module.exports = mongoose.model('Product', productSchema);