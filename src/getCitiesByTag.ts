import { City } from "../types";

export function getCitiesByTag(tag: string, isActive: boolean, cities: City[]) {
  return cities.filter((city) => {
    const cityHasTag = city.tags.includes(tag);
    return cityHasTag && city.isActive === isActive;
  });
}
