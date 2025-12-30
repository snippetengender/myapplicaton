import React, { useState, useEffect } from "react";
import MobileCommunity from "./communitypage/mobile_community_page";
import DesktopCommunity from "./communitypage/desktop_community_page";

const Community = () => {
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
      {isMobile ? <MobileCommunity /> : <DesktopCommunity />}
    </>
  );
};

export default Community;
