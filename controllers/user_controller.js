const bcrypt = require("bcrypt");
const User = require("../models/user_model");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");

//-----------------------------------------------------
// LOGIQUE SIGNUP
//-----------------------------------------------------

exports.signup = (req, res) => {
  const emailCryptoJs = CryptoJS.HmacSHA256(
    JSON.stringify(req.body.email),
    process.env.email_secret_key
  ).toString();
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: emailCryptoJs,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur  Créé" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

//-----------------------------------------------------
// LOGIQUE LOGIN
//-----------------------------------------------------

exports.login = (req, res) => {
  const emailCyptoJs = CryptoJS.HmacSHA256(
    JSON.stringify(req.body.email),
    process.env.email_secret_key
  ).toString();
  User.findOne({ email: emailCyptoJs })
    .then((user) => {
      if (user === null) {
        res
          .status(401)
          .json({ message: " Paire authentifiant / Mot de passe incorrecte" });
      } else {
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              res.status(401).json({
                message: " Paire authentifiant / Mot de passe incorrecte",
              });
            } else {
              res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                  { userId: user._id },
                  process.env.JWT_SECRET_KEY,
                  {
                    expiresIn: "24h",
                  }
                ),
              });
            }
          })
          .catch((error) => res.status(500).json({ error }));
      }
    })
    .catch((error) => res.status(500).json({ error }));
};
