// src/api/usgs.js
import axios from 'axios';

const FEEDS = {
  day: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson',
  week: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson',
  month: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson'
};

export async function fetchEarthquakes(feedKey = 'day') {
  const url = FEEDS[feedKey] || FEEDS.day;
  const res = await axios.get(url, { timeout: 20000 });
  return res.data;
}
