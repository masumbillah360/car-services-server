const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.pwgovse.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const databaseMaker = async () => {
  try {
    const database = client.db("ginusCar").collection("services");
    const userServices = client.db("ginusCar").collection("serviceList");
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
    app.get("/orders", async (req, res) => {
      const query = {};
      const data = userServices.find(query);
      const result = await data.toArray();
      res.send(result);
    });

    app.get("/ordersa", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const findedData = userServices.find(query);
      const result = await findedData.toArray();
      const filterdData = result.filter((rs) => rs.email == email);
      res.send(filterdData);
      console.log(email);
    });

    app.post("/userservices", async (req, res) => {
      const serviceData = req.body;
      const data = await userServices.insertOne(serviceData);
      res.send(data);
    });
  } catch (error) {
    console.log(error);
  }
};

app.get("/", (req, res) => {
  res.send("running server");
});
app.get("/halua", (req, res) => {
  const query = req.query;
  res.send("halu ready");
  console.log(query);
});
databaseMaker().catch((err) => console.dir());
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
