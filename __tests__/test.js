import request from "supertest";
import app from "../index"; // Change this to refer to index.js

describe("GET /api/:date", () => {
  it("date: 20240101 should add two numbers correctly", async () => {
    // expect(add(1, 2)).toBe(3); // Kiểm tra nếu hàm add(1, 2) trả về 3
    console.log("start");
    const response = await request(app).get("/api/2024-01-01"); // Make GET request to /api/greet
    console.log("response status" + response.status);
    expect(response.status).toBe(200); // Check status code is 200
    expect(response.text).toBe("Mon, 01 Jan 2024 00:00:00 GMT");
  });

  it("date: 20240101 should add two numbers correctly", async () => {
    // expect(add(1, 2)).toBe(3); // Kiểm tra nếu hàm add(1, 2) trả về 3
    console.log("start");
    const response = await request(app).get("/api/abc"); // Make GET request to /api/greet
    console.log("response status" + response.status);
    expect(response.status).toBe(400); // Check status code is 200
    expect(response.text).toBe("Invalid Date");
  });

  it("date: 20240101 should add two numbers correctly", async () => {
    // expect(add(1, 2)).toBe(3); // Kiểm tra nếu hàm add(1, 2) trả về 3
    console.log("start");
    const response = await request(app).get("/api/1743229701358"); // Make GET request to /api/greet
    console.log("response status" + response.status);
    expect(response.status).toBe(200); // Check status code is 200
    expect(response.body.unix).toBe("1743229701358");
    expect(response.body.utc).toBe("Sat, 29 Mar 2025 06:28:21 GMT");
  });
});
