import { useDispatch } from "react-redux";
import { resetAuthState } from "../../features/userSlice/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

const DomainErrorPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleTryAgain = async () => {
    const auth = getAuth();
    await signOut(auth);
    dispatch(resetAuthState());
    navigate("/lobby");
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-black text-white p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Invalid Email Domain</h1>
      <p className="text-gray-400 mb-6 max-w-sm">
        This application is restricted to specific college email domains. Please
        try again using your official college email account.
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

export default DomainErrorPage;
