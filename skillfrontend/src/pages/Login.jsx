import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import Toast from '../components/Toast';

export const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(
    location.state?.registeredMessage || null
  );
  const [apiError, setApiError] = useState(null);

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (apiError) setApiError(null);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setApiError(null);

    try {
      await login(formData.email, formData.password);
      // Determine where to redirect (e.g. from ProtectedRoute)
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      const msg =
        err.userMessage ||
        err.response?.data?.message ||
        'Invalid email or password. Please try again.';
      setApiError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-16 relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-gradient-to-tr from-violet-600/20 to-fuchsia-600/20 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="w-full max-w-md glass-panel p-8 md:p-10 shadow-2xl shadow-violet-950/60 animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 mx-auto flex items-center justify-center text-white font-black text-xl mb-4 shadow-lg shadow-violet-500/30">
            S
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white">
            Welcome Back
          </h2>
          <p className="text-sm text-white/60 mt-1">
            Sign in to continue swapping skills
          </p>
        </div>

        {apiError && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-sm flex items-center gap-3 animate-fade-in">
            <span className="text-rose-400 text-lg shrink-0">⚠️</span>
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            autoComplete="email"
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-4"
            isLoading={isLoading}
            loadingText="Signing in..."
          >
            Sign In
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm text-white/60">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-fuchsia-400 hover:text-fuchsia-300 transition-colors"
          >
            Create one free →
          </Link>
        </div>
      </div>

      {toastMessage && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
};

export default Login;

