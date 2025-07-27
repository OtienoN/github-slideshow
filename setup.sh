#!/bin/bash

# Kingdom Snacks E-commerce Platform Setup Script
# This script helps you set up the development environment

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check Node.js version
check_node_version() {
    if command_exists node; then
        NODE_VERSION=$(node --version | cut -d'v' -f2)
        REQUIRED_VERSION="18.0.0"
        if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" = "$REQUIRED_VERSION" ]; then
            print_success "Node.js $NODE_VERSION is installed and meets requirements"
            return 0
        else
            print_error "Node.js $NODE_VERSION is installed but version 18+ is required"
            return 1
        fi
    else
        print_error "Node.js is not installed"
        return 1
    fi
}

# Function to check MongoDB
check_mongodb() {
    if command_exists mongod; then
        print_success "MongoDB is installed"
        return 0
    elif command_exists mongo; then
        print_success "MongoDB client is installed"
        return 0
    else
        print_warning "MongoDB is not installed or not in PATH"
        return 1
    fi
}

# Function to generate random string
generate_random_string() {
    length=${1:-32}
    openssl rand -hex $length 2>/dev/null || cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w $length | head -n 1
}

# Main setup function
main() {
    echo "🏰 Kingdom Snacks E-commerce Platform Setup"
    echo "============================================"
    echo ""

    # Check system requirements
    print_status "Checking system requirements..."
    
    # Check Node.js
    if ! check_node_version; then
        print_error "Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi

    # Check npm
    if ! command_exists npm; then
        print_error "npm is not installed. Please install Node.js with npm."
        exit 1
    fi

    # Check Git
    if ! command_exists git; then
        print_error "Git is not installed. Please install Git."
        exit 1
    fi

    # Check MongoDB (optional)
    if ! check_mongodb; then
        print_warning "MongoDB not found. You'll need to install and configure MongoDB."
        print_status "Visit: https://docs.mongodb.com/manual/installation/"
    fi

    echo ""
    print_status "Installing dependencies..."

    # Install root dependencies
    print_status "Installing root dependencies..."
    npm install

    # Install client dependencies
    print_status "Installing client dependencies..."
    cd client
    npm install
    cd ..

    # Install server dependencies
    print_status "Installing server dependencies..."
    cd server
    npm install
    cd ..

    print_success "All dependencies installed!"

    echo ""
    print_status "Setting up environment files..."

    # Setup server environment
    if [ ! -f "server/.env" ]; then
        print_status "Creating server environment file..."
        
        # Generate JWT secrets
        JWT_SECRET=$(generate_random_string 32)
        JWT_REFRESH_SECRET=$(generate_random_string 32)
        
        cat > server/.env << EOL
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/kingdom_snacks
DB_PASSWORD=

# JWT Configuration
JWT_SECRET=$JWT_SECRET
JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Email Configuration (Update with your credentials)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@kingdomsnacks.rw

# Cloudinary Configuration (Update with your credentials)
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Stripe Configuration (Update with your credentials)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# WhatsApp API
WHATSAPP_API_URL=https://api.whatsapp.com/send
WHATSAPP_PHONE=+250788123456

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Admin Configuration
ADMIN_EMAIL=admin@kingdomsnacks.rw
ADMIN_PASSWORD=Admin@123456
EOL
        print_success "Server environment file created at server/.env"
        print_warning "Please update the environment variables with your actual credentials!"
    else
        print_warning "Server environment file already exists. Skipping..."
    fi

    # Setup client environment
    if [ ! -f "client/.env.local" ]; then
        print_status "Creating client environment file..."
        cat > client/.env.local << EOL
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_WHATSAPP_PHONE=+250788123456
EOL
        print_success "Client environment file created at client/.env.local"
        print_warning "Please update the environment variables with your actual credentials!"
    else
        print_warning "Client environment file already exists. Skipping..."
    fi

    # Create logs directory
    mkdir -p server/logs
    print_success "Created logs directory"

    echo ""
    print_success "Setup completed successfully! 🎉"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Update environment variables in server/.env and client/.env.local"
    echo "2. Start MongoDB service: sudo systemctl start mongod"
    echo "3. Run the development server: npm run dev"
    echo ""
    echo "🔗 Useful URLs:"
    echo "- Frontend: http://localhost:3000"
    echo "- Backend API: http://localhost:5000/api"
    echo "- API Health Check: http://localhost:5000/api/health"
    echo ""
    echo "📚 For more information, see README.md"
    echo ""
    echo "🏰 Welcome to Kingdom Snacks! Happy coding! 🇷🇼"
}

# Check if script is run with bash
if [ -z "$BASH_VERSION" ]; then
    print_error "This script must be run with bash"
    exit 1
fi

# Run main function
main "$@"