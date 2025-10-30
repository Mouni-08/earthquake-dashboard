// src/components/MapView.jsx
import React, { useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapView.css";

/*
  MapView (single-file):
  - Uses internal magnitude color palette (same palette as the charts)
  - Robustly handles missing geometry
  - CircleMarker color and size determined by magnitude
*/

// Fix default marker icons in many build setups
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Magnitude color palette (same order used by your pie/histogram)
// order: "<1", "1-2", "2-3", "3-4", "4-5", "5+"
const MAG_COLORS = ["#4E79A7", "#F28E2B", "#E15759", "#76B7B2", "#59A14F", "#EDC948"];

/** Return a color hex based on magnitude value */
function getMagnitudeColor(mag) {
  const m = Number(mag);
  if (Number.isNaN(m)) return MAG_COLORS[0];
  if (m < 1) return MAG_COLORS[0];
  if (m < 2) return MAG_COLORS[1];
  if (m < 3) return MAG_COLORS[2];
  if (m < 4) return MAG_COLORS[3];
  if (m < 5) return MAG_COLORS[4];
  return MAG_COLORS[5];
}

function safeFeatures(props) {
  // Accept multiple prop names your app might send
  const src = props.features ?? props.earthquakeData ?? props.data ?? [];
  if (!Array.isArray(src)) return [];
  return src;
}

export default function MapView(props) {
  const raw = safeFeatures(props);

  // Filter to features that have valid geometry coordinates [lon, lat, ...]
  const features = useMemo(
    () =>
      raw.filter((f) => {
        if (!f) return false;
        const coords =
          f.geometry?.coordinates ??
          (Array.isArray(f.coordinates) && [f.coordinates[1], f.coordinates[0]]);
        return (
          Array.isArray(coords) &&
          coords.length >= 2 &&
          Number.isFinite(Number(coords[0])) &&
          Number.isFinite(Number(coords[1]))
        );
      }),
    [raw]
  );

  // compute map center as average of visible points or fallback to world center
  const center = useMemo(() => {
    if (!features || features.length === 0) return [20, 0];
    let sumLat = 0,
      sumLon = 0,
      count = 0;
    features.forEach((f) => {
      const coords = f.geometry?.coordinates ?? (Array.isArray(f.coordinates) && [f.coordinates[1], f.coordinates[0]]);
      if (!coords || coords.length < 2) return;
      const lon = Number(coords[0]);
      const lat = Number(coords[1]);
      if (!Number.isFinite(lon) || !Number.isFinite(lat)) return;
      sumLat += lat;
      sumLon += lon;
      count++;
    });
    if (count === 0) return [20, 0];
    return [sumLat / count, sumLon / count];
  }, [features]);

  // marker size scaling by magnitude
  const getRadius = (mag) => {
    const m = Number(mag ?? (mag === 0 ? 0 : NaN));
    if (Number.isNaN(m)) return 4;
    // scale: tiny => 4, typical 1-3 => 6-14, big 6+ => 28
    return Math.max(4, Math.min(28, 4 + (m * 4)));
  };

  return (
    <div className="mapview-root" style={{ width: "100%", height: "100%" }}>
      <MapContainer center={center} zoom={2} style={{ height: "100%", width: "100%", borderRadius: 12 }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {features.map((f, i) => {
          // find coordinates [lon, lat, ...] for both raw geojson and normalized object
          const coords =
            f.geometry?.coordinates ??
            (Array.isArray(f.coordinates) && [f.coordinates[1], f.coordinates[0]]);
          if (!coords || coords.length < 2) return null;
          const lon = Number(coords[0]);
          const lat = Number(coords[1]);
          if (!Number.isFinite(lon) || !Number.isFinite(lat)) return null;

          // magnitude can be in properties.mag or normalized magnitude
          const mag = f.properties?.mag ?? f.magnitude ?? null;
          const place = f.properties?.place ?? f.place ?? "Unknown";
          const time = f.properties?.time ? new Date(f.properties.time) : f.time ? new Date(f.time) : null;
          const depth = (f.geometry?.coordinates && f.geometry.coordinates[2]) ?? f.depth ?? null;

          const color = getMagnitudeColor(mag);

          return (
            <CircleMarker
              key={f.id ?? `${i}-${lat}-${lon}`}
              center={[lat, lon]}
              radius={getRadius(mag)}
              fillOpacity={0.85}
              stroke={false}
              pathOptions={{ color, fillColor: color }}
              // title provides a native tooltip on hover (quick info)
              title={`${place} — M${mag !== null ? mag : "?"}`}
            >
              <Popup>
                <div style={{ minWidth: 180 }}>
                  <div style={{ fontWeight: 700 }}>{place}</div>
                  <div>Mag: {(mag ?? "-").toString()}</div>
                  <div>Depth: {depth !== null ? `${depth} km` : "N/A"}</div>
                  {time && <div style={{ fontSize: 12, color: "#333" }}>{time.toLocaleString()}</div>}
                  {f.properties?.url && (
                    <div style={{ marginTop: 6 }}>
                      <a href={f.properties.url} target="_blank" rel="noreferrer">
                        USGS details
                      </a>
                    </div>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
