// src/components/charts/DepthBarChart.jsx
import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

const DEFAULT_DEPTH_COLOR = "#60c3f5cb";

const DEPTH_BUCKETS = [
  { key: "0-10", label: "0-10 km", min: 0, max: 10 },
  { key: "10-30", label: "10-30 km", min: 10, max: 30 },
  { key: "30-70", label: "30-70 km", min: 30, max: 70 },
  { key: "70+", label: "70+ km", min: 70, max: Infinity },
];

export default function DepthBarChart({ data = [], onSelectDepth = () => {} }) {
  const chartData = useMemo(() => {
    const counts = {};
    DEPTH_BUCKETS.forEach((b) => (counts[b.key] = 0));
    (data || []).forEach((f) => {
      const d = f.geometry?.coordinates?.[2] ?? f.properties?.depth ?? null;
      if (d === null || d === undefined) return;
      const depth = Number(d);
      for (const b of DEPTH_BUCKETS) {
        if (depth >= b.min && depth < b.max) {
          counts[b.key]++;
          break;
        }
      }
    });
    return DEPTH_BUCKETS.map((b) => ({
      bucket: b.key,
      label: b.label,
      count: counts[b.key] || 0,
    }));
  }, [data]);

  if (!chartData.length) return <div className="chart-card-empty">No depth data</div>;

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div className="chart-header">Depth Levels</div>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 6, right: 12, left: 8, bottom: 36 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" tick={{ fill: "#85abf0ff" }} />
          <YAxis allowDecimals={false} tick={{ fill: "#43526eff" }} />

          {/* ✅ Custom Tooltip (black text) */}
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.1)" }}
            contentStyle={{
              backgroundColor: "#f8f9fa", // light gray background
              border: "1px solid #ccc",
              borderRadius: "6px",
              color: "#000", // black text
              fontSize: "13px",
              fontFamily: "Inter, system-ui, sans-serif",
            }}
            itemStyle={{
              color: "#000", // black text for values
            }}
            labelStyle={{
              color: "#000", // black header
              fontWeight: 600,
            }}
          />

          <Bar
            dataKey="count"
            fill={DEFAULT_DEPTH_COLOR}
            radius={[6, 6, 0, 0]}
            isAnimationActive={false}
            onClick={(payload) => {
              const bucket = payload?.bucket ?? payload?.payload?.bucket;
              console.log("DepthBarChart onClick payload:", payload, "bucket:", bucket);
              if (bucket) onSelectDepth(bucket);
            }}
          >
            {chartData.map((entry, idx) => (
              <Cell
                key={`dcell-${idx}`}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  console.log("DepthBarChart cell click:", entry.bucket);
                  onSelectDepth(entry.bucket);
                }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
