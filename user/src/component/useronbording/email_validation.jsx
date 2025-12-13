import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import api from "../../providers/api";
import { useNavigate } from "react-router-dom";
import { auth } from "../../constants/firebaseConfig";

export default function VerifyEmailPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const selectedCollege = JSON.parse(
    localStorage.getItem("selected_college") || "null"
  );

  useEffect(() => {
    if (!selectedCollege) {
      console.warn("No college selected. Redirecting to select-college.");
      navigate("/useronboarding/select-college", { replace: true });
    }
  }, [navigate, selectedCollege]);

  const handleVerify = async () => {
    if (!email.trim()) {
      setError("Please enter your college email");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        setError("You are not logged in. Please login again.");
        setLoading(false);
        return;
      }

      const user_id = user.uid;
      const college_id = selectedCollege?._id;

      if (!college_id) {
        setError(
          "College not selected. Please go back and select your college."
        );
        setLoading(false);
        return;
      }

      const payload = { user_id, email, college_id };
      const response = await api.post("/auth/college-verify", payload);

      localStorage.setItem("snippet_email", email);

      navigate("/useronboarding/otp-verification");
    } catch (err) {
      console.error("Error verifying college email:", err);

      if (err.response) {
        setError(err.response.data.detail || "Verification failed. Try again.");
      } else if (err.request) {
        setError("Server not responding. Check your internet connection.");
      } else {
        setError("Something went wrong. Please try later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#E7E9EA] px-4 py-6 flex flex-col justify-between">
      {/* Top Section */}
      <div>
        <button className="text-[#E7E9EA] mb-6" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>

        <h1 className="text-2xl font-bold mb-2 leading-tight">
          Well, we need to verify <br /> YOU
        </h1>
        <p className="text-sm text-gray-300 mb-6">
          Enter your <span className="font-semibold">college email</span> to
          verify.
        </p>

        {/* Email Input */}
        <input
          type="email"
          placeholder="your college email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-md bg-transparent border border-zinc-600 placeholder:text-gray-400 text-sm outline-none"
        />

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-end items-center mt-8 mb-4">
        <button
          onClick={handleVerify}
          disabled={loading || !email.trim()}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200 ${
            loading || !email.trim()
              ? "bg-gray-600 cursor-not-allowed opacity-50"
              : "bg-[#F06CB7] hover:bg-[#e05ca3]"
          }`}
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
