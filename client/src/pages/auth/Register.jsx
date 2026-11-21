import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import BrandEmblem from '../../components/common/BrandEmblem';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setError('Please confirm your institutional account agreement.');
      return;
    }

    const res = register({ name, email, password });
    if (!res.ok) {
      setError(res.error);
      return;
    }
    navigate('/dashboard');
  };

  return (
    <div className="auth-backdrop">
      <div className="auth-card">
        <div className="flex flex-col items-center text-center mb-6">
          <BrandEmblem size={54} />
          <h1 className="text-[22px] font-extrabold tracking-tight text-[#111827] mt-4">
            Create an Account
          </h1>
          <p className="text-[13px] text-[#6B7280] mt-1">
            Register staff access for CMD Library MS
          </p>
        </div>

        {error && (
          <div className="mb-4 px-3.5 py-2.5 rounded-lg bg-[#FEE2E2] text-[#DC2626] text-[13px] font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="relative">
            <User
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none"
            />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              aria-label="Full Name"
              className="w-full h-11 pl-10 pr-4 rounded-lg border border-[#E1E7E3] bg-[#F5F7F6] text-[13.5px] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:bg-white focus:border-[#158F50] focus:ring-2 focus:ring-[#158F50]/15"
            />
          </div>

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

          <div className="relative">
            <Lock
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none"
            />
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              aria-label="Confirm Password"
              className="w-full h-11 pl-10 pr-11 rounded-lg border border-[#E1E7E3] bg-[#F5F7F6] text-[13.5px] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:bg-white focus:border-[#158F50] focus:ring-2 focus:ring-[#158F50]/15"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((prev) => !prev)}
              aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#111827]"
            >
              {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          <div className="flex items-center justify-between text-[12.5px] pt-0.5">
            <label className="inline-flex items-center gap-2 text-[#4B5563] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 rounded border-[#CDD7D1] accent-[#158F50]"
              />
              <span>Remember me</span>
            </label>
            <Link to="/login" className="text-[#158F50] font-semibold hover:underline">
              Need help?
            </Link>
          </div>

          <button type="submit" className="btn-primary w-full h-11 text-[14px] mt-1">
            Create Account
          </button>
        </form>

        <p className="text-center text-[13px] text-[#6B7280] mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-[#158F50] font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
