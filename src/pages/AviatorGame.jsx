import { useState, useEffect } from "react";
import AviatorAnimation from "./AviatorAnimation";
import BettingControls from "./BettingContols";
import PlacedBets from "./PlacedBets";

export default function AviatorGame() {
  const [phase, setPhase] = useState("waiting"); // "waiting" | "running" | "crashed"
  const [progress, setProgress] = useState(0);
  const crashPoint = 5; // multiplier at which plane crashes

  // Handle waiting phase progress bar
  useEffect(() => {
    if (phase === "waiting") {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setPhase("running");
            return 100;
          }
          return prev + 2;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [phase]);

  // Handle delay after crash
  useEffect(() => {
    if (phase === "crashed") {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setPhase("waiting");
            return 100;
          }
          return prev + 2;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [phase]);

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
          <PlacedBets />

          {/* Main Area */}
          <div className="w-full md:w-3/4 flex flex-col gap-4">
            <div className="bg-[#111] rounded-xl overflow-hidden relative min-h-[400px] flex items-center justify-center p-4">
              {/* Waiting Phase */}
              {phase === "waiting" && (
                <div className="flex flex-col items-center justify-center text-center w-full">
                  <div className="text-xl font-semibold mb-2">
                    Please wait<br />beginning of the new round
                  </div>
                  <div className="w-1/3 h-2 bg-gray-700 rounded">
                    <div
                      className="h-2 bg-green-500 rounded"
                      style={{
                        width: `${progress}%`,
                        transition: "width 100ms linear",
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Running Phase */}
              {phase === "running" && (
                <AviatorAnimation
                  start={true}
                  crashPoint={crashPoint}
                  onCrash={() => setPhase("crashed")}
                />
              )}

              {/* Crashed Phase */}
              {phase === "crashed" && (
                <div className="flex flex-col items-center justify-center text-center w-full">
                  <div className="text-4xl font-bold text-red-500 mb-2">
                    Flew away. Try more
                  </div>
                  <div className="w-1/3 h-2 bg-gray-700 rounded">
                    <div
                      className="h-2 bg-red-500 rounded"
                      style={{
                        width: `${progress}%`,
                        transition: "width 100ms linear",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Betting Controls */}
            <BettingControls />
          </div>
        </div>
      </div>
    </div>
  );
}
