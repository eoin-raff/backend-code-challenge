import express, { Express, Request, Response } from "express";
import fs from "fs-extra";
import dotenv from "dotenv";
import { authenticateToken } from "./authenticateToken";
import { getCitiesByTag } from "./getCitiesByTag";
import { City } from "../types";

dotenv.config();

const app: Express = express();
const host = process.env.HOST || "127.0.0.1";
const port = +(process.env.PORT || 8080); //+ to ensure that port is a number

if (isNaN(port)) {
  throw new Error("Invalid PORT value in environment variables");
}

//load data into server
let citiesData: City[] = [];
fs.readJson("../addresses.json")
  .then((data) => {
    citiesData = data;
  })
  .catch((err) => {
    console.error("Error reading addresses.json", err);
  });

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running");
});

app.use("/cities-by-tag", authenticateToken);

app.get("/cities-by-tag", (req: Request, res: Response) => {
  const { tag, isActive } = req.query;
  if (!tag || typeof tag !== "string") {
    res.status(400).send({ error: "Invalid Tag" });
    return;
  }
  if (isActive === undefined && isActive !== "true" || isActive !== "false") {
    res.status(400).send({ error: "Invalid value for isActive" });
    return;
  }

  const result = getCitiesByTag(tag, Boolean(isActive), citiesData);
  res.status(200).send(result);
  return;
});

app.listen(port, host, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
