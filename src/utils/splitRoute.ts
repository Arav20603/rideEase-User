import haversine from "haversine";
import polyline from "@mapbox/polyline";

export const splitRoute = (route: any, numSegments: number) => {
  const encoded = route?.overview_polyline?.points;
  if (!encoded) {
    console.warn("⚠️ No polyline found in route");
    return [];
  }

  const points = polyline.decode(encoded).map(([lat, lng]) => ({
    latitude: lat,
    longitude: lng,
  }));

  if (points.length < 2) {
    console.warn("⚠️ Not enough points in route polyline");
    return [];
  }

  let totalDist = 0;
  for (let i = 1; i < points.length; i++) {
    totalDist += haversine(points[i - 1], points[i], { unit: "meter" });
  }

  const totalKm = totalDist / 1000;
  console.log(`📏 Total route distance: ${totalKm.toFixed(2)} km`);

  const segmentDist = totalDist / numSegments;
  const stops = [points[0]];

  let distSoFar = 0;
  let nextTarget = segmentDist;

  for (let i = 1; i < points.length; i++) {
    const stepDist = haversine(points[i - 1], points[i], { unit: "meter" });
    distSoFar += stepDist;

    if (distSoFar >= nextTarget && stops.length < numSegments) {
      stops.push(points[i]);
      nextTarget += segmentDist;
    }
  }

  const last = points[points.length - 1];
  const lastStop = stops[stops.length - 1];
  if (lastStop.latitude !== last.latitude || lastStop.longitude !== last.longitude) {
    stops.push(last);
  }

  console.log(`🧩 Segments: ${numSegments}`);
  console.log("✅ Computed Stops:", stops);

  return stops.map((p) => ({ lat: p.latitude, lng: p.longitude }));
};
