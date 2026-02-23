import express from "express";
import dotenv from "dotenv";
import { engine } from "express-handlebars";
import path from "path";
import homeRouter from "./controllers/home.ts";

const __dirname = import.meta.dirname;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use("/", homeRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
