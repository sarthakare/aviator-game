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
        const next = prev + 0.05; // slower smooth increment starting from 0
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
    crashPoint.current = parseFloat((Math.random() * 10).toFixed(2)); // 0.00x to 10.00x crash point
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
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-purple-800 flex flex-col items-center justify-center p-4 text-white">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
        🚀 Aviator Game
      </h1>

      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 text-center">
        <div className="mb-6 text-sm text-gray-300">{message}</div>

        <div className="flex-col justify-center gap-4">
          <div className="p-2">
            <WebGLStarter
              multiplier={multiplier}
              crashPoint={crashPoint.current}
              isRunning={isRunning}
            />
          </div>

          {!isRunning && (
            <button
              onClick={startGame}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-xl shadow"
            >
              Start
            </button>
          )}
          {isRunning && !isCashedOut && (
            <button
              onClick={handleCashOut}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-2 rounded-xl shadow"
            >
              Cash Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
