// Server-only: ray-traces the hero globe for the generated share image (app/opengraph-image.tsx).
// Same textures, camera, sun and shading as components/three/Globe.tsx at rest, so the image follows
// the live globe; arcs, pins and labels come back projected, to be drawn as SVG on top.
import { join } from "node:path";
import sharp from "sharp";

type V3 = [number, number, number];
type Place = { name: string; lat: number; lon: number; color: string; origin?: boolean; label?: boolean; labelBelow?: boolean };

const RAD = Math.PI / 180;
const FOV = 30; // vertical, degrees: matches the PerspectiveCamera
const SS = 2; // supersampling for smooth limbs

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const norm = (a: V3): V3 => {
  const l = Math.hypot(a[0], a[1], a[2]);
  return [a[0] / l, a[1] / l, a[2] / l];
};
const rotX = ([x, y, z]: V3, a: number): V3 => [x, y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)];
const rotY = ([x, y, z]: V3, a: number): V3 => [x * Math.cos(a) + z * Math.sin(a), y, -x * Math.sin(a) + z * Math.cos(a)];
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};
const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toSrgb = (c: number) => (c <= 0 ? 0 : c >= 1 ? 1 : c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055);
const hex = (h: string): V3 => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as V3;
const SRGB_LUT = Float32Array.from({ length: 256 }, (_, i) => toLinear(i / 255));

const toVec = (lat: number, lon: number, r = 1): V3 => {
  const phi = (90 - lat) * RAD;
  const theta = (lon + 180) * RAD;
  return [-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta)];
};

type Tex = { data: Buffer; w: number; h: number; srgb: boolean };
const load = async (file: string, srgb: boolean): Promise<Tex> => {
  const { data, info } = await sharp(join(process.cwd(), "public/earth", file)).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height, srgb };
};

/** Bilinear sample (wrapping in u) of channel 0..2 into `out`, in linear light for sRGB maps. */
function sample(t: Tex, u: number, v: number, out: V3) {
  const x = u * t.w - 0.5;
  const y = Math.min(Math.max(v * t.h - 0.5, 0), t.h - 1);
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const fx = x - x0;
  const fy = y - y0;
  const xa = ((x0 % t.w) + t.w) % t.w;
  const xb = (xa + 1) % t.w;
  const ya = y0 * t.w;
  const yb = Math.min(y0 + 1, t.h - 1) * t.w;
  for (let c = 0; c < 3; c++) {
    const a = t.data[(ya + xa) * 3 + c], b = t.data[(ya + xb) * 3 + c];
    const d = t.data[(yb + xa) * 3 + c], e = t.data[(yb + xb) * 3 + c];
    const [pa, pb, pd, pe] = t.srgb ? [SRGB_LUT[a], SRGB_LUT[b], SRGB_LUT[d], SRGB_LUT[e]] : [a / 255, b / 255, d / 255, e / 255];
    out[c] = (pa * (1 - fx) + pb * fx) * (1 - fy) + (pd * (1 - fx) + pe * fx) * fy;
  }
}

export type ShareGlobe = {
  /** PNG data URI of the shaded globe, already composited on `background`. */
  src: string;
  arcs: { name: string; d: string; color: string; width: number }[];
  pins: { name: string; x: number; y: number; r: number; ring: number; color: string }[];
  labels: { name: string; x: number; y: number; color: string; below: boolean }[];
};

export async function renderShareGlobe({
  places,
  focus,
  distance,
  width,
  height,
  background,
}: {
  places: Place[];
  focus: { lat: number; lon: number };
  distance: number;
  /** Canvas size in image pixels; the globe sits at its centre as in the hero's canvas. */
  width: number;
  height: number;
  background: string;
}): Promise<ShareGlobe> {
  const [day, night, water, clouds] = await Promise.all([
    load("earth-day-2k.webp", true),
    load("earth-night.webp", true),
    load("earth-water.webp", false),
    load("earth-clouds.webp", false),
  ]);

  // Camera on +z looking at the origin; the globe turned so the focus faces it, north up (see Globe.tsx).
  const cam: V3 = [0, 0, distance];
  const f0 = toVec(focus.lat, focus.lon);
  const baseY = Math.atan2(-f0[0], f0[2]);
  const baseX = focus.lat * RAD;
  const toWorld = (p: V3) => rotX(rotY(p, baseY), baseX);
  const toLocal = (p: V3) => rotY(rotX(p, -baseX), -baseY);

  const cx = width / 2;
  const cy = height / 2;
  const focal = height / 2 / Math.tan((FOV / 2) * RAD);
  const project = (p: V3) => {
    const s = focal / (distance - p[2]);
    return { x: cx + p[0] * s, y: cy - p[1] * s, s };
  };
  // Is a world point behind the earth from the camera?
  const occluded = (p: V3) => {
    const dir: V3 = [p[0] - cam[0], p[1] - cam[1], p[2] - cam[2]];
    const len = Math.hypot(...dir);
    const d = norm(dir);
    const b = dot(cam, d);
    const disc = b * b - (dot(cam, cam) - 1);
    if (disc <= 0) return false;
    const t = -b - Math.sqrt(disc);
    return t > 0 && t < len - 1e-3;
  };

  const sun = norm([-0.55, 0.35, 0.76]);
  const sunColor = hex("#fff6e5").map(toLinear) as V3;
  const ambient = hex("#9fb6d8").map(toLinear) as V3;
  const bg = hex(background);

  const W = Math.round(width * SS);
  const H = Math.round(height * SS);
  const px = Buffer.alloc(W * H * 3);
  const dayC: V3 = [0, 0, 0], nightC: V3 = [0, 0, 0], waterC: V3 = [0, 0, 0], cloudC: V3 = [0, 0, 0];
  const out: V3 = [0, 0, 0];
  const c2 = dot(cam, cam);

  for (let j = 0; j < H; j++) {
    for (let i = 0; i < W; i++) {
      const dir = norm([((i + 0.5) / SS - cx) / focal, -((j + 0.5) / SS - cy) / focal, -1]);
      const b = dot(cam, dir);
      const discEarth = b * b - (c2 - 1);

      if (discEarth > 0) {
        // Earth: the ShaderMaterial in Globe.tsx, in linear light.
        const t = -b - Math.sqrt(discEarth);
        const n: V3 = [cam[0] + dir[0] * t, cam[1] + dir[1] * t, cam[2] + dir[2] * t];
        const v: V3 = [-dir[0], -dir[1], -dir[2]];
        const local = toLocal(n);
        const u = Math.atan2(local[2], -local[0]) / (2 * Math.PI);
        const vv = 0.5 - Math.asin(Math.max(-1, Math.min(1, local[1]))) / Math.PI;
        sample(day, u, vv, dayC);
        sample(night, u, vv, nightC);
        sample(water, u, vv, waterC);
        sample(clouds, u, vv, cloudC);

        const d = dot(n, sun);
        const lit = smoothstep(-0.18, 0.32, d);
        const r: V3 = [-sun[0] + 2 * d * n[0], -sun[1] + 2 * d * n[1], -sun[2] + 2 * d * n[2]];
        const spec = Math.max(dot(r, v), 0) ** 28 * waterC[0] * lit;
        const rim = (1 - Math.max(dot(n, v), 0)) ** 3;
        const glint = [1, 0.92, 0.75], haze = [0.33, 0.62, 1];
        // Clouds: white Lambert under the sun and ambient lights, alpha from the cloud map at 0.55 opacity.
        const ca = cloudC[1] * 0.55;
        for (let k = 0; k < 3; k++) {
          let col = dayC[k] * (0.22 + 0.95 * Math.max(d, 0));
          const dark = nightC[k] * 1.6 + dayC[k] * 0.04;
          col = dark + (col - dark) * lit;
          col += glint[k] * spec * 0.55 + haze[k] * rim * (0.15 + 0.4 * lit);
          const cloud = (2.4 * Math.max(d, 0) * sunColor[k] + 0.25 * ambient[k]) / Math.PI;
          out[k] = toSrgb(cloud) * ca + toSrgb(col) * (1 - ca);
        }
      } else {
        // Atmosphere: the back faces of a 1.1 shell, additive over the page.
        const discAtm = b * b - (c2 - 1.21);
        let a = 0;
        const rgb: V3 = [0, 0, 0];
        if (discAtm > 0) {
          const t = -b + Math.sqrt(discAtm);
          const p: V3 = [cam[0] + dir[0] * t, cam[1] + dir[1] * t, cam[2] + dir[2] * t];
          const n: V3 = [p[0] / 1.1, p[1] / 1.1, p[2] / 1.1];
          const glow = (0.72 - dot(n, [-dir[0], -dir[1], -dir[2]])) ** 3;
          const lit = 0.35 + 0.65 * smoothstep(-0.4, 0.5, dot(n, sun));
          const tint = [0.36, 0.66, 1];
          for (let k = 0; k < 3; k++) rgb[k] = Math.min(1, tint[k] * glow * lit * 1.25);
          a = Math.min(1, glow * lit * 0.8);
        }
        for (let k = 0; k < 3; k++) out[k] = rgb[k] * a + bg[k] * (1 - a);
      }

      const o = (j * W + i) * 3;
      px[o] = Math.round(Math.min(1, out[0]) * 255);
      px[o + 1] = Math.round(Math.min(1, out[1]) * 255);
      px[o + 2] = Math.round(Math.min(1, out[2]) * 255);
    }
  }

  const png = await sharp(px, { raw: { width: W, height: H, channels: 3 } })
    .resize(Math.round(width), Math.round(height), { kernel: "lanczos3" })
    .png({ compressionLevel: 9 })
    .toBuffer();

  // Arcs out of the origin: the same lifted quadratic curves, split where they pass behind the earth.
  const origin = places.find((p) => p.origin) ?? places[0];
  const o = toVec(origin.lat, origin.lon);
  const arcs = places
    .filter((p) => p !== origin)
    .map((p) => {
      const e = toVec(p.lat, p.lon);
      const mid = norm([(o[0] + e[0]) / 2, (o[1] + e[1]) / 2, (o[2] + e[2]) / 2]);
      const lift = 1 + Math.hypot(o[0] - e[0], o[1] - e[1], o[2] - e[2]) * 0.32;
      const ctrl: V3 = [mid[0] * lift, mid[1] * lift, mid[2] * lift];
      const a: V3 = [o[0] * 1.006, o[1] * 1.006, o[2] * 1.006];
      const z: V3 = [e[0] * 1.006, e[1] * 1.006, e[2] * 1.006];
      let d = "";
      let pen = false;
      let s = 0;
      const STEPS = 96;
      for (let i = 0; i <= STEPS; i++) {
        const t = i / STEPS;
        const q = (k: number) => (1 - t) ** 2 * a[k] + 2 * (1 - t) * t * ctrl[k] + t * t * z[k];
        const w = toWorld([q(0), q(1), q(2)]);
        if (occluded(w)) {
          pen = false;
          continue;
        }
        const pt = project(w);
        if (i === STEPS / 2) s = pt.s;
        d += `${pen ? "L" : "M"}${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
        pen = true;
      }
      return { name: p.name, d, color: p.color, width: +(0.007 * (s || focal / distance)).toFixed(2) };
    })
    .filter((a) => a.d);

  // Pins with their halo rings caught mid-pulse, and labels for pins facing the camera.
  const pins: ShareGlobe["pins"] = [];
  const labels: ShareGlobe["labels"] = [];
  for (const p of places) {
    const w = toWorld(toVec(p.lat, p.lon, 1.006));
    if (occluded(w) || w[2] <= 0) continue;
    const pt = project(w);
    pins.push({ name: p.name, x: pt.x, y: pt.y, r: (p.origin ? 0.014 : 0.01) * pt.s, ring: 0.019 * 1.6 * pt.s, color: p.color });
    if (p.label !== false && w[2] / 1.006 > 0.2) labels.push({ name: p.name, x: pt.x, y: pt.y, color: p.color, below: Boolean(p.labelBelow) });
  }

  return { src: `data:image/png;base64,${png.toString("base64")}`, arcs, pins, labels };
}
