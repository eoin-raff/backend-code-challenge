import request from "supertest";
import app from "../../app";

describe("API Endpoints", () => {
  describe("GET /", () => {
    it("should return a 200 status", async () => {
      const response = await request(app).get("/");
      expect(response.status).toBe(200);
      expect(response.text).toBe("Server is running");
    });
  });
  describe("GET /cities-by-tag", () => {
    it("should return a 200 status with valid parameters", async () => {
      const response = await request(app).get(
        "/cities-by-tag?tag=excepteurus&isActive=true"
      );
      expect(response.status).toBe(200);
    });
  });
});
