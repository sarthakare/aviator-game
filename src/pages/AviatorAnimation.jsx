import { useEffect, useRef } from "react";
import planeImg from "../assets/plane-without-propeller.png";
import blastImg from "../assets/blast.png";

export default function AviatorCanvas({ start, crashPoint, onCrash }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const planeImage = useRef(new Image());
  const blastImage = useRef(new Image());

  const animationId = useRef(null);
  const delayTimeout = useRef(null);
  const crashed = useRef(false);
  const maxMultiplier = 10;
  const maxX = 60;

  const getY = (m) => 100 - Math.min(Math.exp(m * 0.4), 100);

  useEffect(() => {
    planeImage.current.src = planeImg;
    blastImage.current.src = blastImg;
  }, []);

  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      const parent = containerRef.current;
      if (canvas && parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  useEffect(() => {
    if (!start) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let value = 0;
    crashed.current = false;

    const drawFrame = (wait = false) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(canvas.width / 80, canvas.height / 100);

      const planeX = (value / maxMultiplier) * maxX;
      const time = performance.now() / 1000;
      const planeY = getY(value);

      if (!wait) {
        // Draw path
        ctx.beginPath();
        ctx.moveTo(0, 100);
        for (let m = 0; m <= value; m += 0.05) {
          ctx.lineTo((m / maxMultiplier) * maxX, getY(m));
        }
        ctx.strokeStyle = "#FF0066";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.lineTo(planeX, 100);
        ctx.closePath();
        ctx.fillStyle = "rgba(255,0,102,0.3)";
        ctx.fill();
      }

      const drawFlame = () => {
        const full = 8;
        const half = (full / 2) * Math.abs(Math.sin(time * Math.PI * 3));
        const centerY = planeY - 12 + full / 2;
        ctx.strokeStyle = "#aaa";
        ctx.lineWidth = 0.2;
        ctx.beginPath();
        ctx.moveTo(planeX + 7, centerY - half - 2);
        ctx.lineTo(planeX + 7.25, centerY + half);
        ctx.stroke();
      };

      const isCrash = value >= crashPoint;
      if (isCrash) {
        ctx.drawImage(blastImage.current, planeX, planeY - 13, 6, 16);
        if (!crashed.current) {
          setTimeout(() => {
            crashed.current = true;
            onCrash();
          }, 5000);
        }
      } else {
        ctx.drawImage(planeImage.current, planeX + 1, planeY - 15, 6, 16);
        drawFlame();
      }

      ctx.fillStyle = isCrash ? "#FF0000" : "#FFFFFF";
      ctx.font = "bold 6px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${value.toFixed(2)}x`, 40, 20);

      ctx.restore();

      if (!isCrash && !wait) {
        value += 0.025; // Increased speed of multiplier
        animationId.current = requestAnimationFrame(() => drawFrame(false));
      } else if (wait) {
        animationId.current = requestAnimationFrame(() => drawFrame(true));
      }
    };

    // Step 1: idle animation
    drawFrame(true);

    // Step 2: after delay, start real animation
    delayTimeout.current = setTimeout(() => {
      cancelAnimationFrame(animationId.current);
      animationId.current = requestAnimationFrame(() => drawFrame(false));
    }, 5000);

    return () => {
      cancelAnimationFrame(animationId.current);
      clearTimeout(delayTimeout.current);
    };
  }, [start, crashPoint, onCrash]);

  useEffect(() => {
    if (!start) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [start]);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full bg-transparent"
      />
    </div>
  );
}
