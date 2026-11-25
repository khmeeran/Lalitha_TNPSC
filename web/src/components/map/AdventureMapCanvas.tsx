"use client";

import React, { useRef, useEffect, useState } from "react";
import { Plus, Minus, RotateCcw } from "lucide-react";
import { AdventureRealm, MapNode, LalithaMood } from "../../types/adventureMap";
import { SVGTrailRenderer } from "./SVGTrailRenderer";
import { MapNodeItem } from "./MapNodeItem";

interface AdventureMapCanvasProps {
  realm: AdventureRealm;
  selectedNodeId: string | null;
  activeNodeId: string;
  lalithaMood?: LalithaMood;
  onSelectNode: (node: MapNode) => void;
}

export const AdventureMapCanvas: React.FC<AdventureMapCanvasProps> = ({
  realm,
  selectedNodeId,
  activeNodeId,
  lalithaMood = "CURIOUS_EXPLORER",
  onSelectNode,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasWidth, setCanvasWidth] = useState<number>(360);
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);

  const NODE_VERTICAL_PITCH = 124;
  const TOP_OFFSET = 100;

  // Measure container width responsively
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setCanvasWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Auto-center camera on the active node on mount or realm change
  useEffect(() => {
    if (containerRef.current && realm.nodes) {
      const activeIndex = realm.nodes.findIndex((n) => n.id === activeNodeId);
      if (activeIndex !== -1) {
        const targetY = TOP_OFFSET + activeIndex * NODE_VERTICAL_PITCH - 200;
        containerRef.current.scrollTo({
          top: Math.max(0, targetY),
          behavior: "smooth",
        });
      }
    }
  }, [realm.id, activeNodeId]);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(1.4, prev + 0.15));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(0.75, prev - 0.15));
  const handleResetZoom = () => setZoomLevel(1.0);

  // Accessible keyboard arrow navigation across the nodes
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!realm.nodes || realm.nodes.length === 0) return;
    const currentIndex = realm.nodes.findIndex((n) => n.id === selectedNodeId);
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = Math.min(
        realm.nodes.length - 1,
        currentIndex === -1 ? 0 : currentIndex + 1
      );
      onSelectNode(realm.nodes[nextIndex]);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIndex = Math.max(
        0,
        currentIndex === -1 ? 0 : currentIndex - 1
      );
      onSelectNode(realm.nodes[prevIndex]);
    }
  };

  const totalCanvasHeight = TOP_OFFSET + (realm.nodes.length - 1) * NODE_VERTICAL_PITCH + 140;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="relative flex-1 w-full overflow-y-auto overflow-x-hidden bg-[#FBFBF9] select-none rounded-2xl border border-slate-200/80 shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
      style={{ minHeight: "560px", maxHeight: "calc(100vh - 6.5rem)" }}
      role="region"
      aria-label={`Syllabus trail for ${realm.nameEn}. Use arrow keys to navigate between nodes.`}
      data-testid="adventure-map-canvas"
    >
      {/* 1. Desktop Zoom Controls Bar (Hidden on Mobile) */}
      <div className="hidden sm:flex absolute top-4 right-4 z-30 bg-white/90 backdrop-blur-md rounded-xl p-1 shadow-md border border-slate-200 gap-1">
        <button
          onClick={handleZoomIn}
          aria-label="Zoom in on map"
          className="min-w-[44px] min-h-[44px] rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          aria-label="Zoom out on map"
          className="min-w-[44px] min-h-[44px] rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-700 transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetZoom}
          aria-label="Reset zoom level"
          className="min-w-[44px] min-h-[44px] rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-700 transition-colors text-xs font-bold"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. Scaled Map Terrain Surface */}
      <div
        className="relative mx-auto transition-transform duration-200 origin-top"
        style={{
          width: `${canvasWidth}px`,
          height: `${totalCanvasHeight}px`,
          transform: `scale(${zoomLevel})`,
        }}
      >
        {/* Subtle Map Contour Background Lines */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(${realm.themeColor} 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
          aria-hidden="true"
        />

        {/* Dynamic Sinusoidal Connecting Trail */}
        <SVGTrailRenderer
          nodes={realm.nodes}
          canvasWidth={canvasWidth}
          nodeVerticalPitch={NODE_VERTICAL_PITCH}
          topOffset={TOP_OFFSET}
          themeColor={realm.themeColor}
        />

        {/* Positioned Map Nodes */}
        {realm.nodes.map((node, index) => {
          const maxAmplitude = Math.min(canvasWidth * 0.28, 95);
          const x = canvasWidth / 2 + node.xOscillationRatio * maxAmplitude;
          const y = TOP_OFFSET + index * NODE_VERTICAL_PITCH;
          const isActiveNode = node.id === activeNodeId;
          const isSelected = node.id === selectedNodeId;

          return (
            <div
              key={node.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}px`, top: `${y}px` }}
            >
              <MapNodeItem
                node={node}
                isActiveNode={isActiveNode}
                isSelected={isSelected}
                lalithaMood={lalithaMood}
                themeColor={realm.themeColor}
                onClick={onSelectNode}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
