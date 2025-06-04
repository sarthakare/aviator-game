import React, { useEffect, useState } from "react";
import planeImage from "../assets/image.png"; // Red airplane silhouette

export default function AviatorAnimation({ multiplier, crashPoint }) {
  const [pathPoints, setPathPoints] = useState([]);
  const [planePosition, setPlanePosition] = useState({ x: 0, y: 100 });

  useEffect(() => {
    const points = [];
    const steps = 800;
    const maxX = 80;

    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * maxX;
      const expGrowth = Math.min(Math.exp(x * 0.045), 100);
      const y = 100 - expGrowth;
      points.push({ x, y });
    }

    setPathPoints(points);
    if (points.length) setPlanePosition(points[0]);
  }, []);

  const coveredPathPoints = React.useMemo(() => {
    if (!pathPoints.length || multiplier <= 0) return [];

    const index = Math.floor((multiplier / crashPoint) * pathPoints.length);
    const limitedIndex = Math.min(index, pathPoints.length - 1);
    return pathPoints.slice(0, limitedIndex + 1);
  }, [pathPoints, multiplier, crashPoint]);

  useEffect(() => {
    if (coveredPathPoints.length) {
      setPlanePosition(coveredPathPoints[coveredPathPoints.length - 1]);
    }
  }, [coveredPathPoints]);

  const coveredPathString = coveredPathPoints.map(p => `${p.x},${p.y}`).join(" ");

  return (
    <div className="relative w-full px-2 sm:px-5">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-black z-0 rounded-xl" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:20px_20px] opacity-20 z-0 rounded-xl" />

      {/* Multiplier display */}
      <div className="absolute top-[20%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-white text-3xl sm:text-5xl md:text-6xl font-extrabold text-center">
        {multiplier.toFixed(2)}x
      </div>

      {/* SVG graph */}
      <svg
        viewBox="0 0 80 100"
        className="w-full h-[250px] sm:h-[350px] md:h-[400px] z-10 relative"
        preserveAspectRatio="none"
      >
        {/* Polygon fill */}
        {multiplier > 0 && coveredPathPoints.length > 1 && (
          <polygon
            points={`0,100 ${coveredPathString} ${planePosition.x},100`}
            fill="rgba(255,0,102,0.3)"
          />
        )}

        {/* Line path */}
        {multiplier > 0 && (
          <polyline
            fill="none"
            stroke="#FF0066"
            strokeWidth="1.5"
            points={coveredPathString}
          />
        )}

        {/* Plane icon */}
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
