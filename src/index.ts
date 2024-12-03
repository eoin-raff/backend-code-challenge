import express, { Express, Request, Response } from "express";
import fs from "fs-extra";
import dotenv from "dotenv";
import { authenticateToken } from "./authenticateToken";
import { getCitiesByTag } from "./getCitiesByTag";
import { City } from "../types";
import { Routes } from "./routes";
import { start } from "repl";
import { getDistanceBetweenCities } from "./getDistanceBetweenCities";

dotenv.config();

const app: Express = express();
const host = process.env.HOST || "127.0.0.1";
const port = +(process.env.PORT || 8080); //+ to ensure that port is a number

if (isNaN(port)) {
  throw new Error("Invalid PORT value in environment variables");
}

//load data into server
let citiesData: City[] = [];
fs.readJson("addresses.json")
  .then((data) => {
    citiesData = data;
  })
  .catch((err) => {
    console.error("Error reading addresses.json", err);
  });

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running");
});

app.use(Routes.CITIES_BY_TAG, authenticateToken);
app.get(Routes.CITIES_BY_TAG, (req: Request, res: Response) => {
  const { tag, isActive } = req.query;
  if (!tag || typeof tag !== "string") {
    res.status(400).send({ message: `Invalid tag: ${tag}` });
    return;
  }
  if (isActive === undefined || (isActive !== "true" && isActive !== "false")) {
    res.status(400).send({ message: `Invalid isActive value: ${isActive}` });
    return;
  }
  const result = getCitiesByTag(tag as string, Boolean(isActive), citiesData);
  res.status(200).send({ cities: result });
  return;
});

app.use(Routes.DISTANCE, authenticateToken);
app.get(Routes.DISTANCE, (req: Request, res: Response) => {
  const { from, to } = req.query;
  const startCity = citiesData.find((city) => city.guid === from);
  const endCity = citiesData.find((city) => city.guid === to);

  if (!startCity) {
    res.status(400).send({ message: `No city found with ID ${from}` });
    return;
  }
  if (!endCity) {
    res.status(400).send({ message: `No city found with ID ${to}` });
    return;
  }
  const result = getDistanceBetweenCities(startCity, endCity);
});

app.use(Routes.AREA, authenticateToken);
app.get(Routes.AREA, (req: Request, res: Response) => {});

app.use(Routes.ALL_CITIES, authenticateToken);
app.get(Routes.ALL_CITIES, (req: Request, res: Response) => {});

app.listen(port, host, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
