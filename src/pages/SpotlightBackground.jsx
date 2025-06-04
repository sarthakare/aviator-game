import React from "react";

export default function SpotlightBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Night sky gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at top, #232946 60%, #0f172a 100%)",
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
          { cx: 5, cy: 10, r: 0.6, opacity: 0.8 },
          { cx: 15, cy: 50, r: 0.7, opacity: 0.6 },
          { cx: 25, cy: 30, r: 0.5, opacity: 0.7 },
          { cx: 35, cy: 70, r: 0.8, opacity: 0.8 },
          { cx: 45, cy: 20, r: 0.6, opacity: 0.9 },
          { cx: 55, cy: 90, r: 0.5, opacity: 0.7 },
          { cx: 65, cy: 40, r: 0.7, opacity: 0.8 },
          { cx: 75, cy: 60, r: 0.6, opacity: 0.6 },
          { cx: 85, cy: 15, r: 0.9, opacity: 0.7 },
          { cx: 95, cy: 80, r: 0.5, opacity: 0.8 },
          { cx: 50, cy: 50, r: 0.4, opacity: 0.5 },
          { cx: 20, cy: 85, r: 0.6, opacity: 0.7 },
          { cx: 80, cy: 25, r: 0.7, opacity: 0.9 },
          { cx: 40, cy: 10, r: 0.5, opacity: 0.6 },
        ].map(({ cx, cy, r, opacity }, i) => (
          <circle key={i} cx={`${cx}%`} cy={`${cy}%`} r={r} fill="#fff" opacity={opacity} />
        ))}
      </svg>

      {/* Spotlights */}
      {/* Left group */}
      <div style={{ position: "absolute", left: "16%", bottom: 0, zIndex: 2 }}>
        <div className="spotlight spotlight-left" style={{ left: 0, animationDelay: "0s" }} />
        <div className="spotlight spotlight-left" style={{ left: "2vh", animationDelay: "0.5s" }} />
        <div className="spotlight spotlight-left" style={{ left: "-2vh", animationDelay: "1s" }} />
      </div>
      {/* Right group */}
      <div style={{ position: "absolute", right: "16%", bottom: 0, zIndex: 2 }}>
        <div className="spotlight spotlight-right" style={{ right: 0, animationDelay: "0s" }} />
        <div className="spotlight spotlight-right" style={{ right: "2vh", animationDelay: "0.5s" }} />
        <div className="spotlight spotlight-right" style={{ right: "-2vh", animationDelay: "1s" }} />
      </div>
    </div>
  );
}
