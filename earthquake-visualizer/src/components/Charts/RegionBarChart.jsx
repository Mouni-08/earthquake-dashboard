// src/components/charts/RegionBarChart.jsx
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

const DEFAULT_BAR_COLOR = "#34D399"; // shared color (green)

function extractRegionFromPlace(place = "") {
  if (!place) return "Unknown";
  const parts = place.split(",").map((s) => s.trim()).filter(Boolean);
  if (parts.length > 1) return parts[parts.length - 1];
  const tokens = place.split(/\s+/).filter(Boolean);
  return tokens.length ? tokens[tokens.length - 1] : place;
}

export default function RegionBarChart({ data = [], onSelectRegion = () => {} }) {
  const rows = useMemo(() => {
    const counts = {};
    (data || []).forEach((f) => {
      const place = f.properties?.place ?? "";
      const region = extractRegionFromPlace(place);
      counts[region] = (counts[region] || 0) + 1;
    });
    const arr = Object.entries(counts).map(([region, count]) => ({ region, count }));
    arr.sort((a, b) => b.count - a.count);
    return arr.slice(0, 10);
  }, [data]);

  if (!rows.length) return <div className="chart-card-empty">No region data</div>;

  return (
    <div className="chart-card-inner">
      <div className="chart-header">Region Data</div>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={rows}
          layout="vertical"
          margin={{ top: 6, right: 12, left: 8, bottom: 6 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis type="number" tick={{ fill: "#cfe0ff" }} />
          <YAxis type="category" dataKey="region" width={150} tick={{ fill: "#cfe0ff" }} />

          {/* ✅ Customized tooltip */}
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.1)" }}
            contentStyle={{
              backgroundColor: "#f8f9fa", // light gray background
              border: "1px solid #ccc",
              borderRadius: "6px",
              color: "#000", // <-- black text
              fontSize: "13px",
              fontFamily: "Inter, system-ui, sans-serif",
            }}
            itemStyle={{
              color: "#000", // <-- tooltip item text black
            }}
            labelStyle={{
              color: "#000", // <-- tooltip header text black
              fontWeight: 600,
            }}
          />

          <Bar
            dataKey="count"
            fill={DEFAULT_BAR_COLOR}
            radius={[6, 6, 6, 6]}
            isAnimationActive={false}
            onClick={(payload) => {
              try {
                const region = payload?.region ?? payload?.payload?.region;
                console.log("RegionBarChart onClick payload:", payload, "resolved region:", region);
                if (region) onSelectRegion(region);
              } catch (e) {
                console.warn(e);
              }
            }}
          >
            {rows.map((entry, idx) => (
              <Cell
                key={`cell-${idx}`}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  console.log("RegionBarChart cell click:", entry.region);
                  onSelectRegion(entry.region);
                }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
