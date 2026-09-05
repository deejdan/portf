export const COIL_RING_COUNT = 88;

// Cache the resting 3D geometry; pointer frames only rotate and project it.
const rings = Array.from({ length: COIL_RING_COUNT }, (_, index) => {
  const u = (index / COIL_RING_COUNT) * Math.PI * 2;
  return Array.from({ length: 65 }, (_, step) => {
    const v = (step / 64) * Math.PI * 2;
    const radius = 165 + 61 * Math.cos(v);
    const x = radius * Math.cos(u);
    const y = radius * Math.sin(u);
    const z = 61 * Math.sin(v);
    const tiltedY = y * Math.cos(0.91) - z * Math.sin(0.91);
    return {
      x: x * Math.cos(-0.63) - tiltedY * Math.sin(-0.63),
      y: x * Math.sin(-0.63) + tiltedY * Math.cos(-0.63),
      z: y * Math.sin(0.91) + z * Math.cos(0.91),
    };
  });
});

export function coilPaths(direction = 0) {
  const position = Math.max(-1, Math.min(1, direction));
  const angle = position * 0.42;
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);

  return rings.map((ring) => ring.map((point, step) => {
    const x = point.x * cosine + point.z * sine;
    const depth = -point.x * sine + point.z * cosine;
    const perspective = 760 / (760 - depth);
    return `${step === 0 ? "M" : "L"}${(300 + x * perspective + position * 12).toFixed(2)},${(300 + point.y * perspective).toFixed(2)}`;
  }).join(" ") + " Z");
}

export const RESTING_COIL_PATHS = coilPaths();
