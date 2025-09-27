import { getAuth, signOut } from "firebase/auth";
import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { resetAuthState } from "../../features/userSlice/authSlice";

const AlreadyRegisteredPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleTryAgain = async () => {
    const auth = getAuth();
    await signOut(auth);
    dispatch(resetAuthState());
    navigate("/lobby");
  };
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-black text-white p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Account Exists</h1>
      <p className="text-gray-400 mb-6">
        An account with this email is already registered.
      </p>
      <button
        onClick={handleTryAgain}
        className="py-2 px-6 bg-white text-black rounded-lg font-semibold"
      >
        Try again
      </button>
    </div>
  );
};

export default AlreadyRegisteredPage;
