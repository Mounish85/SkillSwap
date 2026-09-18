import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

export const Register = () => {
  const { register, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
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

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      await register(formData.name, formData.email, formData.password);
      // Registration successful! Redirect to login with positive feedback
      navigate('/login', {
        state: {
          registeredMessage:
            'Registration successful! Please sign in with your credentials.',
        },
      });
    } catch (err) {
      const msg =
        err.userMessage ||
        err.response?.data?.message ||
        'Registration failed. Please check your information and try again.';
      setApiError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-16 relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] bg-gradient-to-tr from-fuchsia-600/20 to-cyan-600/20 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="w-full max-w-md glass-panel p-8 md:p-10 shadow-2xl shadow-fuchsia-950/60 animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-fuchsia-600 to-cyan-600 mx-auto flex items-center justify-center text-white font-black text-xl mb-4 shadow-lg shadow-fuchsia-500/30">
            S
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white">
            Create Account
          </h2>
          <p className="text-sm text-white/60 mt-1">
            Join the SkillSwap peer-to-peer exchange
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
            label="Full Name"
            name="name"
            placeholder="e.g. Alex Morgan"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
            autoComplete="name"
          />

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
            placeholder="At least 6 characters"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
            autoComplete="new-password"
          />

          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Repeat password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
            autoComplete="new-password"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-4"
            isLoading={isLoading}
            loadingText="Creating account..."
          >
            Create Free Account
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm text-white/60">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-fuchsia-400 hover:text-fuchsia-300 transition-colors"
          >
            Sign in here →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

