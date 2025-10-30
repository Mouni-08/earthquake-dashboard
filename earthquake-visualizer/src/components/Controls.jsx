// src/components/Controls.jsx
import React from 'react';
import './Controls.css';

export default function Controls({ minMag, setMinMag, searchText, setSearchText, feedKey, setFeedKey, onRefresh }) {
  return (
    <div className="controls-root">
      <div className="controls-row">
        <label className="label">Min magnitude</label>
        <div className="mag-row">
          <input type="range" min="0" max="8" step="0.1" value={minMag}
            onChange={e => setMinMag(Number(e.target.value))}/>
          <div className="mag-value">{minMag.toFixed(1)}</div>
        </div>
      </div>

      <div className="controls-row">
        <label className="label">Place contains</label>
        <input className="text" placeholder="e.g., Alaska, Japan, California" value={searchText}
          onChange={e => setSearchText(e.target.value)}/>
      </div>

      <div className="controls-row">
        <label className="label">Time window (feed)</label>
        <select value={feedKey} onChange={e => setFeedKey(e.target.value)}>
          <option value="day">Last 24 hours</option>
          <option value="week">Last 7 days</option>
          <option value="month">Last 30 days</option>
        </select>
      </div>

      <div className="controls-row actions">
        <button className="refresh" onClick={onRefresh}>Refresh</button>
      </div>
    </div>
  );
}
