# Eden Royal Prints and Color Solutions Website

A modern, fully responsive, professional website for a Kenyan business offering digital printing, branding, design, repair, and cyber services.

## 🌟 Features

### **Pages & Functionality**
- **Homepage**: Hero section, services preview, testimonials, gallery preview
- **About**: Company history, mission, vision, values, team showcase
- **Services**: 6 organized service categories with detailed listings
- **Gallery**: Project showcase with lightbox and filtering
- **Contact**: Contact form, business hours, map, FAQ
- **Order**: Comprehensive order form with file upload

### **Design & UX**
- ✅ Fully responsive design (mobile, tablet, desktop)
- ✅ Modern royal blue and gold color palette
- ✅ Smooth animations and transitions
- ✅ Professional typography (Poppins font)
- ✅ Intuitive navigation with mobile menu
- ✅ Fast loading and optimized performance

### **Technical Features**
- ✅ SEO optimized with proper meta tags
- ✅ Form validation (HTML5 + JavaScript)
- ✅ File upload capability (up to 10MB)
- ✅ Gallery lightbox with filtering
- ✅ WhatsApp integration
- ✅ Contact form with auto-reply
- ✅ Order tracking system
- ✅ Rate limiting for security

### **Service Categories**
1. **🎨 Design & Printing**: T-shirts, business cards, posters, branding
2. **🏛️ Government Services**: eCitizen, TIMS, TSC, NTSA assistance
3. **💻 ICT & Academic**: KUCCPS, CV writing, plagiarism detection
4. **🔧 Technical & Repair**: PC/laptop repairs, software installation
5. **📷 Digital Services**: Photography, scanning, photo editing
6. **🌐 Cyber Services**: Typing, proofreading, social media setup

## 📁 Project Structure

```
eden-royal-prints/
├── index.html              # Homepage
├── about.html              # About page
├── services.html           # Services page
├── gallery.html            # Gallery page
├── contact.html            # Contact page
├── order.html              # Order page
├── style/
│   └── main.css            # Main stylesheet
├── js/
│   └── main.js             # JavaScript functionality
├── php/
│   ├── contact.php         # Contact form handler
│   └── order.php           # Order form handler
├── assets/
│   ├── images/             # Images and photos
│   ├── gallery/            # Gallery images
│   └── icons/              # Icons and favicon
├── uploads/                # File uploads (created automatically)
├── data/                   # Order data storage
└── logs/                   # System logs
```

## 🚀 Setup Instructions

### **Prerequisites**
- Web server with PHP support (Apache/Nginx)
- PHP 7.4 or higher
- Write permissions for uploads and data directories

### **Installation**

1. **Download/Clone the project**
   ```bash
   git clone <repository-url>
   cd eden-royal-prints
   ```

2. **Set up web server**
   - Copy files to your web server document root
   - Ensure PHP is enabled

3. **Configure permissions**
   ```bash
   chmod 755 php/
   chmod 777 uploads/ data/ logs/
   ```

4. **Update configuration**
   - Edit `php/contact.php` and `php/order.php`
   - Update email addresses:
     ```php
     $to_email = 'info@yourdomain.com';
     $from_email = 'noreply@yourdomain.com';
     ```

5. **Update contact information**
   - Replace placeholder contact details in all HTML files
   - Update phone numbers, addresses, and social media links
   - Replace sample images with actual company photos

### **Email Configuration**

For production use, configure proper email sending:

1. **SMTP Setup** (recommended):
   ```php
   // Use PHPMailer or similar library
   // Configure SMTP settings for reliable email delivery
   ```

2. **Test email functionality**:
   ```bash
   # Test contact form
   curl -X POST -F "name=Test" -F "email=test@example.com" \
        -F "subject=printing" -F "message=Test message" \
        http://yoursite.com/php/contact.php
   ```

## 🎨 Customization

### **Colors**
Update CSS variables in `style/main.css`:
```css
:root {
    --royal-blue: #1e40af;
    --gold: #f59e0b;
    /* Modify as needed */
}
```

### **Content**
- Update service listings in `services.html`
- Replace gallery images in `gallery.html`
- Modify testimonials in `index.html`
- Update company information in `about.html`

### **Branding**
- Replace logo text in navigation
- Update favicon in `assets/icons/`
- Modify hero section content
- Update footer information

## 📱 Mobile Optimization

The website is fully responsive and optimized for:
- **Mobile phones** (320px - 768px)
- **Tablets** (768px - 1024px)
- **Desktop** (1024px+)

Key mobile features:
- Touch-friendly navigation
- Optimized images and loading
- Mobile-first CSS approach
- Fast WhatsApp integration

## 🔒 Security Features

- Form validation and sanitization
- File upload restrictions
- Rate limiting for forms
- XSS protection
- CSRF considerations
- Input filtering

## 📈 SEO Optimization

- Semantic HTML structure
- Proper heading hierarchy
- Meta descriptions and keywords
- Open Graph tags
- Schema.org markup
- Image alt attributes
- Fast loading times

## 🛠️ Maintenance

### **Regular Tasks**
- Monitor form submissions in `data/orders/`
- Check logs in `logs/` directory
- Update contact information as needed
- Backup uploaded files
- Monitor disk space usage

### **Updates**
- Test forms monthly
- Update service listings quarterly
- Refresh gallery images regularly
- Review and update pricing

## 📊 Analytics & Tracking

To add analytics:
1. **Google Analytics**:
   ```html
   <!-- Add to <head> section of all pages -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
   ```

2. **Facebook Pixel**:
   ```html
   <!-- Add Facebook Pixel code for social media tracking -->
   ```

## 🌐 Deployment

### **Shared Hosting**
1. Upload files via FTP/cPanel
2. Set folder permissions
3. Test functionality
4. Configure email settings

### **VPS/Dedicated Server**
1. Set up web server (Apache/Nginx)
2. Configure PHP and modules
3. Set up SSL certificate
4. Configure email server
5. Set up backups

### **Domain Configuration**
- Point domain to hosting
- Set up SSL certificate
- Configure email addresses
- Test all functionality

## 📞 Support

For technical support or customization:
- Check logs in `logs/` directory
- Verify file permissions
- Test email configuration
- Review error messages

## 📄 License

This project is created for Eden Royal Prints and Color Solutions. All rights reserved.

## 🙏 Credits

- **Design**: Modern responsive design with royal theme
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Google Fonts (Poppins)
- **Images**: Unsplash (replace with actual photos)

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Built with**: HTML5, CSS3, JavaScript, PHP