// src/components/TopEventsList.jsx
import React, { useContext } from 'react';

import L from 'leaflet';
import './TopEventsList.css';
import { MapContext } from '../contexts/Mapcontext';


/**
 * TopEventsList: shows top N strongest events from the filtered features.
 * Click an item to flyTo and open a popup on the map.
 */
export default function TopEventsList({ features = [], limit = 10 }) {
  const { map } = useContext(MapContext);
  if (!features || features.length === 0) {
    return <div className="toplist-root">No events to list</div>;
  }

  // sort descending by mag
  const sorted = [...features].sort((a, b) => (b.properties.mag ?? 0) - (a.properties.mag ?? 0)).slice(0, limit);

  function handleClick(f) {
    if (!map) return;
    const [lon, lat] = f.geometry.coordinates;
    map.flyTo([lat, lon], 6, { duration: 1.2 });
    // show a temporary popup
    const popup = L.popup({ maxWidth: 300 })
      .setLatLng([lat, lon])
      .setContent(`<div style="min-width:200px">
        <div style="font-weight:700">${f.properties.place}</div>
        <div>Mag: ${f.properties.mag}</div>
        <div>${new Date(f.properties.time).toLocaleString()}</div>
        <div style="margin-top:6px"><a href="${f.properties.url}" target="_blank">USGS details</a></div>
      </div>`)
      .openOn(map);
  }

  return (
    <div className="toplist-root">
      <div className="toplist-title">Top {sorted.length} strongest</div>
      <ul className="toplist-ul">
        {sorted.map((f) => (
          <li key={f.id} className="toplist-item" onClick={() => handleClick(f)}>
            <div className="t-left">
              <div className="t-place">{f.properties.place}</div>
              <div className="t-time small-muted">{new Date(f.properties.time).toLocaleString()}</div>
            </div>
            <div className="t-right"><strong>{(f.properties.mag ?? 0).toFixed(1)}</strong></div>
          </li>
        ))}
      </ul>
    </div>
  );
}
