import React, { useState } from "react";
import Header from "../../desktop_components/Header";
import LeftSidebar from "../../desktop_components/LeftSidebar";
import RightSidebar from "../../desktop_components/RightSidebar";

import CreatingNetworkPage1 from "./creatingnetworkpage1";
import CreatingNetworkPage2 from "./creatingnetworkpage2";
import CreatingNetworkPage3 from "./creatingnetworkpage3";

export default function CreateNetworkWrapper() {
  const [step, setStep] = useState(1);

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const renderStepComponent = () => {
    switch (step) {
      case 1:
        return <CreatingNetworkPage1 onNext={handleNext} />;
      case 2:
        return <CreatingNetworkPage2 onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <CreatingNetworkPage3   onBack={handleBack} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#E7E9EA] font-sans">
      <Header />
      <div className="flex">
        <LeftSidebar />
        <main className="flex-1 flex flex-col">
          <div className="flex-1 px-10 py-6 overflow-y-auto">
            {renderStepComponent()}
          </div>
        </main>
        <RightSidebar />
      </div>
    </div>
  );
}
