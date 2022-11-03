const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.pwgovse.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const databaseMaker = async () => {
  try {
    const database = client.db("ginusCar").collection("services");
    app.get("/services", async (req, res) => {
      const data = database.find({});
      const result = await data.toArray();
      res.send(result);
    });
    app.get("/services/:id", async (req, res) => {
      const data = database.findOne({ _id: req.params.id });
      const result = await data;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
};
databaseMaker().catch((err) => console.dir());
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
