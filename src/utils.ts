import { City } from "../types";

const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180;

export function haversineDistance(startCity: City, endCity: City) {
  const EARTH_RADIUS = 6371;

  const latitude1 = degreesToRadians(startCity.latitude);
  const latitude2 = degreesToRadians(endCity.latitude);
  const longitude1 = degreesToRadians(startCity.longitude);
  const longitude2 = degreesToRadians(endCity.longitude);

  const deltaLongitude = longitude2 - longitude1;
  const deltaLatitude = latitude2 - latitude1;

  const a =
    Math.sin(deltaLatitude / 2) ** 2 +
    Math.cos(latitude1) *
      Math.cos(latitude2) *
      Math.sin(deltaLongitude / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS * c;
}
