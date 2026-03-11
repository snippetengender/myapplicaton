import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
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

  const [isProcessing, setIsProcessing] = useState(false);

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
    setIsProcessing(true);

    try {
      // 1. Native/Web Google Sign-In via Capacitor Plugin
      const result = await FirebaseAuthentication.signInWithGoogle({
        useCredentialManager: false
      });

      // 2. Get the ID token from the result
      const idToken = result.credential?.idToken;
      if (!idToken) {
        throw new Error("No ID token found in Google Sign-In result");
      }

      // 3. Create a Firebase credential
      const credential = GoogleAuthProvider.credential(idToken);

      // 4. Sign in to Firebase with the credential
      const userCredential = await signInWithCredential(auth, credential);
      const user = userCredential.user;

      // 5. Get a fresh ID token for the backend verification
      const firebaseToken = await user.getIdToken(true);

      // 6. Proceed with existing Redux workflow
      dispatch(verifyGoogleLogin({ firebaseToken, mode, navigate }));
      dispatch(setUserId(user.uid));
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      // Optional: Dispatch a failure action to update UI state if needed
      // dispatch(loginFailed(err.message));
    } finally {
      setIsProcessing(false);
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
          disabled={status === "loading" || isProcessing}
          className="w-full max-w-sm py-3 px-6 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition disabled:bg-gray-400 flex items-center justify-center gap-2"
        >
          {status === "loading" || isProcessing ? (
            <>
              <svg className="animate-spin h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Please wait, Processing...
            </>
          ) : (
            "Sign In with Google"
          )}
        </button>
        {status === "failed" && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default GoogleLoginPage;
