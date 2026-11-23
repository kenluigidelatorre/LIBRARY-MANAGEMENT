
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import BrandEmblem from '../../components/common/BrandEmblem';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setError('');
    setNotice('');
    setIsSubmitting(true);

    try {
      const res = await login({
        email,
        password,
        rememberMe,
      });

      if (!res.ok) {
        setError(res.error);
        return;
      }

      navigate('/dashboard');
    } catch {
      setError('Unable to sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    setError('');
    setNotice(
      'Password reset is not available yet. Please contact your system administrator.'
    );
  };

  return (
    <div className="auth-backdrop">
      <div className="auth-card">
        <div className="flex flex-col items-center text-center mb-6">
          <BrandEmblem size={54} />
          <h1 className="text-[22px] font-extrabold tracking-tight text-[#111827] mt-4">
            WELCOME BACK!
          </h1>
          <p className="text-[13px] text-[#6B7280] mt-1">
            Sign in to Library Management System
          </p>
        </div>

        {error && (
          <div className="mb-4 px-3.5 py-2.5 rounded-lg bg-[#FEE2E2] text-[#DC2626] text-[13px] font-medium">
            {error}
          </div>
        )}

        {notice && (
          <div className="mb-4 px-3.5 py-2.5 rounded-lg bg-[#E7F6EE] text-[#15803D] text-[13px] font-medium">
            {notice}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              aria-label="Email address"
              required
              className="w-full h-11 pl-10 pr-4 rounded-lg border border-[#E1E7E3] bg-[#F5F7F6] text-[13.5px] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:bg-white focus:border-[#158F50] focus:ring-2 focus:ring-[#158F50]/15"
            />
          </div>

          <div className="relative">
            <Lock
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none"
            />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              aria-label="Password"
              required
              className="w-full h-11 pl-10 pr-11 rounded-lg border border-[#E1E7E3] bg-[#F5F7F6] text-[13.5px] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:bg-white focus:border-[#158F50] focus:ring-2 focus:ring-[#158F50]/15"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#111827]"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          <div className="flex items-center justify-between text-[12.5px]">
            <label className="inline-flex items-center gap-2 text-[#4B5563] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-[#CDD7D1] accent-[#158F50]"
              />
              <span>Remember me</span>
            </label>

            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-[#158F50] font-semibold hover:underline bg-transparent border-0 p-0"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full h-11 text-[14px]"
          >
            {isSubmitting ? 'Signing in...' : 'Log in'}
          </button>
        </form>

        <p className="text-center text-[13px] text-[#6B7280] mt-5">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-[#158F50] font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
