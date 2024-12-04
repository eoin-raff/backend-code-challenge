import { get } from "http";
import { getCitiesByTag } from "../../getCitiesByTag";
import { City } from "../../../types";

describe("getCitiesByTag", () => {
  const citiesData: City[] = [
    {
      guid: "1",
      tags: ["test", "example"],
      isActive: true,
      address: "",
      latitude: 0,
      longitude: 0,
    },
    {
      guid: "2",
      tags: ["test"],
      isActive: false,
      address: "",
      latitude: 0,
      longitude: 0,
    },
    {
      guid: "3",
      tags: ["example"],
      isActive: true,
      address: "",
      latitude: 0,
      longitude: 0,
    },
  ];

  it("returns cities with the matching tag and active status", () => {
    const activeTestCities = getCitiesByTag("test", true, citiesData);
    const inactiveTestCities = getCitiesByTag("test", false, citiesData);
    expect(activeTestCities).toEqual([
      {
        guid: "1",
        tags: ["test", "example"],
        isActive: true,
        address: "",
        latitude: 0,
        longitude: 0,
      },
    ]);
    expect(inactiveTestCities).toEqual([
        {
            guid: "2",
            tags: ["test"],
            isActive: false,
            address: "",
            latitude: 0,
            longitude: 0,
          },
    ]);
  });

  it("returns an empty array for if no matching tags are found", () => {
    const result = getCitiesByTag("invalid", true, citiesData);
    expect(result).toEqual([]);
  });

  it("returns an empty array for if no matching active states are found", () => {
    const result = getCitiesByTag("example", false, citiesData);
    expect(result).toEqual([]);
  });
});
