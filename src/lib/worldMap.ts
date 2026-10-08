// Server-side only: projects Natural Earth country shapes (world-atlas) to SVG paths at build time,
// so the client receives finished path strings and no map libraries.
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import world110 from "world-atlas/countries-110m.json";
import world50 from "world-atlas/countries-50m.json";
import { travelPlaces } from "@/content/profile";

export const MAP_W = 1000;
export const MAP_H = 520;

/** Visited countries (ISO 3166 numeric), lit in this order. */
const VISITED = [
  { id: "050", name: "Bangladesh", color: "#ffd23f" },
  { id: "356", name: "India", color: "#62f9d5" },
  { id: "702", name: "Singapore", color: "#6ec8ff" },
  { id: "458", name: "Malaysia", color: "#6ec8ff" },
];

const COUNTRY_OF: Record<string, string> = {
  Dhaka: "050",
  Kolkata: "356",
  Agra: "356",
  Delhi: "356",
  Manali: "356",
  Singapore: "702",
};

type Countries = FeatureCollection<Geometry, { name: string }>;
const countries = (t: unknown) => {
  const topo = t as Topology<{ countries: GeometryCollection<{ name: string }> }>;
  return feature(topo, topo.objects.countries) as Countries;
};

export type WorldMap = {
  base: { id: string; d: string }[];
  visited: { id: string; name: string; color: string; d: string; step: number }[];
  cities: { name: string; x: number; y: number; color: string; label: boolean; step: number; origin: boolean }[];
  arcs: { name: string; d: string; color: string; step: number }[];
  focus: { cx: number; cy: number; scale: number };
};

export function getWorldMap(): WorldMap {
  const base = countries(world110).features.filter((f) => f.id !== "010"); // drop Antarctica
  const detail = countries(world50).features;

  const projection = geoNaturalEarth1().fitExtent(
    [
      [8, 8],
      [MAP_W - 8, MAP_H - 8],
    ],
    { type: "FeatureCollection", features: base } as Countries,
  );
  const path = geoPath(projection).digits(1);

  const visited = VISITED.map((v, i) => {
    const f = detail.find((x) => x.id === v.id) as Feature<Geometry, { name: string }>;
    return { ...v, d: path(f) ?? "", step: Math.min(i, 2) };
  });
  const stepOf = (countryId: string) => visited.find((v) => v.id === countryId)?.step ?? 2;

  const cities = travelPlaces.map((p) => {
    const [x, y] = projection([p.lon, p.lat]) ?? [0, 0];
    return {
      name: p.name,
      x: +x.toFixed(1),
      y: +y.toFixed(1),
      color: p.color,
      label: p.label !== false,
      origin: Boolean(p.origin),
      step: stepOf(COUNTRY_OF[p.name] ?? "458"),
    };
  });

  const origin = cities.find((c) => c.origin)!;
  const arcs = cities
    .filter((c) => !c.origin)
    .map((c) => {
      const mx = (origin.x + c.x) / 2;
      const my = (origin.y + c.y) / 2;
      const lift = Math.hypot(c.x - origin.x, c.y - origin.y) * 0.35;
      return { name: c.name, d: `M${origin.x} ${origin.y}Q${mx.toFixed(1)} ${(my - lift).toFixed(1)} ${c.x} ${c.y}`, color: c.color, step: c.step };
    });

  // Zoom target: South and Southeast Asia, from Manali down to Singapore.
  const [x0, y0] = projection([66, 36])!;
  const [x1, y1] = projection([112, -4])!;
  const scale = Math.min(MAP_W / (x1 - x0), MAP_H / (y1 - y0)) * 0.92;

  return {
    // A few shapes (e.g. Kosovo, N. Cyprus) carry no ISO id; give them unique keys.
    base: base.map((f, i) => ({ id: f.id == null ? `x${i}` : String(f.id), d: path(f) ?? "" })).filter((b) => !VISITED.some((v) => v.id === b.id)),
    visited,
    cities,
    arcs,
    focus: { cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, scale: +scale.toFixed(3) },
  };
}
