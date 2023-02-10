require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./routes/router");
const connectDB = require("./db/conn");

const port = process.env.PORT || 8009;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json("server start");
});

app.use(router);

const start = async () => {
  try {
    await connectDB(process.env.DATABASE);
    console.log("Connection start");
    app.listen(port, () => {
      console.log(`server is started at port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
