import { City } from "../types";
import { haversineDistance } from "./utils";

type Distance = {
  from: City;
  to: City;
  unit: "km";
  distance: number;
};

export function getDistanceBetweenCities(
  startCity: City,
  endCity: City
): Distance {
  const distance = haversineDistance(startCity, endCity);
  return {
    from: startCity,
    to: endCity,
    unit: "km",
    distance: Number(distance.toFixed(2)),
  };
}
