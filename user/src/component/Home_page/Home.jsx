import React, { useState, useEffect } from "react";
import MobileHome from "./mobilehome";
import DesktopHome from "./desktophome";

const Home = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {isMobile ? <MobileHome /> : <DesktopHome />}
    </>
  );
};

export default Home;
