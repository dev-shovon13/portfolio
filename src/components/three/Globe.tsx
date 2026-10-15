"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export type GlobePlace = { name: string; lat: number; lon: number; color: string; origin?: boolean; label?: boolean; labelBelow?: boolean };

type Props = {
  places: GlobePlace[];
  /** Where the camera looks first. */
  focus: { lat: number; lon: number };
  /** Camera distance in globe radii; smaller is closer. */
  distance?: number;
  /** Idle spin speed (radians per frame). Ignored when `hold` is set. */
  spin?: number;
  /** Keep the focus point centred: sway gently around it and ease back after a drag. */
  hold?: boolean;
};

const toVec = (lat: number, lon: number, r = 1) => {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
};

const earthVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vPosW;
  void main() {
    vUv = uv;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vec4 w = modelMatrix * vec4(position, 1.0);
    vPosW = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;

const earthFragment = /* glsl */ `
  uniform sampler2D dayMap;
  uniform sampler2D nightMap;
  uniform sampler2D waterMap;
  uniform vec3 sunDir;
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vPosW;
  void main() {
    vec3 n = normalize(vNormalW);
    vec3 v = normalize(cameraPosition - vPosW);
    float d = dot(n, sunDir);
    float lit = smoothstep(-0.18, 0.32, d);
    vec3 day = texture2D(dayMap, vUv).rgb;
    vec3 night = texture2D(nightMap, vUv).rgb;
    float water = texture2D(waterMap, vUv).r;
    vec3 col = day * (0.22 + 0.95 * max(d, 0.0));
    col = mix(night * 1.6 + day * 0.04, col, lit);
    // Sun glint on the oceans.
    float spec = pow(max(dot(reflect(-sunDir, n), v), 0.0), 28.0) * water * lit;
    col += vec3(1.0, 0.92, 0.75) * spec * 0.55;
    // Blue haze toward the limb.
    float rim = pow(1.0 - max(dot(n, v), 0.0), 3.0);
    col += vec3(0.33, 0.62, 1.0) * rim * (0.15 + 0.4 * lit);
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

const atmosphereFragment = /* glsl */ `
  uniform vec3 sunDir;
  varying vec3 vNormalW;
  varying vec3 vPosW;
  void main() {
    vec3 n = normalize(vNormalW);
    vec3 v = normalize(cameraPosition - vPosW);
    float glow = pow(0.72 - dot(n, v), 3.0);
    float lit = 0.35 + 0.65 * smoothstep(-0.4, 0.5, dot(n, sunDir));
    gl_FragColor = vec4(vec3(0.36, 0.66, 1.0) * glow * lit * 1.25, glow * lit * 0.8);
  }
`;

/** A realistic Earth (NASA Blue Marble / Black Marble) with pins and arcs out of the origin place. */
export default function Globe({ places, focus, distance = 3.4, spin = 0.0012, hold = false }: Props) {
  const mount = useRef<HTMLDivElement>(null);
  const labels = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const host = mount.current;
    if (!host) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return; // No WebGL: the section reads fine without the globe.
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);
    renderer.domElement.setAttribute("aria-hidden", "true");

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
    camera.position.set(0, 0, distance);

    const world = new THREE.Group();
    const globe = new THREE.Group();
    world.add(globe);
    scene.add(world);

    // The sun sits upper-left and in front, so the terminator shows on the right limb.
    const sunDir = new THREE.Vector3(-0.55, 0.35, 0.76).normalize();

    const loader = new THREE.TextureLoader();
    const big = Math.min(window.innerWidth, window.innerHeight) * Math.min(window.devicePixelRatio, 2) > 900;
    const tex = (url: string, srgb = true) => {
      const t = loader.load(url);
      t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      if (srgb) t.colorSpace = THREE.SRGBColorSpace;
      return t;
    };
    const earthMat = new THREE.ShaderMaterial({
      uniforms: {
        dayMap: { value: tex(big ? "/earth/earth-day.webp" : "/earth/earth-day-2k.webp") },
        nightMap: { value: tex("/earth/earth-night.webp") },
        waterMap: { value: tex("/earth/earth-water.webp", false) },
        sunDir: { value: sunDir },
      },
      vertexShader: earthVertex,
      fragmentShader: earthFragment,
    });
    globe.add(new THREE.Mesh(new THREE.SphereGeometry(1, 96, 96), earthMat));

    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry(1.012, 72, 72),
      new THREE.MeshLambertMaterial({ color: "#ffffff", alphaMap: tex("/earth/earth-clouds.webp", false), transparent: true, opacity: 0.55, depthWrite: false }),
    );
    globe.add(clouds);

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.1, 64, 64),
      new THREE.ShaderMaterial({
        uniforms: { sunDir: { value: sunDir } },
        vertexShader: earthVertex,
        fragmentShader: atmosphereFragment,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
    );
    world.add(atmosphere);

    const sun = new THREE.DirectionalLight("#fff6e5", 2.4);
    sun.position.copy(sunDir).multiplyScalar(5);
    scene.add(sun);
    scene.add(new THREE.AmbientLight("#9fb6d8", 0.25));

    // Pins with pulsing halos.
    const origin = places.find((p) => p.origin) ?? places[0];
    const originV = toVec(origin.lat, origin.lon);
    const halos: THREE.Mesh[] = [];
    const pinVecs = places.map((p) => {
      const v = toVec(p.lat, p.lon, 1.006);
      const pin = new THREE.Mesh(new THREE.SphereGeometry(p.origin ? 0.014 : 0.01, 16, 16), new THREE.MeshBasicMaterial({ color: p.color }));
      pin.position.copy(v);
      globe.add(pin);
      const halo = new THREE.Mesh(
        new THREE.RingGeometry(0.016, 0.022, 32),
        new THREE.MeshBasicMaterial({ color: p.color, transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false }),
      );
      halo.position.copy(v);
      halo.lookAt(v.clone().multiplyScalar(2));
      globe.add(halo);
      halos.push(halo);
      return v;
    });

    // Arcs out of the origin, each with a travelling pulse.
    const arcs = places
      .filter((p) => p !== origin)
      .map((p, i) => {
        const end = toVec(p.lat, p.lon);
        const mid = originV.clone().add(end).multiplyScalar(0.5);
        const lift = 1 + originV.distanceTo(end) * 0.32;
        const curve = new THREE.QuadraticBezierCurve3(originV.clone().multiplyScalar(1.006), mid.normalize().multiplyScalar(lift), end.multiplyScalar(1.006));
        const geo = new THREE.TubeGeometry(curve, 80, 0.0035, 6, false);
        const tube = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: p.color, transparent: true, opacity: 0.95 }));
        geo.setDrawRange(0, still ? Infinity : 0);
        globe.add(tube);
        const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.009, 12, 12), new THREE.MeshBasicMaterial({ color: "#ffffff" }));
        pulse.visible = false;
        globe.add(pulse);
        return { curve, geo, total: geo.index ? geo.index.count : 0, pulse, delay: i * 0.18 };
      });

    // Turn the globe so the focus point faces the camera.
    const f = toVec(focus.lat, focus.lon);
    const baseY = Math.atan2(-f.x, f.z);
    // Tilt toward the viewer by the focus latitude so the focus point sits at the centre.
    // This only pitches the globe forward; north stays straight up on screen (no roll).
    const baseX = THREE.MathUtils.degToRad(focus.lat);
    globe.rotation.y = baseY;
    world.rotation.x = baseX;

    // Drag to spin, pointer tilts.
    let dragging = false;
    let lastX = 0;
    let offset = 0;
    let velocity = 0;
    let tiltX = 0;
    let tiltY = 0;
    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      host.setPointerCapture(e.pointerId);
    };
    const clamp = (n: number) => Math.max(-0.5, Math.min(0.5, n));
    // Tilt only follows a pointer that is over the globe; it eases back to level when it leaves.
    const onHover = (e: PointerEvent) => {
      const box = host.getBoundingClientRect();
      tiltX = clamp((e.clientY - box.top) / box.height - 0.5) * 0.25;
      tiltY = clamp((e.clientX - box.left) / box.width - 0.5) * 0.25;
    };
    const onLeave = () => {
      tiltX = 0;
      tiltY = 0;
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      velocity = (e.clientX - lastX) * 0.005;
      offset += velocity;
      lastX = e.clientX;
    };
    const onUp = () => (dragging = false);
    host.addEventListener("pointerdown", onDown);
    host.addEventListener("pointermove", onHover, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(1, height);
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    const t0 = performance.now();
    const elapsed = () => (performance.now() - t0) / 1000;
    let visible = true;
    let start = -1;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && start < 0) start = elapsed();
    }, { rootMargin: "80px" });
    io.observe(host);

    const v = new THREE.Vector3();
    const n = new THREE.Vector3();
    const camDir = new THREE.Vector3();
    let raf = 0;

    const placeLabels = () => {
      camera.getWorldDirection(camDir);
      pinVecs.forEach((p, i) => {
        const el = labels.current[i];
        if (!el) return;
        v.copy(p).applyMatrix4(globe.matrixWorld);
        n.copy(v).normalize();
        const facing = n.dot(camDir) < -0.2;
        v.project(camera);
        el.style.left = `${((v.x + 1) / 2) * 100}%`;
        el.style.top = `${((1 - v.y) / 2) * 100}%`;
        el.style.opacity = facing ? "1" : "0";
      });
    };

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) return;
      const t = elapsed() - Math.max(start, 0);
      if (!still) {
        if (!dragging) {
          velocity *= 0.94;
          if (hold) {
            // Gentle sway around the focus, and a slow return after a drag.
            offset += velocity;
            offset += (Math.sin(t * 0.35) * 0.22 - offset) * 0.012;
          } else {
            offset += velocity + spin;
          }
        }
        globe.rotation.y = baseY + offset;
        clouds.rotation.y += 0.00025;
        world.rotation.x += (baseX + tiltX - world.rotation.x) * 0.05;
        world.rotation.y += (tiltY - world.rotation.y) * 0.05;

        arcs.forEach((a) => {
          const p = THREE.MathUtils.clamp((t - 0.5 - a.delay) / 1.3, 0, 1);
          a.geo.setDrawRange(0, Math.floor(a.total * (1 - Math.pow(1 - p, 3))));
          a.pulse.visible = p >= 1;
          a.pulse.position.copy(a.curve.getPoint(((t - a.delay) * 0.3) % 1));
        });
        halos.forEach((h, i) => {
          const k = (t * 0.7 + i * 0.27) % 1;
          h.scale.setScalar(1 + k * 1.8);
          (h.material as THREE.MeshBasicMaterial).opacity = 0.9 * (1 - k);
        });
      }
      renderer.render(scene, camera);
      placeLabels();
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      host.removeEventListener("pointerdown", onDown);
      host.removeEventListener("pointermove", onHover);
      host.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          mats.forEach((m) => {
            Object.values((m as THREE.ShaderMaterial).uniforms ?? {}).forEach((u) => (u.value as THREE.Texture)?.dispose?.());
            (m as THREE.MeshLambertMaterial).alphaMap?.dispose();
            m.dispose();
          });
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [places, focus, distance, spin, hold]);

  return (
    <div ref={mount} className="relative size-full cursor-grab touch-pan-y active:cursor-grabbing [&>canvas]:size-full">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {places.map((p, i) =>
          p.label === false ? null : (
            <span
              key={p.name}
              ref={(el) => {
                labels.current[i] = el;
              }}
              className="fig absolute top-0 left-0 opacity-0 transition-opacity duration-300"
            >
              <span
                className={`${p.labelBelow ? "mt-2" : "-mt-2.5"} ml-3 block bg-chip/80 px-1.5 py-0.5 text-[10px] whitespace-nowrap uppercase`}
                style={{ color: p.color }}
              >
                {p.name}
              </span>
            </span>
          ),
        )}
      </div>
    </div>
  );
}
