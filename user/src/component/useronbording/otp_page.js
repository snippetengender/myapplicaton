import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function OtpVerificationPage() {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef([]);

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

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6 flex flex-col justify-between">
      {/* Header */}
      <div>
        <button className="mb-4">
          <ArrowLeft className="text-white" size={24} />
        </button>

        {/* Title & Description */}
        <h1 className="text-2xl font-bold mb-2 leading-tight">
          type in the OTP which we have sent you through email
        </h1>
        <p className="text-sm text-gray-300 mb-4">
          Lorem ipsum dolor sit amet consectetur. Sit porta blandit montes cursus. Tempus accumsan mauris in cras sit.
        </p>

        {/* Email Display */}
        <p className="text-sm mb-2">
          <span className="font-semibold">OTP sent to</span>{' '}
          71762232053@cit.edu.in <span className="text-[#F06CB7] underline cursor-pointer">edit</span>
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

        {/* Timer */}
        <p className="mt-4 text-sm">
          <span className="text-[#F06CB7]">Resend Code in</span> {Math.floor(timer / 60)} :{' '}
          {String(timer % 60).padStart(2, '0')}
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end mt-10 mb-4">
        <button className="w-12 h-12 rounded-full bg-[#2e2e2e] flex items-center justify-center">
          <ArrowRight className="text-white" size={22} />
        </button>
      </div>
    </div>
  );
}
