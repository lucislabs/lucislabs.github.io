import type { Feature, FeatureCollection, Point, Polygon } from 'geojson';
import { mean } from 'd3-array';
import { rng } from './rng';

// Synthetic PM2.5 monitoring network over the Denver / Front Range corridor.
export const BBOX = { w: -105.6, e: -104.4, s: 39.3, n: 40.2 };

const plumes = [
  { lon: -104.99, lat: 39.74, amp: 22, s: 0.13 },
  { lon: -105.08, lat: 40.02, amp: 12, s: 0.1 },
  { lon: -104.82, lat: 39.58, amp: 9, s: 0.14 },
];

export function field(lon: number, lat: number) {
  let v = 5 + (lon - BBOX.w) * 2;
  for (const p of plumes) {
    const d2 = ((lon - p.lon) * 1.3) ** 2 + (lat - p.lat) ** 2;
    v += p.amp * Math.exp(-d2 / (2 * p.s * p.s));
  }
  return v;
}

export type StationProps = { id: string; pm25: number };

export function stations(n = 220, seed = 42): FeatureCollection<Point, StationProps> {
  const r = rng(seed);
  const features: Feature<Point, StationProps>[] = Array.from({ length: n }, (_, i) => {
    const lon = BBOX.w + r.next() * (BBOX.e - BBOX.w);
    const lat = BBOX.s + r.next() * (BBOX.n - BBOX.s);
    const pm25 = Math.max(1, field(lon, lat) + r.normal() * 1.6);
    return {
      type: 'Feature',
      properties: { id: `S${String(i + 1).padStart(3, '0')}`, pm25: +pm25.toFixed(2) },
      geometry: { type: 'Point', coordinates: [+lon.toFixed(5), +lat.toFixed(5)] },
    };
  });
  return { type: 'FeatureCollection', features };
}

export type HexProps = { n: number; mean: number };

// Pointy-top hexagonal binning in a cos(lat)-corrected plane.
export function hexbin(
  pts: FeatureCollection<Point, StationProps>,
  size = 0.045,
): FeatureCollection<Polygon, HexProps> {
  const kx = Math.cos((((BBOX.n + BBOX.s) / 2) * Math.PI) / 180);
  const w = Math.sqrt(3) * size;
  const bins = new Map<string, { q: number; r: number; vals: number[] }>();
  const center = (q: number, rr: number): [number, number] => [(w * (q + rr / 2)) / kx, 1.5 * size * rr];
  for (const f of pts.features) {
    const [lon, lat] = f.geometry.coordinates;
    const x = (lon * kx) / w - (lat / size) / 3;
    const y = lat / size / 1.5;
    const xf = x, zf = y, yf = -xf - zf;
    let rx = Math.round(xf), ry = Math.round(yf), rz = Math.round(zf);
    const dx = Math.abs(rx - xf), dy = Math.abs(ry - yf), dz = Math.abs(rz - zf);
    if (dx > dy && dx > dz) rx = -ry - rz;
    else if (dy > dz) ry = -rx - rz;
    else rz = -rx - ry;
    const q = rx, rr = rz;
    const k = `${q},${rr}`;
    if (!bins.has(k)) bins.set(k, { q, r: rr, vals: [] });
    bins.get(k)!.vals.push(f.properties.pm25);
  }
  const features: Feature<Polygon, HexProps>[] = [...bins.values()].map(({ q, r: rr, vals }) => {
    const [cx, cy] = center(q, rr);
    const ring = Array.from({ length: 7 }, (_, i) => {
      const a = (Math.PI / 180) * (60 * (i % 6) - 30);
      return [+(cx + (size * Math.cos(a)) / kx).toFixed(5), +(cy + size * Math.sin(a)).toFixed(5)];
    });
    return {
      type: 'Feature',
      properties: { n: vals.length, mean: +mean(vals)!.toFixed(2) },
      geometry: { type: 'Polygon', coordinates: [ring] },
    };
  });
  return { type: 'FeatureCollection', features };
}
