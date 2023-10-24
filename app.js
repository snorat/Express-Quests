require("dotenv").config();

const express = require("express");

const app = express();

app.use (express.json())

const port = process.env.APP_PORT;

const welcome = (req, res) => {
  res.send("Welcome to my favourite user list");
  // console.log("coucou");
};

app.get("/", welcome);

const userHandlers = require("./userHandlers");
const { hashPassword } = require("./auth.js");


app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUsersById);
app.delete("/api/users/:id", userHandlers.deleteUser);

app.post("/api/users", hashPassword, userHandlers.postUser);
app.put("/api/users/:id", hashPassword, userHandlers.updateUser);


app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
})