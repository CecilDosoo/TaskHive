import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { authService } from '../services/auth.service';

export default function ResendVerification() {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Pre-fill email if coming from registration
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
    if (location.state?.message) {
      setMessage(location.state.message);
      setStatus('success');
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      await authService.resendVerification(email);
      setStatus('success');
      setMessage('Verification email sent! Please check your inbox.');
    } catch (error: any) {
      setStatus('error');
      setMessage(error.response?.data?.error?.message || 'Failed to resend verification email');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {status === 'success' && message.includes('Registration') ? 'Check Your Email' : 'Resend Verification Email'}
          </h1>
          <p className="text-gray-600">
            {status === 'success' && message.includes('Registration') 
              ? 'We sent a verification link to your email. Please verify your account before signing in.'
              : 'Enter your email address to receive a new verification link.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {status === 'success' && (
            <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {message}
            </div>
          )}

          {status === 'error' && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {message}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Sending...' : 'Resend Verification Email'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ strokeWidth: 2.5 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}




