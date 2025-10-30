// src/contexts/MapContext.jsx
import React, { createContext, useState } from 'react';

export const MapContext = createContext({
  map: null,
  setMap: () => {},
});

export function MapProvider({ children }) {
  const [map, setMap] = useState(null);
  return (
    <MapContext.Provider value={{ map, setMap }}>
      {children}
    </MapContext.Provider>
  );
}
