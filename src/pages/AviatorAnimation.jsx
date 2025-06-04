import React, { useEffect, useState } from "react";
import planeImage from "../assets/plane.png";
import blastImage from "../assets/blast.png";
import SpotlightBackground from "./SpotlightBackground"; // Adjust path accordingly

export default function AviatorAnimation({ multiplier, crashPoint }) {
  const [pathPoints, setPathPoints] = useState([]);
  const [planePosition, setPlanePosition] = useState({ x: 0, y: 100 });
  const [isCrashed, setIsCrashed] = useState(false);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);

  const maxMultiplier = 10.0; // Max possible multiplier
  const maxX = 60; // Max X value for the SVG

  // Generate full path up to maxMultiplier
  useEffect(() => {
    const points = [];
    const steps = 800;

    for (let i = 0; i <= steps; i++) {
      const ratio = i / steps;
      const x = ratio * maxX;
      const virtualMultiplier = ratio * maxMultiplier;
      const y = 100 - Math.min(Math.exp(virtualMultiplier * 0.4), 100); // Adjusted for steeper curve
      points.push({ x, y });
    }

    setPathPoints(points);
    if (points.length) setPlanePosition(points[0]);
  }, []);

  // Calculate path covered up to current multiplier
  const coveredPathPoints = React.useMemo(() => {
    if (!pathPoints.length || multiplier <= 0) return [];

    const progressRatio = Math.min(multiplier / maxMultiplier, 1); // Clamp to 1.0
    const index = Math.floor(progressRatio * pathPoints.length);
    const limitedIndex = Math.min(index, pathPoints.length - 1);
    return pathPoints.slice(0, limitedIndex + 1);
  }, [pathPoints, multiplier]);

  // Update plane position
  useEffect(() => {
    if (!coveredPathPoints.length) return;

    const lastPoint = coveredPathPoints[coveredPathPoints.length - 1];

    if (lastPoint.x >= maxX) {
      setHasReachedEnd(true);
    }

    setPlanePosition((prev) => {
      if (hasReachedEnd) {
        return {
          x: maxX,
          y: Math.min(prev.y + 0.5, 100), // Simulate falling
        };
      }
      return lastPoint;
    });

    if (multiplier >= crashPoint) {
      setIsCrashed(true);
    }
  }, [coveredPathPoints, multiplier, crashPoint, hasReachedEnd]);

  // Reset on restart
  useEffect(() => {
    if (multiplier === 0) {
      setIsCrashed(false);
      setHasReachedEnd(false);
      setPlanePosition({ x: 0, y: 100 });
    }
  }, [multiplier]);

  const coveredPathString = coveredPathPoints
    .map((p) => `${p.x},${p.y}`)
    .join(" ");

  // Bobbing effect for the plane (makes it look like it's flying)
  const bobbing =
    !isCrashed && !hasReachedEnd
      ? Math.sin(multiplier * 6) * 2 // Adjust frequency and amplitude as needed
      : 0;

  return (
    <div className="relative w-full px-2 sm:px-5 overflow-hidden">
      {/* ✨ Spotlight Stage Background */}
      <SpotlightBackground />

      {/* Multiplier Display */}
      <div
        className={`absolute top-[20%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-3xl sm:text-5xl md:text-6xl font-extrabold text-center
          ${isCrashed ? "text-red-500" : "text-white"}`}
      >
        {multiplier.toFixed(2)}x
      </div>

      {/* SVG Graph */}
      <svg
        viewBox="0 0 80 100"
        className="w-full h-[250px] sm:h-[350px] md:h-[400px] z-10 relative"
        preserveAspectRatio="none"
        style={{ marginTop: "2rem", marginBottom: "2rem" }}
      >
        {multiplier > 0 && coveredPathPoints.length > 1 && (
          <polygon
            points={`0,100 ${coveredPathString} ${planePosition.x},100`}
            fill="rgba(255,0,102,0.3)"
          />
        )}

        {multiplier > 0 && (
          <polyline
            fill="none"
            stroke="#FF0066"
            strokeWidth="1.5"
            points={coveredPathString}
          />
        )}

        <image
          href={isCrashed ? blastImage : planeImage}
          x={planePosition.x}
          y={planePosition.y - 15 + bobbing}
          width="15"
          height="15"
        />
      </svg>
    </div>
  );
}
