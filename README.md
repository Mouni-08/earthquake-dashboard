# 🌍 Earthquake Dashboard

A modern, interactive **Earthquake Data Visualization Dashboard** built with **React + Vite**.  
It visualizes real-time or sample earthquake data using interactive charts, maps, and visual summaries — all designed for clarity and performance.

## 🧠 Overview

This dashboard provides a visual summary of earthquake events based on magnitude, depth, location, and time of occurrence.

**Key Highlights:**
- 🌎 Interactive world map with color-coded magnitude markers.
- 📊 Dynamic charts for magnitude, depth, region, and hourly trends.
- 🎨 Consistent color scheme across charts for better correlation.
- ⚡ Built with React + Recharts + Leaflet for high-performance rendering.
- 📱 Fully responsive — works on all screen sizes.
- 🧩 Modular code structure — each chart/component is isolated for clarity.

---

## 🧰 Tech Stack

| Category | Tools Used |
|-----------|-------------|
| Frontend | React (Vite) |
| UI Styling | CSS Modules / Tailwind (optional) |
| Charts | Recharts |
| Maps | React-Leaflet + OpenStreetMap |
| Icons | Lucide React |
| Deployment | GitHub Pages / CodeSandbox / StackBlitz |

---

## 📂 Project Structure

earthquake-dashboard/
├── src/
│ ├── components/
│ │ ├── charts/
│ │ │ ├── DepthBarChart.jsx
│ │ │ ├── RegionBarChart.jsx
│ │ │ ├── MagnitudePieChart.jsx
│ │ │ ├── TimelineChart.jsx
│ │ │ └── EventOverTimeChart.jsx
│ │ ├── MapView.jsx
│ │ ├── Legend.jsx
│ │ └── MagnitudeHistogram.jsx
│ ├── App.jsx
│ ├── main.jsx
│ └── styles/
│ ├── App.css
│ └── component-specific css files
├── public/
├── package.json
├── vite.config.js
└── README.md
