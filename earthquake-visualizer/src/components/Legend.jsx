import React from "react";
import "./Legend.css";

export default function Legend() {
  const items = [
    { color: "#4E79A7", label: "< 1" },
    { color: "#F28E2B", label: "1 - 2" },
    { color: "#E15759", label: "2 - 3" },
    { color: "#76B7B2", label: "3 - 4" },
    { color: "#59A14F", label: "4 - 5" },
    { color: "#EDC948", label: "5+" },
  ];

  return (
    <div className="legend panel" style={{ padding: 10 }}>
      <div className="legend-title">Magnitude</div>
      <div className="legend-items">
        {items.map((item, idx) => (
          <div key={idx} className="legend-row">
            <span
              className="swatch"
              style={{
                background: item.color,
                display: "inline-block",
                width: 14,
                height: 14,
                marginRight: 6,
                borderRadius: 3,
              }}
            />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
