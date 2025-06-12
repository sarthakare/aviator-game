import React from "react";

export default function SpotlightBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Night sky gradient */}
      <div
        className="absolute inset-0 animate-dayToNightGradient"
        style={{
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      />

      {/* Stars - distributed randomly with SVG */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1, pointerEvents: "none" }}
      >
        {[
          { cx: 5, cy: 10 },
          { cx: 15, cy: 50 },
          { cx: 25, cy: 30 },
          { cx: 35, cy: 70 },
          { cx: 45, cy: 20 },
          { cx: 55, cy: 90 },
          { cx: 65, cy: 40 },
          { cx: 75, cy: 60 },
          { cx: 85, cy: 15 },
          { cx: 95, cy: 80 },
          { cx: 50, cy: 50 },
          { cx: 20, cy: 85 },
          { cx: 80, cy: 25 },
          { cx: 40, cy: 10 },
        ].map(({ cx, cy }, i) => {
          const size = 1.5 + Math.random(); // Bigger radius
          const delay = Math.random() * 3; // Desync twinkle

          return (
            <circle
              key={i}
              cx={`${cx}%`}
              cy={`${cy}%`}
              r={size}
              fill="#fff"
              opacity="0.7"
              className="star-twinkle"
              style={{
                animationDelay: `${delay}s`,
              }}
            />
          );
        })}
      </svg>

      {/* Spotlights */}
      {/* Left group */}
      <div style={{ position: "absolute", left: "16%", bottom: 0, zIndex: 2 }}>
        <div
          className="spotlight spotlight-left"
          style={{ left: 0, animationDelay: "0s" }}
        />
        <div
          className="spotlight spotlight-left"
          style={{ left: "2vh", animationDelay: "0.5s" }}
        />
        <div
          className="spotlight spotlight-left"
          style={{ left: "-2vh", animationDelay: "1s" }}
        />
      </div>
      {/* Right group */}
      <div style={{ position: "absolute", right: "16%", bottom: 0, zIndex: 2 }}>
        <div
          className="spotlight spotlight-right"
          style={{ right: 0, animationDelay: "0s" }}
        />
        <div
          className="spotlight spotlight-right"
          style={{ right: "2vh", animationDelay: "0.5s" }}
        />
        <div
          className="spotlight spotlight-right"
          style={{ right: "-2vh", animationDelay: "1s" }}
        />
      </div>
    </div>
  );
}
