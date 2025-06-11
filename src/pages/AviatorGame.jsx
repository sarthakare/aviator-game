import { useState } from "react";
import AviatorAnimation from "./AviatorAnimation";
import BettingControls from "./BettingContols";

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
          <div className="w-full md:w-1/4 bg-[#1E1E1E] p-4 rounded-lg">
            <div className="mb-4">
              <div className="text-sm">
                Quantity: <strong>0</strong>
              </div>
              <div className="text-sm">
                Amount: <strong className="text-[#00FF00]">0.00 INR</strong>
              </div>
            </div>
            <div className="bg-[#1C1C1C] p-4 rounded-md w-full text-white">
              {/* Header */}
              <div className="text-xs text-gray-400 mb-2 flex justify-between px-2">
                <span className="w-1/3">Player</span>
                <span className="w-1/4 text-right">Bet</span>
                <span className="w-1/6 text-right">Rate</span>
                <span className="w-1/6 text-right">Win</span>
              </div>

              {/* Bet rows (replace with dynamic .map loop) */}
              {[
                { player: "m****q", bet: "6234.63", rate: "-", win: "-" },
                { player: "c****8", bet: "2000.00", rate: "-", win: "-" },
                { player: "9****T", bet: "832.83", rate: "-", win: "-" },
                { player: "c****8", bet: "800.00", rate: "-", win: "-" },
                { player: "9****T", bet: "555.22", rate: "-", win: "-" },
                { player: "c****1", bet: "502.80", rate: "-", win: "-" },
                { player: "c****1", bet: "500.00", rate: "-", win: "-" },
                { player: "3****8", bet: "414.58", rate: "-", win: "-" },
                { player: "c****2", bet: "400.00", rate: "-", win: "-" },
                { player: "6****0", bet: "344.10", rate: "-", win: "-" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-[#2A2A2A] py-2 px-2 rounded-md mb-1"
                >
                  <div className="flex items-center w-1/3 space-x-2">
                    <img
                      src="/avatar.png"
                      alt="avatar"
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="text-sm">{item.player}</span>
                  </div>
                  <span className="w-1/4 text-sm text-right">
                    {item.bet} PKR
                  </span>
                  <span className="w-1/6 text-sm text-right">{item.rate}</span>
                  <span className="w-1/6 text-sm text-right">{item.win}</span>
                </div>
              ))}
            </div>
          </div>

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
