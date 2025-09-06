import React from "react";

export default function LeftSidebar() {
  return (
    <aside className="w-56 bg-black border-r border-zinc-800 flex flex-col px-4 py-6 space-y-6">
      <nav className="space-y-6 text-lg text-[#E7E9EA]">
        <div className="flex items-center gap-2">mixes</div>
        <div className="flex items-center gap-2">bouquet</div>
        <div className="flex items-center gap-2">find</div>
        <div className="flex items-center gap-2">events</div>
        <div className="flex items-center gap-2">settings</div>
      </nav>
    </aside>
  );
}
