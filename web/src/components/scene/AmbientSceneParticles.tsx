"use client";

import React, { useEffect, useRef } from "react";
import { startAmbientAtmosphere } from "../../utils/particleEngine";

interface AmbientSceneParticlesProps {
  type?: "FIREFLIES" | "DUST";
  className?: string;
}

export const AmbientSceneParticles: React.FC<AmbientSceneParticlesProps> = ({
  type = "FIREFLIES",
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };

    resize();
    const cleanup = startAmbientAtmosphere(canvas, type);

    const observer = new ResizeObserver(() => {
      resize();
    });

    if (canvas.parentElement) {
      observer.observe(canvas.parentElement);
    }

    return () => {
      cleanup();
      observer.disconnect();
    };
  }, [type]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-10 w-full h-full ${className}`}
      aria-hidden="true"
    />
  );
};
