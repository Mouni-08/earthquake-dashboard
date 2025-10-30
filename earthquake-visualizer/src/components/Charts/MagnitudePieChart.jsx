// src/components/charts/MagnitudePieChart.jsx
import React, { useMemo } from "react";
import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell, Legend } from "recharts";
import "./MagnitudePieChart.css";

const COLORS = ["#4E79A7", "#F28E2B", "#E15759", "#76B7B2", "#59A14F", "#EDC948"];


export default function MagnitudePieChart({ data = [], onSelectMagnitude = () => {} }) {
  const chartData = useMemo(() => {
    const bins = [
      { name: "<1", value: 0 },
      { name: "1-2", value: 0 },
      { name: "2-3", value: 0 },
      { name: "3-4", value: 0 },
      { name: "4-5", value: 0 },
      { name: "5+", value: 0 },
    ];
    (data || []).forEach((d) => {
      const m = Number(d.magnitude ?? d.properties?.mag ?? 0);
      if (Number.isNaN(m)) return;
      if (m < 1) bins[0].value++;
      else if (m < 2) bins[1].value++;
      else if (m < 3) bins[2].value++;
      else if (m < 4) bins[3].value++;
      else if (m < 5) bins[4].value++;
      else bins[5].value++;
    });
    return bins;
  }, [data]);

  const total = chartData.reduce((s, b) => s + b.value, 0);

  if (!data || data.length === 0 || total === 0) {
    return <div className="chart-card-empty">No magnitude data to display</div>;
  }

  return (
    <div className="chart-card-inner">
      <div className="chart-header">Magnitude distribution</div>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={36}
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            onClick={(entry) => {
              const label = entry?.payload?.name ?? entry?.name;
              if (label) onSelectMagnitude(label);
            }}
          >
            {chartData.map((entry, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} opacity={entry.value ? 0.98 : 0.18} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [`${value}`, name]} />
          <Legend verticalAlign="bottom" height={24} wrapperStyle={{ color: "#eee7e6ff" }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="chart-footer small-muted">Total events: {total}</div>
    </div>
  );
}
