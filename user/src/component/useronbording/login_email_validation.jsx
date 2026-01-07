import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function VerifyEmailPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock selectedCollege for frontend-only demonstration
  // In a real application, this would likely come from a global state or context
  const selectedCollege = { _id: 'mockCollegeId', name: 'Mock University' };

  // --- Mock Navigation Function ---
  // In a real application, you would use a hook like `useNavigate` from 'react-router-dom'
  const navigate = (path) => {
    // Here, you could update a state variable to simulate different "pages"
    // For this example, we'll just log the navigation.
    // In a full app, this would change the URL and render a different component.
  };
  // --- End Mock Navigation Function ---

  useEffect(() => {
    if (!selectedCollege) {
      console.warn("No college selected. Simulating redirection to select-college.");
      // In a real frontend, you'd use navigate("/useronboarding/signin-verify-email", { replace: true });
      navigate("/useronboarding/signin-verify-email");
    }
  }, [selectedCollege, navigate]); // Added navigate to dependencies as it's now used

  const handleVerify = () => {
    if (!email.trim()) {
      setError('Please enter your college email');
      return;
    }

    setError('');
    setLoading(true);

    // Simulate an API call or validation
    setTimeout(() => {
      localStorage.setItem('snippet_email', email); 
      navigate('/login-otp-page'); 
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-[#E7E9EA] px-4 py-6 flex flex-col justify-between font-sans">
      {/* Top Section */}
      <div>
        <button className="text-[#E7E9EA] mb-6" onClick={() => navigate(-1)}> {/* Simulate back navigation */}
          <ArrowLeft size={24} />
        </button>

        <h1 className="text-2xl font-bold mb-2 leading-tight">
          Heyy, welcome back<br /> AGAIN bro
        </h1>
        <p className="text-sm text-gray-300 mb-6">
          Enter your <span className="font-semibold">college email</span> to verify.
        </p>

        {/* Email Input */}
        <input
          type="email"
          placeholder="your college email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-md bg-transparent border border-zinc-600 placeholder:text-gray-400 text-sm outline-none focus:border-blue-500 transition-colors"
          style={{ fontFamily: 'Inter, sans-serif' }}
        />

        {error && (
          <p className="mt-4 text-sm text-red-500">
            {error}
          </p>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-end items-center mt-8 mb-4">
        <button
          onClick={handleVerify}
          disabled={loading}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
            ${loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#2e2e2e] hover:bg-gray-700 active:scale-95'}
          `}
        >
          {loading ? (
            <span className="loader w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <ArrowRight className="text-[#E7E9EA]" size={22} />
          )}
        </button>
      </div>
    </div>
  );
}
