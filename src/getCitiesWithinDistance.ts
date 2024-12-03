import { citiesData } from ".";
import { City } from "../types";
import { haversineDistance } from "./utils";

export function getCitiesWithinDistance(fromCity: City, targetDistance: number) {
  const citiesWithinDistance = citiesData
    .map((toCity) => {
      if (toCity.guid === fromCity.guid) {
        return null;
      }
      const calculatedDistance = haversineDistance(fromCity, toCity);
      if (calculatedDistance > targetDistance) {
        return null;
      }
      return toCity;
    })
    .filter((val) => val !== null);
  return citiesWithinDistance;
}
