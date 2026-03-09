import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { ArrowLeft } from "lucide-react";
import {
  resetAuthState,
  verifyGoogleLogin,
} from "../../features/userSlice/authSlice";
import { initializeOnboarding } from "../../features/userSlice/onboardingSlice";
import { setUserId } from "../../features/userSlice/userSlice";
import snippyButler from "/snippy-assets/Snippy_butler.png";

const GoogleLoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const mode = location.state?.mode || "login";

  const { status, userOnboarded, partialUser, error } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(resetAuthState());
  }, [dispatch]);

  useEffect(() => {
    if (status === "succeeded" && userOnboarded === false) {
      if (partialUser) {
        dispatch(initializeOnboarding(partialUser));
      }
      navigate("/useronboarding/name-dob-gender");
    }
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
    <div className="flex flex-col min-h-screen bg-black p-6 font-inter">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="mt-4 mb-8 self-start">
        <ArrowLeft className="text-white w-6 h-6" />
      </button>

      <div className="w-full flex-1 flex flex-col justify-center">
        {/* Mascot Image */}
        <div className="w-full flex justify-start mb-10 pl-2">
          <img
            src={snippyButler}
            alt="Snippy Mascot"
            className="w-[180px] scale-x-[-1]"
          />
        </div>

        {/* Text Area */}
        <div className="mb-10">
          {mode === "login" ? (
            <h1 className="text-brand-off-white text-[32px] font-bold leading-[36px] tracking-tight text-left">
              Welcome back<br />
              Good to see you again.<br />
              Jump right in.
            </h1>
          ) : (
            <h1 className="text-brand-off-white text-[32px] font-bold leading-[36px] tracking-tight text-left">
              Welcome<br />
              There is a lot of memes,<br />
              stories and confessions
            </h1>
          )}
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-4 mb-20">
          <button
            onClick={handleGoogleSignIn}
            disabled={status === "loading"}
            className="w-full py-3.5 bg-[#DCDDDF] text-black rounded-[14px] text-[16px] font-bold hover:bg-gray-200 transition disabled:bg-gray-400"
          >
            {status === "loading"
              ? "Verifying..."
              : mode === "login"
                ? "Log In with your College Mail ID"
                : "Sign Up with your College Mail ID"}
          </button>

          {mode !== "login" && (
            <button
              disabled={true}
              className="w-full py-3.5 bg-[#DCDDDF] text-black rounded-[14px] text-[16px] font-bold hover:bg-gray-200 transition disabled:opacity-80"
            >
              Add your College
            </button>
          )}
        </div>

        {/* Error message handling */}
        {status === "failed" && error !== "Account already exists" && (
          <p className="text-red-500 mt-4 text-center">{error}</p>
        )}
      </div>

      {/* Footer Text */}
      <div className="mt-auto mb-4 text-left">
        <p className="text-[#8D9295] text-[10px] mb-1">
          By continuing, you confirm that you are 18+ and agree to our
        </p>
        <p className="text-brand-off-white text-[10px] font-bold">
          {mode === "login"
            ? "User Policy, Terms and Conditions and Community Guide Lines"
            : "User Policy, Terms and Conditions and Community Guidelines"}
        </p>
      </div>

      {/* Account Exists Popup */}
      {status === "failed" && error === "Account already exists" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 px-4">
          <div className="bg-[#1A1A1A] rounded-2xl p-6 w-full max-w-sm flex flex-col items-center">
            <h2 className="text-white text-xl font-bold mb-2">Account Exists</h2>
            <p className="text-brand-medium-gray text-center mb-6">
              Looks like you already have an account with us.
            </p>
            <button
              onClick={async () => {
                const auth = getAuth();
                await signOut(auth);
                dispatch(resetAuthState());
                navigate("/useronboarding/google-login", { state: { mode: "login" }, replace: true });
              }}
              className="w-full py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleLoginPage;
