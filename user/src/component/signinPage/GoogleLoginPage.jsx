import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  resetAuthState,
  verifyGoogleLogin,
} from "../../features/userSlice/authSlice";
import { initializeOnboarding } from "../../features/userSlice/onboardingSlice";
import { setUserId } from "../../features/userSlice/userSlice";

const GoogleLoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const mode = location.state?.mode || "login";

  const { status, userOnboarded, partialUser, error } = useSelector(
    (state) => state.auth
  );

  // FIX #1: The dispatch call is now correctly placed inside a useEffect
  // This runs only ONCE when the component first loads.
  useEffect(() => {
    dispatch(resetAuthState());
  }, [dispatch]);

  // FIX #2: The navigation logic now uses the correct variable names
  useEffect(() => {
    // Use 'status' and 'userOnboarded' directly, not 'auth.status'
    if (status === "succeeded" && userOnboarded === false) {
      if (partialUser) {
        dispatch(initializeOnboarding(partialUser));
      }
      navigate("/useronboarding/name-dob-gender");
    }
    // Note: The navigation logic from the thunk will handle the other success cases
  }, [status, userOnboarded, partialUser, navigate, dispatch]);

  const handleGoogleSignIn = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseToken = await result.user.getIdToken(true);

      dispatch(verifyGoogleLogin({ firebaseToken, mode, navigate }));
      dispatch(setUserId(result.user.uid));
    } catch (err) {
      console.error("Firebase Google Sign-In Error:", err);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-black p-6">
      <div className="text-center">
        <h1 className="text-white text-2xl font-bold mb-8">Join The Snippet</h1>
        <p className="text-gray-400 mb-8">
          Sign in with your college Google account to continue.
        </p>
        <button
          onClick={handleGoogleSignIn}
          disabled={status === "loading"}
          className="w-full max-w-sm py-3 px-6 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition disabled:bg-gray-400"
        >
          {status === "loading" ? "Verifying..." : "Sign In with Google"}
        </button>
        {status === "failed" && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default GoogleLoginPage;
