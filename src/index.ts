import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { authenticateToken } from "./authenticateToken";

dotenv.config();

const app: Express = express();
const host = process.env.HOST || '127.0.0.1';
const port = +(process.env.PORT || 8080); //+ to ensure that port is a number

if (isNaN(port)) {
  throw new Error('Invalid PORT value in environment variables');
}

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running");
});

app.use("/cities-by-tag", authenticateToken);

app.get("/cities-by-tag", (req: Request, res: Response) => {
  const { tag, isActive } = req.query;
  res.status(200).send("GETTING CITIES");
});

app.listen(port, host, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
