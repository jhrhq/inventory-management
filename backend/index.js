const mongoose = require("mongoose");
// const morgan = require("morgan");
// const Joi = require("joi");
require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");

// mongodb
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { reset } = require("nodemon");

// middleware
app.use(cors());
app.use(express.json());

// create client

// mongo db connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.isfsk8s.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const userCollection = client.db("inventoryManagement").collection("users");

    /*
     * get : All get collection
     */

    // get all products

    app.get("/users", async (req, res) => {
      const query = {};
      const user = await userCollection.find(query).toArray();
      console.log(user);
      res.send(user);
    });

    app.get("/users/singleuser", async (req, res) => {
      const email = req.body;
      const query = { email };
      const user = await userCollection.findOne(query);
      res.send(user);
    });

    // post/ create a new user accout
    app.post("/users-signin/:email", async (req, res) => {
      // checking the mail is exists or not
      const email = req.params.email;
      const query = { email };
      const user = await userCollection.findOne(query);

      if (user !== null) {
        res.send("there is an account exist with this email");
      } else {
        // email doesnot exists and inset the data into the db
        const newUser = req.body;
        const result = await userCollection.insertOne(newUser);
        res.send(result);
      }
    });

    // reset the password
    app.put("/users-resetpassword/:email", async (req, res) => {
      // checking the mail is exists or not
      const email = req.params.email;
      const newPassword = req.body.password;
      const query = { email };
      const user = await userCollection.findOne(query);

      if (user !== null) {
        if (user.oldPassword === undefined) {
          const updatePassowrd = {
            $set: { password: newPassword },
            $set: { oldPassword: [...user.password] },
          };
          const query = { _id: ObjectId(user._id) };
          const options = { upsert: true };
          const result = await userCollection.updateOne(
            query,
            updatePassowrd,
            options
          );
          console.log(result);
          res.send(result);
        } else {
          let result;
          for (let i = 0; i <= user?.oldPassword.length; i++) {
            if (newPassword === user.oldPassword[i]) {
              user.oldPassword[i];
              result = "this pwd exists";
            }
          }

          res.send(result);
        }
      } else {
        res.send("there is an account exist with this password");
      }
    });
  } finally {
  }
}

run().catch(console.dir());

app.get("/", async (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Inventory management App listening on port ${port}`);
});
