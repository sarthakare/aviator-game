import { useRef, useEffect, useState } from "react";
import planeImg from "../assets/plainer.png";
import blastImg from "../assets/blast.png";

export default function AviatorAnimation({ crashPoint, onCrash }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [curvePoints, setCurvePoints] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = containerRef.current;

    const resize = () => {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;

      const points = [];
      const steps = 200;
      const maxX = canvas.width / 1.5;
      const maxY = canvas.height;

      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = t * maxX;
        const y = maxY - Math.pow(t, 2) * (maxY / 2);
        points.push({ x, y });
      }

      setCurvePoints(points);
    };

    resize();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    if (curvePoints.length < 2) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const plane = new window.Image();
    plane.src = planeImg;
    const blast = new window.Image();
    blast.src = blastImg;

    let index = 0;
    let animationId;
    let lastIndex = curvePoints.length - 1;
    let startTime = null;
    let waitStart = null;
    const WAIT_SECONDS = 5;
    let crashed = false;
    let crashTime = null;
    let blastTime = null;
    let crashHandled = false;

    // === Multiplier logic ===
    // Map crashPoint (max 10.00) to curvePoints
    const minCrash = 1.0;
    const maxCrash = 25.0;
    const maxX = curvePoints[curvePoints.length - 1].x;
    const crashX = ((Math.max(minCrash, Math.min(maxCrash, crashPoint)) - minCrash) / (maxCrash - minCrash)) * maxX;
    const crashIndex = curvePoints.findIndex((pt) => pt.x >= crashX);
    const actualCrashIndex = crashIndex === -1 ? lastIndex : crashIndex;

    // Helper to draw animated propellers
    function drawPropellers(ctx, planeX, planeY, elapsed) {
      const propellerX = planeX + 100;
      const propellerY = planeY - 15;
      const propellerX2 = planeX + 75;
      const propellerY2 = planeY + 7;

      const maxRadiusY = 17;
      const maxRadiusX = 3;
      const scale = Math.abs(Math.sin(elapsed * Math.PI * 4));
      const radiusY = maxRadiusY * scale;
      const radiusX = maxRadiusX * scale;

      ctx.fillStyle = "#FF0066";

      // Top ellipse
      ctx.beginPath();
      ctx.ellipse(
        propellerX,
        propellerY - radiusY * 1.5,
        radiusX,
        radiusY,
        0,
        0,
        2 * Math.PI
      );
      ctx.fill();

      // Bottom ellipse
      ctx.beginPath();
      ctx.ellipse(
        propellerX,
        propellerY + radiusY * 2,
        radiusX,
        radiusY,
        0,
        0,
        2 * Math.PI
      );
      ctx.fill();

      // Second mirrored propeller
      ctx.beginPath();
      ctx.ellipse(
        propellerX2,
        propellerY2 - radiusY * 1.5,
        radiusX,
        radiusY,
        0,
        0,
        2 * Math.PI
      );
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(
        propellerX2,
        propellerY2 + radiusY * 1.5,
        radiusX,
        radiusY,
        0,
        0,
        2 * Math.PI
      );
      ctx.fill();
    }

    const draw = (timestamp) => {
      if (!waitStart) waitStart = timestamp;
      if (!startTime) startTime = timestamp;
      const waitElapsed = (timestamp - waitStart) / 1000;
      const flyElapsed = (timestamp - startTime) / 1000;
      const isWaiting = waitElapsed < WAIT_SECONDS;
      const countdownValue = Math.max(0, WAIT_SECONDS - Math.floor(waitElapsed));

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Axes
      ctx.strokeStyle = "#888";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 1);
      ctx.lineTo(canvas.width, canvas.height - 1);
      ctx.moveTo(1, 0);
      ctx.lineTo(1, canvas.height);
      ctx.stroke();

      // Labels
      ctx.fillStyle = "#aaa";
      ctx.font = "10px Arial";
      ctx.textAlign = "center";
      const tickSpacing = 100;
      const labelOffset = 15;
      for (let x = 0; x <= canvas.width; x += tickSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, canvas.height - 5);
        ctx.lineTo(x, canvas.height + 5);
        ctx.stroke();
        ctx.fillText(`${x}`, x, canvas.height - labelOffset);
      }
      ctx.textAlign = "right";
      for (let y = 0; y <= canvas.height; y += tickSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(5, y);
        ctx.stroke();
        ctx.fillText(`${canvas.height - y}`, 25, y + 3);
      }

      // === Draw curve path ===
      ctx.beginPath();
      ctx.moveTo(curvePoints[0].x, curvePoints[0].y);
      for (let i = 1; i <= (isWaiting ? 0 : index); i++) {
        ctx.lineTo(curvePoints[i].x, curvePoints[i].y);
      }
      ctx.strokeStyle = "#FF0066";
      ctx.lineWidth = 4;
      ctx.stroke();

      // === Fill area below the graph with transparency ===
      if ((isWaiting ? 0 : index) > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(curvePoints[0].x, curvePoints[0].y);
        for (let i = 1; i <= (isWaiting ? 0 : index); i++) {
          ctx.lineTo(curvePoints[i].x, curvePoints[i].y);
        }
        // Go down to bottom of canvas from last point
        ctx.lineTo(curvePoints[Math.max(1, (isWaiting ? 0 : index))].x, ctx.canvas.height);
        // Go to bottom left
        ctx.lineTo(curvePoints[0].x, ctx.canvas.height);
        ctx.closePath();
        ctx.fillStyle = "rgba(255, 0, 102, 0.15)"; // semi-transparent fill
        ctx.fill();
        ctx.restore();
      }

      // Plane/blast logic
      const imgWidth = 250;
      const imgHeight = 100;
      let planeX, planeY;

      if (isWaiting) {
        planeX = 150;
        planeY = canvas.height - 50 + Math.sin(waitElapsed * 2) * 10;
      } else {
        const pt = curvePoints[index];
        planeX = pt.x + 150;
        planeY = pt.y - 50 + Math.sin(flyElapsed * 2) * 10;
      }

      // === Crash detection at actualCrashIndex ===
      if (!isWaiting && index >= actualCrashIndex && !crashed) {
        crashed = true;
        crashTime = performance.now();
      }

      // === Multiplier calculation ===
      // Map index (0 to actualCrashIndex) to multiplier (0.00x to crashPoint x)
      let multiplier = 0;
      if (!isWaiting) {
        const progress = Math.min(index, actualCrashIndex) / actualCrashIndex;
        multiplier = progress * crashPoint;
        if (multiplier > crashPoint) multiplier = crashPoint;
      }

      // === Draw multiplier ===
      if (!isWaiting) {
        ctx.save();
        ctx.font = "bold 96px Arial";
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center"; // Center align
        ctx.shadowColor = "#FF0066";
        ctx.shadowBlur = 10;
        // Place at center of canvas
        ctx.fillText(`${multiplier.toFixed(2)}x`, canvas.width / 2, 80);
        ctx.restore();
      }

      // === Plane/blast drawing logic ===
      if (!isWaiting && index >= actualCrashIndex) {
        const pt = curvePoints[actualCrashIndex];
        const now = performance.now();

        // Show plane for 5 seconds after crash
        if (crashTime && now - crashTime < 5000) {
          if (plane.complete) {
            ctx.drawImage(
              plane,
              pt.x + 150 - imgWidth / 2,
              pt.y - 50 - imgHeight / 2 + Math.sin((now - crashTime) / 500 * 2) * 10,
              imgWidth,
              imgHeight
            );
            drawPropellers(ctx, pt.x + 150, pt.y - 50 + Math.sin((now - crashTime) / 500 * 2) * 10, (now - crashTime) / 1000);
          }
        }
        // Then show blast for 5 seconds
        else if (crashTime && now - crashTime < 10000) {
          if (!blastTime) blastTime = now;
          if (blast.complete) {
            ctx.drawImage(
              blast,
              pt.x + 100 - imgWidth / 2,
              pt.y - 50 - imgHeight / 2,
              imgWidth,
              imgHeight
            );
          }
        }
        // After blast, call onCrash(true) once
        else if (!crashHandled) {
          crashHandled = true;
          if (typeof onCrash === "function") onCrash(true);
        }
      } else if (plane.complete) {
        ctx.drawImage(
          plane,
          planeX - imgWidth / 2,
          planeY - imgHeight / 2,
          imgWidth,
          imgHeight
        );
        drawPropellers(ctx, planeX, planeY, isWaiting ? waitElapsed : flyElapsed);
      }

      // Draw countdown in waiting phase
      if (isWaiting && countdownValue > 0) {
        ctx.save();
        ctx.font = "bold 96px Arial";
        ctx.fillStyle = "#FF0066";
        ctx.textAlign = "center";
        ctx.fillText(countdownValue, canvas.width / 2, canvas.height / 2);
        ctx.restore();
      }

      // Animate
      if (isWaiting) {
        animationId = requestAnimationFrame(draw);
      } else {
        if (index < actualCrashIndex) index++;
        animationId = requestAnimationFrame(draw);
      }
    };

    plane.onload = () => requestAnimationFrame(draw);
    if (plane.complete) requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [curvePoints, onCrash, crashPoint]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <canvas ref={canvasRef} className="w-full h-full bg-transparent" />
    </div>
  );
}
