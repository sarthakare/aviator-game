import React, { useEffect, useState } from "react";
import planeImage from "../assets/image.png"; // Replace with red airplane silhouette

export default function AviatorAnimation({ multiplier, crashPoint }) {
  const [pathPoints, setPathPoints] = useState([]);
  const [planePosition, setPlanePosition] = useState({ x: 0, y: 100 });

  useEffect(() => {
    const points = [];
    const steps = 800;
    const maxX = 80;

    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * maxX;
      const expGrowth = Math.min(Math.exp(x * 0.045), 100); // steeper exponential, clamp to 100
      const y = 100 - expGrowth;
      points.push({ x, y });
    }

    setPathPoints(points);
  }, []);

  useEffect(() => {
    if (!pathPoints.length) return;

    const index = Math.floor((multiplier / crashPoint) * pathPoints.length);
    if (index >= 0 && index < pathPoints.length) {
      setPlanePosition(pathPoints[index]);
    }
  }, [multiplier, crashPoint, pathPoints]);

  const pathString = pathPoints.map(p => `${p.x},${p.y}`).join(" ");

  return (
    <div className="w-full relative p-5">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-black z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:20px_20px] opacity-20 z-0" />

      {/* Multiplier display */}
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-6xl font-extrabold z-10">
        {multiplier.toFixed(2)}x
      </div>

      {/* SVG Chart */}
      <svg
        viewBox="0 0 80 100"
        className="w-full h-[400px] z-10 relative"
        preserveAspectRatio="none"
      >
        {/* Background fill under the curve */}
        <polygon
          points={`0,100 ${pathString} ${planePosition.x},100`}
          fill="rgba(255,0,102,0.3)"
        />

        {/* Path Line */}
        <polyline
          fill="none"
          stroke="#FF0066"
          strokeWidth="1.5"
          points={pathString}
        />

        {/* Plane Image */}
        <image
          href={planeImage}
          x={planePosition.x}
          y={planePosition.y - 15}
          width="20"
          height="20"
        />
      </svg>
    </div>
  );
}
