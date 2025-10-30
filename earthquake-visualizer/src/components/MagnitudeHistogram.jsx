// src/components/MagnitudeHistogram.jsx
import React, { useMemo } from "react";
import "./MagnitudeHistogram.css";

/**
 * Compact SVG histogram for magnitudes, matching MagnitudePieChart colors and order.
 * Bins order: "<1", "1-2", "2-3", "3-4", "4-5", "5+"
 */
export default function MagnitudeHistogram({ features = [] }) {
  // colors must match MagnitudePieChart COLORS order
  const MAG_COLORS = ["#4E79A7", "#F28E2B", "#E15759", "#76B7B2", "#59A14F", "#EDC948"];
  const labels = ["<1", "1-2", "2-3", "3-4", "4-5", "5+"];

  // compute 6 bins consistent with Pie & MapView
  const bins = useMemo(() => {
    // bins[0] -> <1, bins[1] -> 1-2, ..., bins[5] -> 5+
    const counts = [0, 0, 0, 0, 0, 0];
    (features || []).forEach((f) => {
      const mRaw = f?.properties?.mag ?? f?.magnitude;
      const m = Number(mRaw);
      if (Number.isNaN(m)) return;
      if (m < 1) counts[0]++;
      else if (m < 2) counts[1]++;
      else if (m < 3) counts[2]++;
      else if (m < 4) counts[3]++;
      else if (m < 5) counts[4]++;
      else counts[5]++;
    });
    return counts;
  }, [features]);

  const maxCount = Math.max(...bins, 1);

  // sizing helpers
  const svgWidth = 180;
  const svgHeight = 64;
  const barWidth = 18;
  const gap = 8;
  const leftPadding = 8;
  const bottomY = 48; // baseline for labels
  const maxBarHeight = 36;

  return (
    <div className="hist-root" aria-hidden={bins.every((c) => c === 0)}>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="none"
        className="hist-svg"
        width="100%"
        height="100%"
      >
        {bins.map((count, i) => {
          const x = leftPadding + i * (barWidth + gap);
          const h = Math.round((count / maxCount) * maxBarHeight);
          const y = bottomY - h;
          const fill = MAG_COLORS[i % MAG_COLORS.length];
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={h}
                rx="3"
                fill={fill}
                opacity={count ? 0.95 : 0.18}
              />
              <text
                x={x + barWidth / 2}
                y={bottomY + 12}
                fontSize="8"
                fill="#cfe0ff"
                textAnchor="middle"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                {labels[i]}
              </text>
              <text
                x={x + barWidth / 2}
                y={y - 3}
                fontSize="8"
                fill="#e6eef8"
                textAnchor="middle"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                {count}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
