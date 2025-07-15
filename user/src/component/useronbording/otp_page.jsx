import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../providers/api'; 
import { auth } from '../../constants/firebaseConfig'; 

export default function OtpVerificationPage() {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const savedEmail = localStorage.getItem('snippet_email') || '';
  const userId = auth.currentUser?.uid || localStorage.getItem('user_id');

  useEffect(() => {
    if(!savedEmail){
        console.warn("No email enetered. Redirecting to verify-email.");
        navigate("/useronboarding/verify-email", { replace: true });
    }
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const payload = {
        user_id: userId,
        otp: enteredOtp
      };

      console.log('Verifying OTP with payload:', payload);

      const response = await api.post('/auth/verify-otp', payload);
      console.log('OTP verification success:', response.data);
      localStorage.setItem("snippet_otp_verified", "true");
      navigate('/useronboarding/name-dob-gender');
    } catch (err) {
      console.error('OTP verification failed:', err);
      if (err.response) {
        setError(err.response.data.detail || 'Verification failed. Try again.');
      } else {
        setError('Server error. Please try later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6 flex flex-col justify-between">
      {/* Header */}
      <div>
        <button className="mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="text-white" size={24} />
        </button>

        {/* Title & Description */}
        <h1 className="text-2xl font-bold mb-2 leading-tight">
          type in the OTP which we have sent you through email
        </h1>
        <p className="text-sm text-gray-300 mb-4">
          Enter the 6-digit OTP sent to your college email.
        </p>

        {/* Email Display */}
        <p className="text-sm mb-2">
          <span className="font-semibold">OTP sent to</span>{' '}
          {savedEmail}{' '}
          <span
            className="text-[#F06CB7] underline cursor-pointer"
            onClick={() => navigate('/useronboarding/verify-email')}
          >
            edit
          </span>
        </p>

        {/* OTP Boxes */}
        <label className="block text-sm mt-4 mb-2">OTP</label>
        <div className="flex gap-2">
          {otp.map((digit, i) => (
            <input
              key={i}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e, i)}
              ref={(ref) => (inputRefs.current[i] = ref)}
              className="w-10 h-12 text-center text-xl bg-transparent border border-zinc-600 rounded-md outline-none"
            />
          ))}
        </div>

        {/* Error message */}
        {error && (
          <p className="mt-4 text-sm text-red-500">{error}</p>
        )}

        {/* Timer */}
        <p className="mt-4 text-sm">
          <span className="text-[#F06CB7]">Resend Code in</span>{' '}
          {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end mt-10 mb-4">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#2e2e2e]'
          }`}
        >
          {loading ? (
            <span className="loader w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <ArrowRight className="text-white" size={22} />
          )}
        </button>
      </div>
    </div>
  );
}
