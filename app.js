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

const { hashPassword, verifyPassword, verifyToken } = require("./auth");

// const isItDwight = (req, res) => {
//   if (req.body.email === "dwight@theoffice.com" && req.body.password === "123456") {
//     res.send("Credentials are valid");
//   } else {
//     res.sendStatus(401);
//   }
// };


// app.post("/api/login", isItDwight);


app.post("/api/users", hashPassword, userHandlers.postUser);
app.post("/api/login",userHandlers.getUserByEmailWithPasswordAndPassToNext, verifyPassword);
app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUsersById);

app.use(verifyToken);


app.delete("/api/users/:id", userHandlers.deleteUser);
app.put("/api/users/:id", hashPassword, userHandlers.updateUser);


app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
})

// const verifyPassword = (req, res) => {
//   res.send(req.user);
// }

