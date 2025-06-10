import { useEffect, useRef } from "react";
import planeImg from "../assets/plane1.png"; // Import your plane image
import blastImg from "../assets/blast.png"; // Import your blast image

export default function AviatorCanvas({ start, crashPoint }) {
  const canvasRef = useRef(null);
  const planeRef = useRef(new Image());
  planeRef.current.src = planeImg;
  const blastRef = useRef(new Image());
  blastRef.current.src = blastImg;

  const maxMultiplier = 10;
  const maxX = 60;

  const getY = (m) => {
    return 100 - Math.min(Math.exp(m * 0.4), 100);
  };

  useEffect(() => {
    let frameId;
    let value = 0;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(canvas.width / 80, canvas.height / 100);

      // Background
      ctx.fillStyle = "rgba(20,20,50,0.6)";
      ctx.fillRect(0, 0, 80, 100);

      // Path
      ctx.beginPath();
      ctx.moveTo(0, 100);
      for (let m = 0; m <= value; m += 0.05) {
        const x = (m / maxMultiplier) * maxX;
        const y = getY(m);
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "#FF0066";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Fill under the path
      ctx.lineTo((value / maxMultiplier) * maxX, 100);
      ctx.closePath();
      ctx.fillStyle = "rgba(255,0,102,0.3)";
      ctx.fill();

      const planeX = (value / maxMultiplier) * maxX;
      const planeY = getY(value);
      const crashed = value >= crashPoint;

      // Draw plane or blast
      if (crashed) {
        ctx.drawImage(blastRef.current, planeX - 3, planeY - 3, 6, 16); // adjust as needed
      } else {
        ctx.drawImage(planeRef.current, planeX - 3, planeY - 3, 6, 6); // adjust as needed
      }

      // Multiplier Text
      ctx.fillStyle = crashed ? "#FF0000" : "#FFFFFF";
      ctx.font = "bold 6px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${value.toFixed(2)}x`, 40, 20);

      ctx.restore();

      value += 0.01;

      if (!crashed) {
        frameId = requestAnimationFrame(draw);
      }
    };

    if (start) {
      frameId = requestAnimationFrame(draw);
    }

    return () => cancelAnimationFrame(frameId);
  }, [start, crashPoint]);

  // Clear on stop
  useEffect(() => {
    if (!start) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, [start]);

  return (
    <div className="relative w-full overflow-hidden">
      <canvas
        ref={canvasRef}
        width={1000}
        height={800}
        className="w-full h-[250px] sm:h-[350px] md:h-[400px] rounded-lg bg-transparent"
      />
    </div>
  );
}
