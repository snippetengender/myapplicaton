import React, { useState, useEffect } from "react";
import MobileCreateNetwork from "./MobileCreateNetworkWrapper/mobile_createnetwork_1";
import DesktopCreateNetwork from "./DesktopCreateNetworkWrapper/desktop_createnetwork_page";

const CreateNetwork = () => {
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
      {isMobile ? <MobileCreateNetwork /> : <DesktopCreateNetwork />}
    </>
  );
};

export default CreateNetwork;
