import { useState, useEffect } from "react";
import AviatorAnimation from "./AviatorAnimation";
import BettingControls from "./BettingContols";
import PlacedBets from "./PlacedBets";
import SpotlightBackground from "./SpotlightBackground";

export default function AviatorGame() {
  const [phase, setPhase] = useState("waiting"); // "waiting" | "running" | "crashed"
  const [progress, setProgress] = useState(0);
  const crashPoint = 10;

  // Waiting phase logic
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

  // Crashed phase logic
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
    <div className="w-full h-full bg-black text-white">
      {/* Fullscreen Background */}
      <SpotlightBackground />

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        {phase === "waiting" && (
          <div className="text-center space-y-4 w-full max-w-md px-4">
            <div className="text-xl font-semibold">
              Please wait
              <br />
              beginning of the new round
            </div>
            <div className="w-full h-2 bg-gray-700 rounded">
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

        {phase === "running" && (
          <AviatorAnimation
            start={true}
            crashPoint={crashPoint}
            onCrash={() => setPhase("crashed")}
          />
        )}

        {phase === "crashed" && (
          <div className="text-center space-y-4 w-full max-w-md px-4">
            <div className="text-4xl font-bold text-red-500">
              Flew away. Try more
            </div>
            <div className="w-full h-2 bg-gray-700 rounded">
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
    </div>
  );
}
