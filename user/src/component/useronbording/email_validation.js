import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function VerifyEmailPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleVerify = () => {
    const keywords = ['edu', 'college', 'student']; // You can update these
    const isValid = keywords.some((kw) => email.includes(kw));

    if (!isValid) {
      setError('>>> email id dosent contain any matching keyword');
    } else {
      setError('');
      window.location.href = '/next_verification_step'; // update as needed
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6 flex flex-col justify-between">
      {/* Top Section */}
      <div>
        <button className="text-white mb-6">
          <ArrowLeft size={24} />
        </button>

        <h1 className="text-2xl font-bold mb-2 leading-tight">
          well, we need to verify <br /> YOU
        </h1>
        <p className="text-sm text-gray-300 mb-6">
          Lorem ipsum dolor sit amet consectetur. Sit porta blandit montes cursus. Tempus accumsan
          mauris in cras sit. <span className="underline">Learn more</span>
        </p>

        <input
          type="email"
          placeholder="email Id here"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-md bg-transparent border border-zinc-600 placeholder:text-gray-400 text-sm outline-none"
        />

        {error && (
          <p className="mt-4 text-sm text-white">
            {error}
          </p>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-end items-center mt-8 mb-4">
        <button
          onClick={handleVerify}
          className="w-12 h-12 rounded-full bg-[#2e2e2e] flex items-center justify-center"
        >
          <ArrowRight className="text-white" size={22} />
        </button>
      </div>
    </div>
  );
}
