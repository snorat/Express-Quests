const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const hashingOptions = {
    type: argon2.argon2id,
    memoryCost: 2 ** 11,
    timeCost: 5,
    parallelism: 1,
};

const hashPassword = (req, res, next) => {
    argon2
    .hash(req.body.password, hashingOptions)
    .then((hashedPassword) => {
      // do something with hashedPassword
      // console.info ("mot de passe du body:", req.body.password );
      // console.info ("resultat de hashedPassword:", hashedPassword);

      req.body.hashedPassword = hashedPassword;
      // console.info("Resultat de mon req.body.hashedPassword:",);
            delete req.body.password;

      next();
    })
    .catch((err) => {
      // do something with err
      console.error(err);
      res.sendStatus(500);
    });
};

const verifyPassword = (req, res) => {
    argon2
      .verify(req.user.hashedPassword, req.body.password)
      .then((isVerified) => {
        if (isVerified) {
          const payload = { sub: req.user.id };
  
          const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1h",
          });

  
          delete req.user.hashedPassword;
          res.send({ token, user: req.user });

        } else {
          res.sendStatus(401);
        }
        // next();
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });
  };

  const verifyToken = (req, res, next) => {
    try {
      const authorizationHeader = req.get("Authorization");
  
      if (authorizationHeader == null) {
        throw new Error("Authorization header is missing");
      }
  
      const [type, token] = authorizationHeader.split(" ");
  
      if (type !== "Bearer") {
        throw new Error("Authorization header has not the 'Bearer' type");
      }
  
      req.payload = jwt.verify(token, process.env.JWT_SECRET);
  
      next();
      console.info ("resultat de L'autorisation:", );

    } catch (err) {
      console.error(err);
      res.sendStatus(401);
    }
  };

  module.exports = {
    hashPassword,
    verifyPassword,
    verifyToken,
  };