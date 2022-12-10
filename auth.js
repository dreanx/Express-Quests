const argon2 = require("argon2");

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1,
};


//Hashing a given password:
const hashPassword = (req, res, next) => {
  argon2
    .hash(req.body.password, hashingOptions)
    .then((hashedPassword) => {
      console.log(hashedPassword);

      req.body.hashedPassword = hashedPassword;
      delete req.body.password;

      next();
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};


//verifying the password matches the hashed version in the database for a given email
const verifyPassword = (req, res) => {
    argon2
      .verify(req.user.hashedPassword, req.body.password)
      .then((isVerified) => {
        if (isVerified) {
          res.send("Credentials are valid, you are logged in");
        } else {
          res.status(401).send("Wrong Password");
        }
      })
      .catch((err) => {
        console.error(err);
        res.SendStatus(500);
      });
  };
  

module.exports = {
  hashPassword,
  verifyPassword
};