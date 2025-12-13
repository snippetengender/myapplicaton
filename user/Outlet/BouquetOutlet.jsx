import React from "react";
import { Outlet } from "react-router-dom";

export default function BouquetOutlet() {
  return (
    <div className="bg-black min-h-screen text-white">
      <Outlet />
    </div>
  );
}
