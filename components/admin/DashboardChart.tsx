"use client";

import React, { useState } from "react";
import { TrendingUp, Eye, EyeOff } from "lucide-react";

interface ChartDataItem {
  label: string;
  contacts: number;
  speakerRequests: number;
  newsletters: number;
}

interface DashboardChartProps {
  data: ChartDataItem[];
}

export default function DashboardChart({ data }: DashboardChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showChart, setShowChart] = useState(false);

  if (!data || data.length === 0) return null;

  const hoveredItem = hoveredIndex !== null ? data[hoveredIndex] : undefined;

  // Chart Dimensions
  const svgWidth = 600;
  const svgHeight = 120;
  const paddingLeft = 25;
  const paddingRight = 10;
  const paddingTop = 10;
  const paddingBottom = 20;

  const plotWidth = svgWidth - paddingLeft - paddingRight;
  const plotHeight = svgHeight - paddingTop - paddingBottom;

  // Find max value to scale Y axis
  const maxVal = Math.max(
    ...data.flatMap((d) => [d.contacts, d.speakerRequests, d.newsletters]),
    5 // baseline min max value
  );

  // Round max value up to a clean multiple of 5
  const maxY = Math.ceil(maxVal / 5) * 5;

  // Coordinates Helper
  const getCoordinates = (index: number, val: number) => {
    const x = paddingLeft + (index * plotWidth) / (data.length - 1);
    const y = paddingTop + plotHeight - (val / maxY) * plotHeight;
    return { x, y };
  };

  // Generate cubic Bezier SVG paths for smooth series curves
  const generateBezierPaths = (key: "contacts" | "speakerRequests" | "newsletters") => {
    const points = data.map((item, index) => getCoordinates(index, item[key]));
    if (points.length === 0) return { linePath: "", areaPath: "" };

    const startPoint = points[0];
    if (!startPoint) return { linePath: "", areaPath: "" };

    let linePath = `M ${startPoint.x} ${startPoint.y}`;
    let areaPath = `M ${startPoint.x} ${paddingTop + plotHeight} L ${startPoint.x} ${startPoint.y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      if (!p0 || !p1) continue;

      // Control points calculated at 1/3 and 2/3 horizontal distance, keeping Y flat to p0 and p1 respectively
      const cp1x = p0.x + (p1.x - p0.x) / 3;
      const cp1y = p0.y;
      const cp2x = p0.x + (2 * (p1.x - p0.x)) / 3;
      const cp2y = p1.y;

      const segment = ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
      linePath += segment;
      areaPath += segment;
    }

    const lastPoint = points[points.length - 1];
    if (lastPoint) {
      areaPath += ` L ${lastPoint.x} ${paddingTop + plotHeight} Z`;
    }

    return { linePath, areaPath };
  };

  const contactsPaths = generateBezierPaths("contacts");
  const speakerPaths = generateBezierPaths("speakerRequests");
  const newslettersPaths = generateBezierPaths("newsletters");

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const clientX = e.clientX - rect.left;

    // Scale clientX to SVG coordinate space
    const svgX = (clientX / rect.width) * svgWidth;

    let closestIndex = 0;
    let minDiff = Infinity;
    for (let i = 0; i < data.length; i++) {
      const x = paddingLeft + (i * plotWidth) / (data.length - 1);
      const diff = Math.abs(x - svgX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    }
    setHoveredIndex(closestIndex);
  };

  // Y-axis gridlines count (5 lines)
  const gridLines = Array.from({ length: 5 }, (_, i) => {
    const val = (maxY / 4) * i;
    const y = paddingTop + plotHeight - (val / maxY) * plotHeight;
    return { val, y };
  });

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-sm transition-all duration-300 select-none relative">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
            <TrendingUp className="w-4 h-4 text-teal" />
            Growth Trends & Analytics
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Monthly volume of contact inquiries and speaker submissions</p>
        </div>

        <div className="flex items-center gap-4">
          {showChart && (
            <div className="hidden sm:flex items-center gap-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal" />
                <span>Inquiries</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Speaker invites</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <span>Newsletters</span>
              </div>
            </div>
          )}

          <button
            onClick={() => {
              setShowChart(!showChart);
              setHoveredIndex(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 border text-[9px] font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer ${
              showChart
                ? "bg-white hover:bg-slate-50 border-slate-200 text-slate-500"
                : "bg-teal/10 hover:bg-teal text-teal hover:text-white border-transparent"
            }`}
          >
            {showChart ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                Hide Chart
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                View Growth Chart
              </>
            )}
          </button>
        </div>
      </div>

      {showChart && (
        <div className="mt-6 pt-4 border-t border-slate-50 animate-fade-in relative">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto overflow-visible cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Gridlines */}
            {gridLines.map((line, idx) => (
              <g key={idx}>
                <line
                  x1={paddingLeft}
                  y1={line.y}
                  x2={svgWidth - paddingRight}
                  y2={line.y}
                  className="stroke-slate-100"
                  strokeWidth={1}
                  strokeDasharray={idx === 0 ? "0" : "3 3"}
                />
                <text
                  x={paddingLeft - 8}
                  y={line.y + 3}
                  textAnchor="end"
                  className="fill-slate-400 font-medium text-[8px]"
                >
                  {Math.round(line.val)}
                </text>
              </g>
            ))}

            {/* Area Gradients */}
            <defs>
              <linearGradient id="contactsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#087f8c" stopOpacity={0.12} />
                <stop offset="100%" stopColor="#087f8c" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="speakerGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.10} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="newslettersGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.08} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            {/* Series Areas */}
            <path d={contactsPaths.areaPath} fill="url(#contactsGrad)" />
            <path d={speakerPaths.areaPath} fill="url(#speakerGrad)" />
            <path d={newslettersPaths.areaPath} fill="url(#newslettersGrad)" />

            {/* Series Lines */}
            <path
              d={contactsPaths.linePath}
              fill="none"
              stroke="#087f8c"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={speakerPaths.linePath}
              fill="none"
              stroke="#f59e0b"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={newslettersPaths.linePath}
              fill="none"
              stroke="#6366f1"
              strokeWidth={1.5}
              strokeDasharray="3 3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* X Axis labels */}
            {data.map((item, idx) => {
              const { x } = getCoordinates(idx, 0);
              return (
                <text
                  key={idx}
                  x={x}
                  y={svgHeight - paddingBottom + 12}
                  textAnchor="middle"
                  className="fill-slate-400 font-medium text-[8px] uppercase tracking-wider"
                >
                  {item.label.split(" ")[0]}
                </text>
              );
            })}

            {/* Interaction Guide Line */}
            {hoveredIndex !== null && (
              <line
                x1={getCoordinates(hoveredIndex, 0).x}
                y1={paddingTop}
                x2={getCoordinates(hoveredIndex, 0).x}
                y2={paddingTop + plotHeight}
                className="stroke-slate-200"
                strokeWidth={1}
                strokeDasharray="2 2"
              />
            )}

            {/* Dot Markers for Hover State */}
            {hoveredIndex !== null && hoveredItem && (
              <>
                <circle
                  cx={getCoordinates(hoveredIndex, hoveredItem.contacts).x}
                  cy={getCoordinates(hoveredIndex, hoveredItem.contacts).y}
                  r={3.5}
                  fill="#087f8c"
                  stroke="#fff"
                  strokeWidth={1.5}
                />
                <circle
                  cx={getCoordinates(hoveredIndex, hoveredItem.speakerRequests).x}
                  cy={getCoordinates(hoveredIndex, hoveredItem.speakerRequests).y}
                  r={3.5}
                  fill="#f59e0b"
                  stroke="#fff"
                  strokeWidth={1.5}
                />
                <circle
                  cx={getCoordinates(hoveredIndex, hoveredItem.newsletters).x}
                  cy={getCoordinates(hoveredIndex, hoveredItem.newsletters).y}
                  r={3.5}
                  fill="#6366f1"
                  stroke="#fff"
                  strokeWidth={1.5}
                />
              </>
            )}
          </svg>

          {/* Dynamic HTML Tooltip */}
          {hoveredIndex !== null && hoveredItem && (
            <div
              className="absolute bg-slate-900/95 backdrop-blur-sm text-white p-3 rounded-xl shadow-lg text-[10px] space-y-1.5 pointer-events-none z-20 border border-slate-800 animate-scale-up"
              style={{
                left: `${((paddingLeft + (hoveredIndex * plotWidth) / (data.length - 1)) / svgWidth) * 100}%`,
                bottom: "100%",
                transform: "translate(-50%, -10px)",
              }}
            >
              <p className="font-bold border-b border-slate-800 pb-1 mb-1 text-slate-400 uppercase tracking-widest text-[8px] text-center">
                {hoveredItem.label}
              </p>
              <div className="space-y-1 min-w-[105px]">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal" />
                    <span className="text-slate-400">Inquiries</span>
                  </div>
                  <strong className="font-semibold text-white">{hoveredItem.contacts}</strong>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span className="text-slate-400">Invites</span>
                  </div>
                  <strong className="font-semibold text-white">{hoveredItem.speakerRequests}</strong>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    <span className="text-slate-400">Newsletters</span>
                  </div>
                  <strong className="font-semibold text-white">{hoveredItem.newsletters}</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
