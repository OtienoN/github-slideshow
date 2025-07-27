import { NextPage } from 'next';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

import { useAuth } from '../../contexts/AuthContext';
import AuthLayout from '../../components/Layout/AuthLayout';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import Checkbox from '../../components/UI/Checkbox';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginPage: NextPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      await login(data.email, data.password, data.rememberMe);
      
      // Redirect to intended page or dashboard
      const redirectTo = router.query.redirect as string || '/account';
      router.push(redirectTo);
      
      toast.success('Welcome back to Kingdom Snacks!');
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Login to Kingdom Snacks">
      <Head>
        <title>Login - Kingdom Snacks</title>
        <meta name="description" content="Login to your Kingdom Snacks account to access exclusive features, track orders, and enjoy personalized shopping." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="text-center">
              <Link href="/" className="inline-flex items-center space-x-2 group">
                <span className="text-3xl">🏰</span>
                <span className="font-display font-bold text-2xl text-primary-600 group-hover:text-primary-700 transition-colors">
                  Kingdom Snacks
                </span>
              </Link>
              <h2 className="mt-6 text-3xl font-display font-bold text-gray-900">
                Welcome back!
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Sign in to your account to continue shopping
              </p>
            </div>

            {/* Social Login */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                </div>
              </div>

              {/* Optional: Social login buttons can be added here */}
              <div className="mt-6 grid grid-cols-2 gap-3 hidden">
                <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0a10 10 0 1010 10A10.011 10.011 0 0010 0zm6.613 4.614a8.523 8.523 0 01.631 8.829 8.453 8.453 0 01-.631.829 8.518 8.518 0 01-13.226 0 8.523 8.523 0 01.631-8.829 8.453 8.453 0 01.631-.829 8.518 8.518 0 0113.226 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2">Google</span>
                </button>
                <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2">Facebook</span>
                </button>
              </div>
            </div>

            {/* Login Form */}
            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                {/* Email */}
                <Input
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email"
                  error={errors.email?.message}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email address'
                    }
                  })}
                />

                {/* Password */}
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    placeholder="Enter your password"
                    error={errors.password?.message}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters'
                      }
                    })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between">
                <Checkbox
                  label="Remember me"
                  {...register('rememberMe')}
                />

                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-primary-600 hover:text-primary-500 font-medium"
                >
                  Forgot your password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>

              {/* Sign up link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link
                    href="/auth/register"
                    className="font-medium text-primary-600 hover:text-primary-500"
                  >
                    Sign up for free
                  </Link>
                </p>
              </div>
            </form>

            {/* Demo Accounts */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Demo Accounts</h3>
              <div className="space-y-2 text-xs text-gray-600">
                <div>
                  <strong>Customer:</strong> customer@demo.com / password123
                </div>
                <div>
                  <strong>Admin:</strong> admin@demo.com / password123
                </div>
              </div>
            </div>

            {/* Footer Links */}
            <div className="mt-8 text-center">
              <div className="flex justify-center space-x-6 text-sm text-gray-600">
                <Link href="/privacy" className="hover:text-primary-600">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-primary-600">
                  Terms of Service
                </Link>
                <Link href="/contact" className="hover:text-primary-600">
                  Support
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;