import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const host = process.env.HOST || "127.0.0.1";
const port = +(process.env.PORT || 8080); //+ to parse env variable to number

app.listen(port, host, () => {
  console.log(`[server]: Server is running at http://${host}:${port}`);
});
