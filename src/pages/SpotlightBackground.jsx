import React from "react";

export default function SpotlightBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Morning to night breathing gradient */}
      <div
        className="absolute inset-0 animate-breathingSky"
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
      {/* Horizontal line at 10vh from bottom with glow effect */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: "2px",
          background: "rgba(255,255,255,0.8)",
          bottom: "7vh",
          zIndex: 2,
          boxShadow:
            "0 0 24px 6px rgba(255,255,255,0.3), 0 0 48px 12px rgba(100,200,255,0.1)",
        }}
      />

      {/* Vertical lines (now 101, with 3D perspective effect, edge lines taller to touch horizontal line, opacity depth effect) */}
      {Array.from({ length: 101 }).map((_, i) => {
        const count = 101;
        const center = Math.floor(count / 2);
        const left = i < center;
        const right = i > center;
        const percent = i / (count - 1);
        // Calculate tilt: center is 0deg, farther from center = more tilt
        let tilt = 0;
        const maxTilt = 55; // degrees, max tilt at edges
        if (left) {
          tilt = maxTilt * ((center - i) / center);
        } else if (right) {
          tilt = -maxTilt * ((i - center) / center);
        }

        // Calculate height so that the top of the line touches the horizontal line at 7vh from bottom
        const tiltRad = Math.abs(tilt) * (Math.PI / 180);
        const baseHeight = 7; // in vh
        const height = `${baseHeight / Math.cos(tiltRad)}vh`;

        // Opacity: 1 (center) to 0.5 (edges)
        const distanceFromCenter = Math.abs(i - center) / center;
        const opacity = 1 - 0.9 * distanceFromCenter; // 1 at center, 0.5 at edges

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${percent * 100}%`,
              width: "2px",
              height,
              background: `rgba(255,255,255,${opacity})`,
              bottom: 0,
              transform: `translateX(-1px) rotate(${tilt}deg)`,
              transformOrigin: "bottom",
              zIndex: 2,
            }}
          />
        );
      })}
    </div>
  );
}
