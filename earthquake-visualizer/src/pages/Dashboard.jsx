// src/pages/Dashboard.jsx
import React from "react";
import MapView from "../components/MapView";
import RegionBarChart from "../components/charts/RegionBarChart";
import MagnitudePieChart from "../components/charts/MagnitudePieChart";

import "../components/Dashboard.css";
import TimelineChart from "../components/charts/TimelineChart";

export default function Dashboard({ earthquakeData = [] }) {
  // defensive: ensure earthquakeData is an array
  const data = Array.isArray(earthquakeData) ? earthquakeData : [];

  console.info("USGS feed loaded. events:", data.length);

  return (
    <div className="dashboard-root">
      {/* Map at top */}
      <section className="map-section panel">
        <MapView features={data} />
      </section>

      {/* Charts grid: three fixed-height cards */}
      <section className="charts-section">
        <div className="charts-grid">
          <div className="chart-card">
            <MagnitudePieChart data={data} />
          </div>

          <div className="chart-card">
            <RegionBarChart data={data} />
          </div>

          <div className="chart-card">
            {/* Depth distribution chart could be another component; reuse RegionBarChart's slot if needed */}
            <TimelineChart mini data={data} /> {/* mini timeline (or replace with DepthBarChart) */}
          </div>
        </div>

        {/* Full-width timeline (bigger) */}
        <div className="chart-wide">
          <TimelineChart data={data} onSelectTime={() => {}} />
        </div>
      </section>
    </div>
  );
}
