// src/components/charts/TimelineChart.jsx
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

export default function TimelineChart({ data = [], onSelectHour = () => {} }) {
  const chartData = useMemo(() => {
    const counts = new Array(24).fill(0);
    (data || []).forEach((f) => {
      const t = f.properties?.time ?? f.time;
      if (!t) return;
      const hour = new Date(t).getHours();
      if (!Number.isNaN(hour)) counts[hour]++;
    });
    return counts.map((v, i) => ({
      hour: String(i).padStart(2, "0"),
      label: `${String(i).padStart(2, "0")}:00`,
      count: v,
    }));
  }, [data]);

  if (!chartData.length)
    return <div className="chart-card-empty">No timeline data</div>;

  return (
    <div className="chart-card-inner">
      <div className="chart-header">Event Over Time</div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 8, right: 12, left: 8, bottom: 36 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            angle={-35}
            textAnchor="end"
            interval={0}
            height={40}
            tick={{ fill: "#cfe0ff", fontSize: 11 }}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: "#9fb0d7" }}
            domain={[0, "dataMax + 5"]}
          />

          {/* ✅ Tooltip with black text and light background */}
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.1)" }}
            contentStyle={{
              backgroundColor: "#f8f9fa", // Light gray background
              border: "1px solid #ccc",
              borderRadius: "6px",
              color: "#000", // Black text
              fontSize: "13px",
              fontFamily: "Inter, system-ui, sans-serif",
            }}
            itemStyle={{
              color: "#000", // Black for item values
            }}
            labelStyle={{
              color: "#000", // Black for label
              fontWeight: 600,
            }}
          />

          <Bar
            dataKey="count"
            fill="#60A5FA"
            radius={[6, 6, 0, 0]}
            isAnimationActive={false}
            onClick={(payload) => {
              const hour = payload?.hour ?? payload?.payload?.hour;
              console.log("TimelineChart onClick payload:", payload, "hour:", hour);
              if (hour) onSelectHour(hour);
            }}
          >
            {chartData.map((entry, idx) => (
              <Cell
                key={`tcell-${idx}`}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  console.log("TimelineChart cell click:", entry.hour);
                  onSelectHour(entry.hour);
                }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
