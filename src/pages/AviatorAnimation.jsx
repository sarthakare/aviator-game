import React, { useEffect, useState } from "react";
import planeImage from "../assets/image.png";

export default function AviatorAnimation({ multiplier, crashPoint }) {
	const [pathPoints, setPathPoints] = useState([]);
	const [planePosition, setPlanePosition] = useState({ x: 0, y: 100 });

	useEffect(() => {
		const points = [];
		const steps = 300;
		for (let i = 0; i <= steps; i++) {
			const x = (i / steps) * 100;
			const y = 100 - Math.min(100, Math.exp(x * 0.05)); // inverted exponential
			points.push({ x, y });
		}
		setPathPoints(points);
	}, []);

	useEffect(() => {
		if (!pathPoints.length) return;

		const i = Math.floor((multiplier / crashPoint) * pathPoints.length);
		if (i >= 0 && i < pathPoints.length) {
			setPlanePosition(pathPoints[i]);
		}
	}, [multiplier, crashPoint, pathPoints]);

	return (
		<div className="w-full h-full">
			<svg
				viewBox="-5 -5 110 110"
				className="w-full h-[400px] bg-gray-300 shadow-lg rounded-lg"
				preserveAspectRatio="none"
			>
				{/* Axes */}
				<line x1="0" y1="100" x2="100" y2="100" stroke="black" strokeWidth="0.3" />
				<line x1="0" y1="100" x2="0" y2="0" stroke="black" strokeWidth="0.3" />

				{/* Exponential Path */}
				<polyline
					fill="none"
					stroke="blue"
					strokeWidth="1.5"
					points={pathPoints.map((p) => `${p.x},${p.y}`).join(" ")}
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
