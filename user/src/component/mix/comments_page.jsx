import React, { useState, useEffect } from "react";
import DesktopSelectTagPage from "./desktop_comment_page";
import MobileSelectTagPage from "./mobile_comments_page";

const Comment = () => {
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

export default Comment;
