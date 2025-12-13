import React, { useState, useEffect } from "react";
import DesktopSelectTagPage from "./desktop_select_tag_page";
import MobileSelectTagPage from "./mobile_select_tag_page";

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
      {isMobile ? <MobileSelectTagPage /> : <DesktopSelectTagPage />}
    </>
  );
};

export default Home;
