"use client";

import React from "react";
import { MapNode } from "../../types/adventureMap";

interface SVGTrailRendererProps {
  nodes: MapNode[];
  canvasWidth: number;
  nodeVerticalPitch?: number;
  topOffset?: number;
  themeColor?: string;
}

export const SVGTrailRenderer: React.FC<SVGTrailRendererProps> = ({
  nodes,
  canvasWidth,
  nodeVerticalPitch = 120,
  topOffset = 60,
  themeColor = "#B45309",
}) => {
  if (!nodes || nodes.length < 2) return null;

  // Calculate (x, y) center coordinates for each node
  const coordinates = nodes.map((node, i) => {
    // Relative oscillation (-1 to +1) scaled to current canvas width
    // Leave safe padding so nodes don't hit viewport edges
    const maxAmplitude = Math.min(canvasWidth * 0.28, 95);
    const x = canvasWidth / 2 + node.xOscillationRatio * maxAmplitude;
    const y = topOffset + i * nodeVerticalPitch;
    return { x, y, status: node.status, id: node.id };
  });

  const totalHeight = topOffset + (nodes.length - 1) * nodeVerticalPitch + 80;

  // Render path segments between each pair of adjacent nodes
  return (
    <svg
      className="absolute top-0 left-0 w-full pointer-events-none overflow-visible"
      style={{ height: `${totalHeight}px` }}
      viewBox={`0 0 ${canvasWidth} ${totalHeight}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        {/* Glowing gradient for active trail segment */}
        <linearGradient id="activeTrailGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#818CF8" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {coordinates.slice(0, -1).map((start, i) => {
        const end = coordinates[i + 1];

        // Smooth S-curve control points (cubic bezier)
        const midY = (start.y + end.y) / 2;
        const d = `M ${start.x} ${start.y} C ${start.x} ${midY}, ${end.x} ${midY}, ${end.x} ${end.y}`;

        // Determine path styling based on completion progression
        const isCompletedPath =
          start.status === "COMPLETED" && (end.status === "COMPLETED" || end.status === "IN_PROGRESS");
        const isInProgressPath = start.status === "IN_PROGRESS" || end.status === "IN_PROGRESS";

        if (isCompletedPath) {
          // Solid golden amber stone road
          return (
            <g key={`trail-seg-${start.id}-${end.id}`}>
              {/* Path base shadow */}
              <path
                d={d}
                fill="none"
                stroke="rgba(15, 23, 42, 0.08)"
                strokeWidth="8"
                strokeLinecap="round"
              />
              {/* Golden paved stone trail */}
              <path
                d={d}
                fill="none"
                stroke={themeColor}
                strokeWidth="4.5"
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </g>
          );
        }

        if (isInProgressPath) {
          // Animated beacon trail
          return (
            <g key={`trail-seg-${start.id}-${end.id}`}>
              <path
                d={d}
                fill="none"
                stroke="rgba(79, 70, 229, 0.15)"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <path
                d={d}
                fill="none"
                stroke="url(#activeTrailGradient)"
                strokeWidth="4.5"
                strokeDasharray="6 4"
                strokeLinecap="round"
                className="animate-trail-pulse"
              />
            </g>
          );
        }

        // Locked / upcoming trail (subtle dashed slate)
        return (
          <path
            key={`trail-seg-${start.id}-${end.id}`}
            d={d}
            fill="none"
            stroke="#CBD5E1"
            strokeWidth="3"
            strokeDasharray="5 5"
            strokeLinecap="round"
            opacity="0.85"
          />
        );
      })}
    </svg>
  );
};
