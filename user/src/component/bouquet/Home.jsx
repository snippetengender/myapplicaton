import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out");
        navigate("/lobby", { replace: true });
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Home Page</h1>
      <button
        onClick={handleLogout}
        className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        Logout
      </button>
    </div>
  );
};

export default Home;
