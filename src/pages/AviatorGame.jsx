import { useEffect, useRef, useState } from "react";
import WebGLStarter from "./AviatorAnimation";

export default function AviatorGame() {
  const [multiplier, setMultiplier] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isCashedOut, setIsCashedOut] = useState(false);
  const [message, setMessage] = useState("");
  const crashPoint = useRef(0);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setMultiplier((prev) => {
        const next = prev + 0.05;
        return next > 10 ? 10 : parseFloat(next.toFixed(2));
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (multiplier >= crashPoint.current && isRunning) {
      setIsRunning(false);
      if (!isCashedOut) {
        setMessage("💥 Crashed! You lost.");
      }
    }
  }, [multiplier, isRunning, isCashedOut]);

  const startGame = () => {
    crashPoint.current = parseFloat((Math.random() * 25).toFixed(2));
    setMultiplier(0);
    setIsRunning(true);
    setIsCashedOut(false);
    setMessage("");
  };

  const handleCashOut = () => {
    setIsRunning(false);
    setIsCashedOut(true);
    setMessage(`✅ Cashed out at ${multiplier.toFixed(2)}x!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-purple-800 flex flex-col items-center justify-center px-4 py-6 text-white">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-center">
        🚀 Aviator Game
      </h1>

      <div className="w-full max-w-3xl bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20 text-center">
        <div className="mb-4 sm:mb-6 text-sm sm:text-base text-gray-300 min-h-[1.5rem]">
          {message}
        </div>

        <div className="flex flex-col items-center gap-4">
          {/* Graph Area */}
          <div className="w-full">
            <WebGLStarter
              multiplier={multiplier}
              crashPoint={crashPoint.current}
              isRunning={isRunning}
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
            {!isRunning && (
              <button
                onClick={startGame}
                className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-xl shadow transition"
              >
                Start
              </button>
            )}
            {isRunning && !isCashedOut && (
              <button
                onClick={handleCashOut}
                className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded-xl shadow transition"
              >
                Cash Out
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
