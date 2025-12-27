import { AlertCircle, CheckCircle, Loader2, Lock, Mail, User, Wrench } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            role: 'TECHNICIAN', // Default role
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      if (data.user) {
        setSuccess(true);
        // If email confirmation is required, show message
        if (data.user.identities?.length === 0) {
          setError('An account with this email already exists');
        } else {
          // Navigate to dashboard after successful signup
          setTimeout(() => navigate('/dashboard'), 2000);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Failed to sign up with Google');
      setLoading(false);
    }
  };

  const handleGithubSignUp = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Failed to sign up with GitHub');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-odoo-light flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="odoo-card p-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 rounded-full mb-4">
              <CheckCircle className="w-7 h-7 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold text-odoo-gray-900 mb-2">Verify Your Email</h2>
            <p className="text-sm text-odoo-gray-600 mb-6">
              We've sent a confirmation link to <strong>{formData.email}</strong>. Please check your
              email and click the link to activate your account.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="odoo-button odoo-button-primary w-full"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-odoo-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#714B67] rounded mb-3">
            <Wrench className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-odoo-gray-900">GearGuard</h1>
          <p className="text-sm text-odoo-gray-600 mt-1">Create your account</p>
        </div>

        {/* Sign Up Card */}
        <div className="odoo-card p-8">
          <h2 className="text-xl font-semibold text-odoo-gray-900 mb-6 text-center">Register</h2>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700">{error}</p>
            </div>
          )}

          {/* Sign Up Form */}
          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <div className="odoo-form-group">
              <label htmlFor="name" className="odoo-label odoo-label-required">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-odoo-gray-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="odoo-input pl-9"
                />
              </div>
            </div>

            <div className="odoo-form-group">
              <label htmlFor="email" className="odoo-label odoo-label-required">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-odoo-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="user@company.com"
                  className="odoo-input pl-9"
                />
              </div>
            </div>

            <div className="odoo-form-group">
              <label htmlFor="password" className="odoo-label odoo-label-required">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-odoo-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter password"
                  className="odoo-input pl-9"
                />
              </div>
              <p className="mt-1 text-xs text-odoo-gray-500">
                8+ chars with uppercase, lowercase, and number
              </p>
            </div>

            <div className="odoo-form-group">
              <label htmlFor="confirmPassword" className="odoo-label odoo-label-required">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-odoo-gray-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm password"
                  className="odoo-input pl-9"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full odoo-button odoo-button-primary mt-6 h-10"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="odoo-divider"></div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="odoo-button odoo-button-secondary text-xs h-9"
            >
              <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>

            <button
              type="button"
              onClick={handleGithubSignUp}
              disabled={loading}
              className="odoo-button odoo-button-secondary text-xs h-9"
            >
              <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </button>
          </div>

          {/* Login Link */}
          <p className="mt-6 text-center text-xs text-odoo-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-[#714B67] hover:text-[#8B5E7F] font-medium">
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-odoo-gray-500 mt-4">
          © {new Date().getFullYear()} GearGuard. All rights reserved.
        </p>
      </div>
    </div>
  );
}
