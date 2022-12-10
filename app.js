const express = require("express");  // We import express
require("dotenv").config();

const app = express(); // Create an application by calling the express module
// Now, we have access to a lot of express methods using app.METHOD (ex: app.get(), app.post(), etc...)

//Importing the hasing and the verification for our login post 
const { hashPassword, verifyPassword } = require("./auth.js");

app.use(express.json());

const port = process.env.APP_PORT ?? 5000; //Create a constant to store the port number.

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

const movieHandlers = require("./movieHandlers");
const usersHandlers = require("./usersHandlers");


//LOGIN

// const isItGrumpy = (req, res) => {
//   if (req.body.email === "grumpy@cat.com" && req.body.password === "grumps") {
//     res.send("Credentials are valid, Welcome Grumpy Cat");
//   } else {
//     res.sendStatus(401);
//   }
// };
// app.post("/api/login", isItGrumpy);
app.post(
  "/api/login",
  usersHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);


//GET
app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);

app.get("/api/users", usersHandlers.getUsers);
app.get("/api/users/:id", usersHandlers.getUsersById);

//POST (with Validation)
const { validateMovie } = require("./validators.js");
app.post("/api/movies", validateMovie, movieHandlers.postMovie);
const { validateUser } = require("./validators.js");
app.post("/api/users", validateUser, hashPassword, usersHandlers.postUsers);



//PUT
app.put("/api/movies/:id", movieHandlers.updateMovie);
app.put("/api/users/:id", usersHandlers.updateUsers);

//DELETE
app.delete("/api/movies/:id", movieHandlers.deleteMovie);
app.delete("/api/users/:id", usersHandlers.deleteUsers);


app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});