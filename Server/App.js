const express = require("express");
const app = express();
const port = 5000;
const host = "localhost";
const cors = require("cors");
const database = require("./db");
const allRoutes = require("./Routes/Index");

//DATABASE WORK
database();

//Other app setters
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(express.json());

//Routes
app.use("/api/v1", allRoutes);

//Listing the server
app.listen(port, host, () =>
  console.log(`✅ server is at http://${host}:${port}`)
);
