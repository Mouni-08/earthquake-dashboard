import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "../Charts/EventOverTimeChart.css";

export default function EventOverTimeChart({ data, onSelectTime }) {
  const counts = new Array(24).fill(0);
  data.forEach((e) => {
    const hr = new Date(e.time).getHours();
    counts[hr]++;
  });

  const chartData = counts.map((count, hr) => ({
    hour: `${hr.toString().padStart(2, "0")}:00`,
    count,
  }));

  return (
    <div className="chart-card-inner">
      <div className="chart-header">Event Over Time</div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="hour"
            angle={-35}
            textAnchor="end"
            height={60}
            tick={{ fill: "#cfe0ff" }}
          />
          <YAxis domain={[0, "dataMax + 5"]} tick={{ fill: "#cfe0ff" }} />

          {/* ✅ Tooltip with black text */}
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

          <Legend
            wrapperStyle={{
              paddingTop: "8px",
              color: "#cfe0ff",
              fontSize: "13px",
              fontFamily: "Inter, system-ui, sans-serif",
            }}
          />

          <Bar
            dataKey="count"
            fill="#60A5FA"
            radius={[6, 6, 0, 0]}
            onClick={(entry) => onSelectTime(entry.hour.split(":")[0])}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
