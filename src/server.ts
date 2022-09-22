require("dotenv").config();
import express, { Request, Response } from "express";
import cors from "cors";
import { config } from "./routers/templates/helpers";
config();

const app: express.Application = express();

// server middleware
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cors());

// Middleware
import defineCurrentUser from "./middleware/defineCurrentUser";
app.use(defineCurrentUser)

// Routes
import Testing from "./routers/testing";
app.use("/", Testing);

import Solution from "./routers/solution";
app.use("/solution", Solution);

// Start
app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}.`);
});
