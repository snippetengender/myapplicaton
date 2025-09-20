import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import MobileCommunity from "./communitypage/mobile_community_page";
import DesktopCommunity from "./desktop_community_page";

const Community = () => {
  const { id } = useParams(); 
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
      {isMobile ? (
        <MobileCommunity /> // No longer passes the id prop
      ) : (
        <DesktopCommunity />
      )}
    </>
  );
};

export default Community;
