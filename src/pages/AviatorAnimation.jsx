import { useRef, useEffect, useState } from "react";

// Import your plane image (adjust the path as needed)
import planeImg from "../assets/plainer.png";

export default function AviatorAnimation() {
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
        const t = i / steps; // t from 0 to 1
        const x = t * maxX;
        // Start from maxY and curve upward toward maxY / 2
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
    const img = new window.Image();
    img.src = planeImg;

    let index = 0;
    let animationId;
    let lastIndex = curvePoints.length - 1;
    let startTime = null;

    function draw(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // === Draw axes ===
      ctx.strokeStyle = "#888";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 1);
      ctx.lineTo(canvas.width, canvas.height - 1);
      ctx.moveTo(1, 0);
      ctx.lineTo(1, canvas.height);
      ctx.stroke();

      // === Axis labels ===
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
      for (let i = 1; i <= index; i++) {
        ctx.lineTo(curvePoints[i].x, curvePoints[i].y);
      }
      ctx.strokeStyle = "#FF0066";
      ctx.lineWidth = 2;
      ctx.stroke();

      // === Draw plane + animated propeller line ===
      const pt = curvePoints[index];
      const imgWidth = 200;
      const imgHeight = 100;

      if (img.complete) {
        ctx.drawImage(
          img,
          pt.x - imgWidth / 2,
          pt.y - imgHeight / 2,
          imgWidth,
          imgHeight
        );

        // === Draw animated front line (propeller - I) ===
        // === Draw animated propeller (figure-8 with two circles) ===
        // === Draw animated propeller (figure-8 with vertical ellipses) ===
        const propellerX = pt.x + 75;
        const propellerY = pt.y - 15;
        const maxRadiusY = 17; // vertical (taller)
        const maxRadiusX = 3; // horizontal (narrower)
        const scale = Math.abs(Math.sin(elapsed * Math.PI * 4)); // 2 cycles/sec
        const radiusY = maxRadiusY * scale;
        const radiusX = maxRadiusX * scale;

        ctx.fillStyle = "#FF0066";

        // Top vertical ellipse
        ctx.beginPath();
        ctx.ellipse(
          propellerX, // x-center
          propellerY - radiusY * 1.5, // y-center (above plane center)
          radiusX, // horizontal axis (X)
          radiusY, // vertical axis (Y)
          0, // rotation
          0,
          2 * Math.PI
        );
        ctx.fill();

        // Bottom vertical ellipse
        ctx.beginPath();
        ctx.ellipse(
          propellerX,
          propellerY + radiusY * 2, // below plane center
          radiusX,
          radiusY,
          0,
          0,
          2 * Math.PI
        );
        ctx.fill();

        // === Draw second animated propeller (mirrored/offset) ===
        const propellerX2 = pt.x + 60; // slightly to the left of the first set
        const propellerY2 = pt.y + 7 ;
        const maxRadiusY2 = 17; // vertical (taller)
        const maxRadiusX2 = 3; // horizontal (narrower)
        const scale2 = Math.abs(Math.sin(elapsed * Math.PI * 4)); // 2 cycles/sec
        const radiusY2 = maxRadiusY2 * scale2 ;
        const radiusX2= maxRadiusX2 * scale2;

        ctx.fillStyle = "#FF0066";

        // Top vertical ellipse (second propeller)
        ctx.beginPath();
        ctx.ellipse(
          propellerX2,
          propellerY2 - radiusY * 1.5,
          radiusX2,
          radiusY2,
          0,
          0,
          2 * Math.PI
        );
        ctx.fill();

        // Bottom vertical ellipse (second propeller)
        ctx.beginPath();
        ctx.ellipse(
          propellerX2,
          propellerY2 + radiusY * 1.5,
          radiusX2,
          radiusY2,
          0,
          0,
          2 * Math.PI
        );
        ctx.fill();
      }

      // === Only increment index if animation not finished ===
      if (index < lastIndex) {
        index++;
      }

      animationId = requestAnimationFrame(draw);
    }

    img.onload = () => requestAnimationFrame(draw);
    if (img.complete) requestAnimationFrame(draw);

    return () => cancelAnimationFrame(animationId);
  }, [curvePoints]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <canvas ref={canvasRef} className="w-full h-full bg-transparent" />
    </div>
  );
}
