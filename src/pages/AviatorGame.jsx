import { useState } from "react";
import AviatorAnimation from "./AviatorAnimation";

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
        <div className="text-[#00FF00]">0.00 INR</div>
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
            <div className="text-xs text-gray-400">
              Player | Bet | Rate | Win
            </div>
            {/* Dynamic bet table rows can go here */}
          </div>

          {/* Graph + Controls */}
          <div className="w-full md:w-3/4 flex flex-col gap-4">
            <div className="bg-[#111] rounded-xl overflow-hidden relative p-4">
              <div className="absolute top-2 left-4 text-xs text-gray-400 mb-2">
                ping: 97 ms
              </div>
              <AviatorAnimation start={start} crashPoint={crashPoint} />
              {!start && (
                <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-red-500">
                  Flew away. Try more
                </div>
              )}
            </div>

            {/* Betting Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-[#1E1E1E] p-4 rounded-lg text-center"
                >
                  <div className="flex justify-between text-xs mb-2">
                    <span>Bet {i}</span>
                    <span>Auto cash out</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <input
                      type="text"
                      value="1.01"
                      readOnly
                      className="w-1/3 text-center rounded bg-black text-white"
                    />
                    <input
                      type="text"
                      value="50.00"
                      readOnly
                      className="w-1/2 text-center rounded bg-black text-white"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-2 text-xs">
                    <button className="bg-black px-2 py-1 rounded">
                      50.00
                    </button>
                    <button className="bg-black px-2 py-1 rounded">
                      1000.00
                    </button>
                    <button className="bg-black px-2 py-1 rounded">
                      5000.00
                    </button>
                    <button className="bg-black px-2 py-1 rounded">
                      10000.00
                    </button>
                    <button className="bg-black px-2 py-1 rounded">½</button>
                    <button className="bg-black px-2 py-1 rounded">x2</button>
                    <button className="bg-black px-2 py-1 rounded col-span-3">
                      Max
                    </button>
                  </div>
                  <button
                    onClick={handleStart}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold w-full py-2 rounded shadow"
                  >
                    BET 50.00 INR
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
