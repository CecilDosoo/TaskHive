import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState<'loading' | 'error'>('loading');

  useEffect(() => {
    const token = searchParams.get('token');
    const emailVerified = searchParams.get('emailVerified') === 'true';
    const error = searchParams.get('error');

    if (error) {
      setStatus('error');
      setTimeout(() => {
        navigate('/?error=oauth_failed');
      }, 2000);
      return;
    }

    if (token) {
      // Store token
      localStorage.setItem('token', token);
      
      // Fetch user info using the token
      const fetchUser = async () => {
        try {
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
          const response = await fetch(`${apiUrl}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            localStorage.setItem('user', JSON.stringify(data.user));
            // Redirect to dashboard
            navigate('/dashboard');
          } else {
            throw new Error('Failed to fetch user');
          }
        } catch (error) {
          setStatus('error');
          setTimeout(() => {
            navigate('/?error=oauth_failed');
          }, 2000);
        }
      };

      fetchUser();
    } else {
      setStatus('error');
      setTimeout(() => {
        navigate('/?error=oauth_failed');
      }, 2000);
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Completing Sign In...</h1>
            <p className="text-gray-600">Please wait while we complete your authentication.</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mb-4">
              <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Failed</h1>
            <p className="text-gray-600">Redirecting to login...</p>
          </>
        )}
      </div>
    </div>
  );
}

