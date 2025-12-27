import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (data.session) {
          setStatus('success');
          setMessage('Authentication successful! Redirecting...');
          
          // Redirect to dashboard after 1 second
          setTimeout(() => {
            navigate('/dashboard');
          }, 1000);
        } else {
          throw new Error('No session found');
        }
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setStatus('error');
        setMessage(err.message || 'Authentication failed. Please try again.');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {status === 'loading' && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Authenticating...</h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
              <p className="text-gray-600 mb-4">{message}</p>
              <div className="flex items-center justify-center gap-2 text-purple-600">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">Redirecting...</span>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Failed</h2>
              <p className="text-gray-600 mb-4">{message}</p>
              <p className="text-sm text-gray-500">Redirecting to login page...</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
