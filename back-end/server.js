import express from "express";
import connect from "./database/connect.mjs";
import rootRouter from "./routes/rootRouter.mjs";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT;

connect();
app.use(express.json());

app.use(cors());
app.use(rootRouter);
app.use(function (req, res, next) {
  res
    .status(404)
    .send("Sorry, that route doesn't exist. Have a nice day yeahh!");
});
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
