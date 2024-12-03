import express, { Express } from "express";
import fs from "fs-extra";
import dotenv from "dotenv";
import { Readable } from "stream";
import { City } from "../types";
import { authenticateToken } from "./authenticateToken";
import { getCitiesByTag } from "./getCitiesByTag";
import { getDistanceBetweenCities } from "./getDistanceBetweenCities";
import { getCitiesWithinDistance } from "./getCitiesWithinDistance";
import { validateQueryParams } from "./validateQueryParams";
import {
  areaSchemaFactory,
  citiesByTagSchema,
  distanceSchemaFactory,
} from "./schema";

dotenv.config();

const app: Express = express();
const host = process.env.HOST || "127.0.0.1";
const port = +(process.env.PORT || 8080); //+ to parse env variable to number

if (isNaN(port)) {
  throw new Error("Invalid PORT value in environment variables");
}

//Load data from adresses.json
export let citiesData: City[] = [];

fs.readJson("addresses.json")
  .then((data) => {
    citiesData = data;
  })
  .catch((err) => {
    console.error("Error reading addresses.json", err);
  });

//Add Authentication Middleware to all routes
app.use(authenticateToken);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get(
  "/cities-by-tag",
  validateQueryParams(citiesByTagSchema),
  (req, res) => {
    const { tag, isActive } = req.query;
    const result = getCitiesByTag(tag as string, Boolean(isActive), citiesData);
    res.status(200).send({ cities: result });
    return;
  }
);

const distanceSchema = distanceSchemaFactory(citiesData);
app.get("/distance", validateQueryParams(distanceSchema), (req, res) => {
  const { from, to } = req.query;
  const startCity = citiesData.find((city) => city.guid === from)!;
  const endCity = citiesData.find((city) => city.guid === to)!;

  const result = getDistanceBetweenCities(startCity, endCity);
  res.status(200).send(result);
});

const areaJobs = new Map<
  string,
  { status: "completed" | "pending" | "error"; result?: City[] | string }
>();
const areaSchema = areaSchemaFactory(citiesData);
app.get("/area", validateQueryParams(areaSchema), (req, res) => {
  const { from, distance } = req.query;

  const targetDistance = Number(distance);
  const fromCity = citiesData.find((city) => city.guid === from);
  if (!fromCity) {
    res.status(400).send({ message: `No city found with ID: ${from}` });
    return;
  }

  //IRL we would generate unique uuids
  const jobID = "2152f96f-50c7-4d76-9e18-f7033bd14428";

  areaJobs.set(jobID, { status: "pending" });
  runAreaInBackground(jobID, fromCity, targetDistance);
  res.status(202).send({
    resultsUrl: `http://${host}:${port}/area-result/${jobID}`,
  });
});

app.get("/area-result/:id", (req, res) => {
  const { id } = req.params;
  const job = areaJobs.get(id);
  if (!job) {
    res.status(400).send({ message: `No job found with id ${id}` });
    return;
  }
  switch (job.status) {
    case "completed":
      res.status(200).send({ cities: job.result });
      break;
    case "error":
      res.status(500).send({ message: job.result });
      break;
    case "pending": //treat pending as the default case
    default:
      res.status(202).send();
      break;
  }
});

app.get("/all-cities", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="all-cities.json"'
  );

  let index = 0;
  const dataLength = citiesData.length;

  const cityStream = new Readable({
    objectMode: true,
    read() {
      if (index < dataLength) {
        const city = JSON.stringify(citiesData[index]);
        this.push(index === 0 ? "[" + city : "," + city);
        index++;
      } else {
        this.push("]\n");
        this.push(null);
      }
    },
  });

  cityStream.pipe(res);

  cityStream.on("error", (err) => {
    res.status(500).send({ error: "Failed to stream cities data." });
  });
});

app.listen(port, host, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

//TODO: make it async or threaded to handle large dataset
function runAreaInBackground(id: string, city: City, distance: number) {
  try {
    const result = getCitiesWithinDistance(city, distance);
    areaJobs.set(id, { status: "completed", result });
  } catch (error) {
    areaJobs.set(id, {
      status: "error",
      result: "An unexpected error occured",
    });
  }
}
