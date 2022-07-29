require('dotenv').config();
import express, {Request, Response} from "express";
import cors from "cors";

const app: express.Application = express();

// server middleware
app.use(
    express.urlencoded({
    extended: true,
  })
);

app.use(cors());

// start
app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}.`);
});