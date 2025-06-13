import { useState } from "react";
import AviatorAnimation from "./AviatorAnimation";
import BettingControls from "./BettingContols";
import PlacedBets from "./PlacedBets";

export default function AviatorGame() {
  const [start, setStart] = useState(false);
  const crashPoint = 10; // You can randomize or fetch this from backend later

  const handleStart = () => {
    setStart(false);
    setTimeout(() => setStart(true), 50);
  };

  return (
    <div className="h-screen overflow-y-auto bg-black text-white font-sans">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#7000FF] flex justify-between items-center px-6 py-3 text-white text-sm font-semibold">
        <div className="text-lg font-bold text-white">PILOT</div>
        <div className="flex items-center gap-2">
          <span className="text-xs">DEMO0123</span>
          <div className="w-6 h-6 rounded-full bg-gray-400" />
        </div>
      </div>

      {/* Body */}
      <div className="pt-14">
        <div className="flex flex-col md:flex-row p-4 gap-4">
          {/* Left Sidebar */}
          <PlacedBets/>

          {/* Graph + Controls */}
          <div className="w-full md:w-3/4 flex flex-col gap-4">
            <div className="bg-[#111] rounded-xl overflow-hidden relative p-4">
              <AviatorAnimation start={start} crashPoint={crashPoint} />
              {!start && (
                <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-red-500">
                  Flew away. Try more
                </div>
              )}
            </div>

            {/* Betting Controls */}

            <BettingControls onStart={handleStart}/>
          </div>
        </div>
      </div>
    </div>
  );
}
