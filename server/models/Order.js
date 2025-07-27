const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  productImage: String,
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  variant: {
    name: String,
    value: String
  },
  specialInstructions: String
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  // Guest order information (if customer not registered)
  guestInfo: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String
  },
  items: [orderItemSchema],
  // Pricing breakdown
  pricing: {
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    discount: {
      type: Number,
      default: 0,
      min: 0
    },
    membershipDiscount: {
      type: Number,
      default: 0,
      min: 0
    },
    couponDiscount: {
      type: Number,
      default: 0,
      min: 0
    },
    tax: {
      type: Number,
      default: 0,
      min: 0
    },
    deliveryFee: {
      type: Number,
      default: 0,
      min: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    }
  },
  // Delivery information
  delivery: {
    type: {
      type: String,
      enum: ['delivery', 'pickup'],
      default: 'delivery'
    },
    address: {
      street: String,
      city: String,
      district: String,
      province: String,
      country: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    instructions: String,
    estimatedDeliveryTime: Date,
    actualDeliveryTime: Date,
    deliveryWindow: {
      start: Date,
      end: Date
    }
  },
  // Order status tracking
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered', 'cancelled', 'refunded'],
    default: 'pending',
    index: true
  },
  statusHistory: [{
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered', 'cancelled', 'refunded']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  // Payment information
  payment: {
    method: {
      type: String,
      enum: ['cash', 'mobile-money', 'card', 'bank-transfer'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
      index: true
    },
    transactionId: String,
    paymentIntentId: String, // For Stripe
    mobileMoneyNumber: String,
    paymentDate: Date,
    failureReason: String
  },
  // Coupon and loyalty information
  coupon: {
    code: String,
    discount: Number,
    type: {
      type: String,
      enum: ['percentage', 'fixed']
    }
  },
  loyaltyPointsEarned: {
    type: Number,
    default: 0,
    min: 0
  },
  loyaltyPointsUsed: {
    type: Number,
    default: 0,
    min: 0
  },
  // Special requests and notes
  notes: String,
  adminNotes: String,
  kitchenNotes: String,
  // Timing
  requestedDeliveryTime: Date,
  preparationTime: {
    type: Number, // in minutes
    default: 30
  },
  // Order source
  source: {
    type: String,
    enum: ['website', 'mobile-app', 'whatsapp', 'phone', 'admin'],
    default: 'website'
  },
  // Customer feedback
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    feedbackDate: Date
  },
  // Cancellation information
  cancellation: {
    reason: String,
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    cancelledAt: Date,
    refundAmount: Number,
    refundStatus: {
      type: String,
      enum: ['pending', 'processed', 'failed'],
      default: 'pending'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ createdAt: -1 });

// Virtual for order age in hours
orderSchema.virtual('ageInHours').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60));
});

// Virtual for estimated total time
orderSchema.virtual('estimatedTotalTime').get(function() {
  const baseTime = this.preparationTime || 30;
  const deliveryTime = this.delivery.type === 'delivery' ? 20 : 0;
  return baseTime + deliveryTime;
});

// Virtual for order display name
orderSchema.virtual('displayName').get(function() {
  if (this.customer) {
    return `${this.customer.firstName} ${this.customer.lastName}`;
  }
  return `${this.guestInfo.firstName} ${this.guestInfo.lastName}`;
});

// Virtual for contact info
orderSchema.virtual('contactInfo').get(function() {
  if (this.customer) {
    return {
      email: this.customer.email,
      phone: this.customer.phone
    };
  }
  return {
    email: this.guestInfo.email,
    phone: this.guestInfo.phone
  };
});

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Find the last order of the day
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    
    const lastOrder = await this.constructor.findOne({
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ createdAt: -1 });
    
    let sequence = 1;
    if (lastOrder && lastOrder.orderNumber) {
      const lastSequence = parseInt(lastOrder.orderNumber.slice(-3));
      sequence = lastSequence + 1;
    }
    
    this.orderNumber = `KS${year}${month}${day}${sequence.toString().padStart(3, '0')}`;
  }
  next();
});

// Pre-save middleware to add status history
orderSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      note: `Status changed to ${this.status}`
    });
  }
  next();
});

// Pre-save middleware to calculate loyalty points
orderSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('pricing.total')) {
    // Earn 1 point per 100 RWF spent
    this.loyaltyPointsEarned = Math.floor(this.pricing.total / 100);
  }
  next();
});

// Instance method to update status
orderSchema.methods.updateStatus = function(newStatus, note = '', updatedBy = null) {
  const oldStatus = this.status;
  this.status = newStatus;
  
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    note: note || `Status changed from ${oldStatus} to ${newStatus}`,
    updatedBy: updatedBy
  });
  
  // Update delivery time if delivered
  if (newStatus === 'delivered' && !this.delivery.actualDeliveryTime) {
    this.delivery.actualDeliveryTime = new Date();
  }
  
  return this;
};

// Instance method to cancel order
orderSchema.methods.cancelOrder = function(reason, cancelledBy) {
  this.status = 'cancelled';
  this.cancellation = {
    reason: reason,
    cancelledBy: cancelledBy,
    cancelledAt: new Date(),
    refundAmount: this.payment.status === 'paid' ? this.pricing.total : 0,
    refundStatus: this.payment.status === 'paid' ? 'pending' : undefined
  };
  
  this.statusHistory.push({
    status: 'cancelled',
    timestamp: new Date(),
    note: `Order cancelled: ${reason}`,
    updatedBy: cancelledBy
  });
  
  return this;
};

// Instance method to calculate total items
orderSchema.methods.getTotalItems = function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
};

// Instance method to check if order can be cancelled
orderSchema.methods.canBeCancelled = function() {
  const nonCancellableStatuses = ['delivered', 'cancelled', 'refunded'];
  return !nonCancellableStatuses.includes(this.status);
};

// Instance method to check if order can be modified
orderSchema.methods.canBeModified = function() {
  const nonModifiableStatuses = ['preparing', 'ready', 'out-for-delivery', 'delivered', 'cancelled', 'refunded'];
  return !nonModifiableStatuses.includes(this.status);
};

// Static method to get orders by status
orderSchema.statics.getOrdersByStatus = function(status, limit = 50) {
  return this.find({ status })
    .populate('customer', 'firstName lastName phone email')
    .populate('items.product', 'name category')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get customer order history
orderSchema.statics.getCustomerOrders = function(customerId, limit = 20) {
  return this.find({ customer: customerId })
    .populate('items.product', 'name category images')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get daily sales summary
orderSchema.statics.getDailySalesSummary = function(date = new Date()) {
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const endOfDay = new Date(date.setHours(23, 59, 59, 999));
  
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfDay, $lte: endOfDay },
        status: { $nin: ['cancelled', 'refunded'] }
      }
    },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$pricing.total' },
        averageOrderValue: { $avg: '$pricing.total' },
        deliveryOrders: {
          $sum: { $cond: [{ $eq: ['$delivery.type', 'delivery'] }, 1, 0] }
        },
        pickupOrders: {
          $sum: { $cond: [{ $eq: ['$delivery.type', 'pickup'] }, 1, 0] }
        }
      }
    }
  ]);
};

// Static method to get revenue by date range
orderSchema.statics.getRevenueByDateRange = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        status: { $nin: ['cancelled', 'refunded'] }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        },
        revenue: { $sum: '$pricing.total' },
        orders: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
    }
  ]);
};

module.exports = mongoose.model('Order', orderSchema);