import { mean, deviation } from 'd3-array';
import { rng } from './rng';

export type Row = { x: number; y: number; z: number; g: 0 | 1 | 2 };

export function dataset(n = 260, seed = 7): Row[] {
  const r = rng(seed);
  const centers = [[-1.4, -0.6], [0.2, 1.2], [1.5, -0.3]] as const;
  return Array.from({ length: n }, () => {
    const g = Math.floor(r.next() * 3) as 0 | 1 | 2;
    const [cx, cy] = centers[g];
    const x = cx + r.normal() * 0.6;
    const y = 0.7 * x + cy * 0.6 + r.normal() * 0.45;
    const z = 0.4 * x - 0.5 * y + r.normal() * 0.8;
    return { x, y, z, g };
  });
}

export function ols(xs: number[], ys: number[]) {
  const mx = mean(xs)!, my = mean(ys)!;
  let sxy = 0, sxx = 0, syy = 0;
  xs.forEach((x, i) => {
    sxy += (x - mx) * (ys[i] - my);
    sxx += (x - mx) ** 2;
    syy += (ys[i] - my) ** 2;
  });
  const slope = sxy / sxx;
  return { slope, intercept: my - slope * mx, r2: (sxy * sxy) / (sxx * syy) };
}

export function pearson(a: number[], b: number[]) {
  const ma = mean(a)!, mb = mean(b)!;
  const sa = deviation(a)!, sb = deviation(b)!;
  let s = 0;
  a.forEach((v, i) => (s += (v - ma) * (b[i] - mb)));
  return s / ((a.length - 1) * sa * sb);
}
