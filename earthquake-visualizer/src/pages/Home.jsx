// src/pages/Home.jsx
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { fetchEarthquakes } from '../api/usgs';
import MapView from '../components/MapView';
import Controls from '../components/Controls';
import Legend from '../components/Legend';
import Loading from '../components/Loading';
import ErrorBox from '../components/ErrorBox';
import TopEventsList from '../components/TopEventsList';

import MagnitudePieChart from '../components/charts/MagnitudePieChart';
import RegionBarChart from '../components/charts/RegionBarChart';
import DepthBarChart from '../components/charts/DepthBarChart';
import TimelineChart from '../components/charts/TimelineChart';

import '../index.css';
import { MapProvider } from '../contexts/Mapcontext';

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);

  // filters
  const [minMag, setMinMag] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [feedKey, setFeedKey] = useState('day'); // 'day' | 'week' | 'month'

  const selectedEventsRef = useRef(null);

  useEffect(() => { loadData(); }, [feedKey]);

  async function loadData() {
    setLoading(true); setError(null);
    try {
      const res = await fetchEarthquakes(feedKey);
      setData(res);
      console.info('[Home] loaded feed, features:', res?.features?.length ?? 0);
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
      setData(null);
    } finally { setLoading(false); }
  }

  // filtered features (client-side)
  const features = useMemo(() => {
    if (!data?.features) return [];
    const q = (searchText || '').trim().toLowerCase();
    return data.features.filter(f => {
      const mag = Number(f.properties?.mag ?? 0);
      if (mag < Number(minMag)) return false;
      if (q && !(String(f.properties?.place || '').toLowerCase().includes(q))) return false;
      return true;
    });
  }, [data, minMag, searchText]);

  // bounds for map (for fitBounds)
  const bounds = useMemo(() => {
    if (!features.length) return undefined;
    return features
      .map(f => {
        const coords = f.geometry?.coordinates;
        if (!Array.isArray(coords) || coords.length < 2) return null;
        const [lon, lat] = coords;
        return [lat, lon];
      })
      .filter(Boolean);
  }, [features]);

  // stats
  const stats = useMemo(() => {
    if (!features || features.length === 0) return { total: 0, maxMag: 0, strongest: null };
    let maxMag = -Infinity;
    let strongest = null;
    features.forEach(f => {
      const m = Number(f.properties?.mag ?? -Infinity);
      if (m > maxMag) { maxMag = m; strongest = f; }
    });
    return { total: features.length, maxMag: (maxMag === -Infinity ? 0 : maxMag), strongest };
  }, [features]);

  // normalize items and scroll to selected events block
  function handleSelect(items = []) {
    // ensure array of feature objects
    const arr = Array.isArray(items) ? items : [];
    setSelectedEvents(arr);
    // small delay to allow DOM update
    setTimeout(() => {
      selectedEventsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
    console.log('handleSelect -> items:', arr.length);
  }

  return (
    <MapProvider>
      <div className="app-container">
        <div className="header">
          <div>
            <div className="title">Earthquake Visualizer</div>
            <div className="subtitle">Past earthquakes (USGS) — interactive map and visual analysis</div>
          </div>
        </div>

        <div className="content">
          {/* left sidebar unchanged */}
          <aside className="panel sidebar-sticky">
            <Controls
              minMag={minMag} setMinMag={setMinMag}
              searchText={searchText} setSearchText={setSearchText}
              feedKey={feedKey} setFeedKey={setFeedKey}
              onRefresh={loadData}
            />

            <div style={{ height: 12 }} />
            <Legend />
            <div style={{ height: 12 }} />
            <div className="small-muted">Feed results (filtered): <strong>{stats.total}</strong></div>

            {stats.total === 0 ? (
              <div style={{ marginTop: 12, color: '#cfe0ff', fontSize: 13 }}>
                No events match your filters.
              </div>
            ) : (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontWeight: 700 }}>Strongest in feed: <span style={{ color:'#9fe' }}>{stats.maxMag}</span></div>
                {stats.strongest && <div style={{ marginTop: 8, fontSize: 13 }}>{stats.strongest.properties.place}</div>}
              </div>
            )}
          </aside>

          {/* main content */}
          <main>
            {loading && <div className="panel"><Loading /></div>}
            {error && <div className="panel"><ErrorBox message={error} onRetry={loadData} /></div>}

            {!loading && !error && (
              <>
                {/* Map area */}
                <div className="map-area panel" style={{ padding: 0 }}>
                  <MapView features={features} bounds={bounds} />
                </div>

                {/* Charts area */}
                <div style={{ marginTop: 12 }}>
                  <div className="panel">
                    <div className="charts-row" style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
                      {/* Magnitude Pie */}
                      <div style={{ flex:'1 1 360px', minWidth:320 }}>
                        <div style={{ width:'100%', height:320 }}>
                          <MagnitudePieChart
                            data={features}
                            onSelectMagnitude={(rangeLabel) => {
                              const items = features.filter(f => {
                                const m = Number(f.properties?.mag ?? 0);
                                switch (rangeLabel) {
                                  case '<1': return m < 1;
                                  case '1-2': return m >= 1 && m < 2;
                                  case '2-3': return m >= 2 && m < 3;
                                  case '3-4': return m >= 3 && m < 4;
                                  case '4-5': return m >= 4 && m < 5;
                                  case '5+': return m >= 5;
                                  default: return false;
                                }
                              });
                              handleSelect(items);
                            }}
                          />
                        </div>
                      </div>

                      {/* Region Bar */}
                      <div style={{ flex:'1 1 360px', minWidth:320 }}>
                        <div style={{ width:'100%', height:320 }}>
                          <RegionBarChart
                            data={features}
                            onSelectRegion={(regionLabel) => {
                              const items = features.filter(f => {
                                return String(f.properties?.place || '').toLowerCase().includes(String(regionLabel || '').toLowerCase());
                              });
                              handleSelect(items);
                            }}
                          />
                        </div>
                      </div>

                      {/* Depth Bar */}
                      <div style={{ flex:'1 1 360px', minWidth:320 }}>
                        <div style={{ width:'100%', height:320 }}>
                          <DepthBarChart
                            data={features}
                            onSelectDepth={(bucketLabel) => {
                              const items = features.filter(f => {
                                const depth = f.geometry?.coordinates?.[2] ?? f.properties?.depth ?? null;
                                if (depth === null || depth === undefined) return false;
                                const d = Number(depth);
                                if (bucketLabel === '0-10') return d >= 0 && d < 10;
                                if (bucketLabel === '10-30') return d >= 10 && d < 30;
                                if (bucketLabel === '30-70') return d >= 30 && d < 70;
                                if (bucketLabel === '70+') return d >= 70;
                                return false;
                              });
                              handleSelect(items);
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Full width timeline */}
                    <div style={{ marginTop: 16 }}>
                      <div style={{ width:'100%', height:420 }}>
                        <TimelineChart
                          data={features}
                          onSelectHour={(hourKey) => {
                            // hourKey is '00','01',..'23'
                            const h = Number(hourKey);
                            if (Number.isNaN(h)) { handleSelect([]); return; }
                            const items = features.filter(f => {
                              const t = f.properties?.time ?? f.time;
                              const hr = new Date(t).getHours();
                              return hr === h;
                            });
                            handleSelect(items);
                          }}
                        />
                      </div>
                    </div>

                    {/* Top events */}
                    <div style={{ marginTop: 12 }}>
                      <TopEventsList features={features} limit={10} />
                    </div>

                    {/* Selected events list */}
                    <div ref={selectedEventsRef}>
                      {selectedEvents && selectedEvents.length > 0 && (
                        <div style={{ marginTop: 12 }}>
                          <div style={{ fontWeight:700, marginBottom:8 }}>Selected events ({selectedEvents.length})</div>
                          <div style={{ maxHeight:220, overflowY:'auto', borderTop:'1px solid rgba(255,255,255,0.03)', paddingTop:8 }}>
                            {selectedEvents.map(ev => (
                              <div key={ev.id} style={{ padding:8, borderRadius:8, background:'rgba(255,255,255,0.01)', marginBottom:8, display:'flex', justifyContent:'space-between' }}>
                                <div>
                                  <div style={{ fontWeight:700 }}>{ev.properties.place}</div>
                                  <div className="small-muted">{new Date(ev.properties.time).toLocaleString()}</div>
                                  <a href={ev.properties.url} target="_blank" rel="noreferrer" style={{ fontSize:12, color:"#b371db", textDecoration:"none" }}>USGS details</a>
                                </div>
                                <div style={{ textAlign:'right' }}>
                                  <div style={{ fontSize:16, fontWeight:700 }}>{(ev.properties.mag ?? 0).toFixed(1)}</div>
                                  <div className="small-muted">{(ev.geometry?.coordinates?.[2] ?? '-') } km depth</div>
                                </div>
                              </div>
                            ))}
                            <div style={{ marginTop: 6 }}>
                              <button className="refresh" onClick={() => setSelectedEvents([])}>Clear selection</button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </MapProvider>
  );
}
