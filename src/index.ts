// src/index.ts
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import {authenticateToken} from './authenticateToken'

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;


app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use("/cities-by-tag", authenticateToken)

app.get("/cities-by-tag", (req: Request, res: Response) => {
    const {tag, isActive} = req.query
    res.status(200).send("GETTING CITIES");
  });

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});