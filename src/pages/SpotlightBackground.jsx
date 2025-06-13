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
      <div className="spotlight-group-left">
        <div
          className="spotlight"
          style={{ "--start-angle": "-65deg", "--end-angle": "65deg" }}
        />
        <div
          className="spotlight"
          style={{ "--start-angle": "-50deg", "--end-angle": "70deg" }}
        />
        <div
          className="spotlight"
          style={{ "--start-angle": "-35deg", "--end-angle": "75deg" }}
        />
      </div>

      {/* Right group */}
      <div className="spotlight-group-right">
        <div
          className="spotlight"
          style={{ "--start-angle": "65deg", "--end-angle": "-65deg" }}
        />
        <div
          className="spotlight"
          style={{ "--start-angle": "50deg", "--end-angle": "-70deg" }}
        />
        <div
          className="spotlight"
          style={{ "--start-angle": "35deg", "--end-angle": "-75deg" }}
        />
      </div>

      {/* Grid lines */}
      {/* Horizontal line at 10vh from bottom */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: "2px",
          background: "rgba(255,255,255,0.5)",
          bottom: "3vh",
          zIndex: 2,
        }}
      />

      {/* Vertical lines (5 as example, spaced evenly) */}
      {[0.1,0.2, 0.3,0.4, 0.5,0.6, 0.7,0.8, 0.9].map((left, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${left * 100}%`,
            width: "2px",
            height: "3vh",
            background: "rgba(255,255,255,0.5)",
            bottom: 0, // Start from the bottom
            transform: "translateX(-1px)",
            zIndex: 2,
          }}
        />
      ))}
    </div>
  );
}
