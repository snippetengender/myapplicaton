import React, { useState, useEffect } from "react";
import MobileNetworkPage from "./mobile_edit_network_page";
import DesktopNetworkPage from "./desktop_edit_network_page";

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
      {isMobile ? <MobileNetworkPage /> : <DesktopNetworkPage />}
    </>
  );
};

export default Home;
