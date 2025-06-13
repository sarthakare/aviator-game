import { useEffect, useRef } from "react";
import planeImg from "../assets/plane-without-propeller.png";
import blastImg from "../assets/blast.png";
import SpotlightBackground from "./SpotlightBackground";

export default function AviatorCanvas({ start, crashPoint, onCrash }) {
  const canvasRef = useRef(null);
  const planeRef = useRef(new Image());
  const blastRef = useRef(new Image());
  const hasCrashedRef = useRef(false);
  const timeoutRef = useRef(null);
  const frameIdRef = useRef(null);
  const waitingFrameIdRef = useRef(null);

  const maxMultiplier = 10;
  const maxX = 60;

  const getY = (m) => {
    return 100 - Math.min(Math.exp(m * 0.4), 100);
  };

  // Load images once
  useEffect(() => {
    planeRef.current.src = planeImg;
    blastRef.current.src = blastImg;
  }, []);

  useEffect(() => {
    if (!start) return;

    let value = 0;
    hasCrashedRef.current = false;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const drawWaitingFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(canvas.width / 80, canvas.height / 100);

      const planeX = (value / maxMultiplier) * maxX;
      const planeY = getY(value);
      ctx.drawImage(planeRef.current, planeX + 1, planeY - 15, 6, 16);

      const time = performance.now() / 1000;
      const fullHeight = 8;
      const halfHeight =
        (fullHeight / 2) * Math.abs(Math.sin(time * Math.PI * 3));
      const centerY = planeY - 12 + fullHeight / 2;

      ctx.strokeStyle = "#aaa";
      ctx.lineWidth = 0.2;
      ctx.beginPath();
      ctx.moveTo(planeX + 7, centerY - halfHeight - 2);
      ctx.lineTo(planeX + 7.25, centerY + halfHeight);
      ctx.stroke();

      ctx.restore();

      waitingFrameIdRef.current = requestAnimationFrame(drawWaitingFrame);
    };

    // Start idle plane animation (before real animation starts)
    if (planeRef.current.complete) {
      drawWaitingFrame();
    } else {
      planeRef.current.onload = drawWaitingFrame;
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(canvas.width / 80, canvas.height / 100);

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

      ctx.lineTo((value / maxMultiplier) * maxX, 100);
      ctx.closePath();
      ctx.fillStyle = "rgba(255,0,102,0.3)";
      ctx.fill();

      const planeX = (value / maxMultiplier) * maxX;
      const planeY = getY(value);
      const crashed = value >= crashPoint;

      if (crashed) {
        ctx.drawImage(blastRef.current, planeX, planeY - 13, 6, 16);

        if (!hasCrashedRef.current) {
          hasCrashedRef.current = true;
          setTimeout(() => {
            onCrash?.();
          }, 5000);
        }
      } else {
        ctx.drawImage(planeRef.current, planeX + 1, planeY - 15, 6, 16);

        const time = performance.now() / 1000;
        const fullHeight = 8;
        const halfHeight =
          (fullHeight / 2) * Math.abs(Math.sin(time * Math.PI * 3));
        const centerY = planeY - 12 + fullHeight / 2;

        ctx.strokeStyle = "#aaa";
        ctx.lineWidth = 0.2;
        ctx.beginPath();
        ctx.moveTo(planeX + 7, centerY - halfHeight - 2);
        ctx.lineTo(planeX + 7.25, centerY + halfHeight);
        ctx.stroke();
      }

      ctx.fillStyle = crashed ? "#FF0000" : "#FFFFFF";
      ctx.font = "bold 6px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${value.toFixed(2)}x`, 40, 20);

      ctx.restore();

      value += 0.01;
      if (!crashed) {
        frameIdRef.current = requestAnimationFrame(draw);
      }
    };

    // Delay 5s, then start main animation and stop waiting animation
    timeoutRef.current = setTimeout(() => {
      cancelAnimationFrame(waitingFrameIdRef.current);
      frameIdRef.current = requestAnimationFrame(draw);
    }, 5000);

    return () => {
      clearTimeout(timeoutRef.current);
      cancelAnimationFrame(frameIdRef.current);
      cancelAnimationFrame(waitingFrameIdRef.current);
    };
  }, [start, crashPoint, onCrash]);

  useEffect(() => {
    if (!start) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, [start]);

  return (
    <div className="relative w-full overflow-hidden">
      <SpotlightBackground />
      <canvas
        ref={canvasRef}
        width={1000}
        height={800}
        className="w-full h-[250px] sm:h-[350px] md:h-[400px] rounded-lg bg-transparent z-10 relative"
      />
    </div>
  );
}
