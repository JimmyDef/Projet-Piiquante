const validator = require("validator");
const passwordValidator = require("password-validator");

exports.email = (req, res, next) => {
  const email = req.body.email;
  if (validator.isEmail(email)) {
    next();
  } else {
    res.status(400).json({ error: `L'email ${email} n'est pas valide` });
  }
};

const schema = new passwordValidator();
schema
  .is()
  .min(8) // Minimum length 8
  .is()
  .max(100) // Maximum length 100
  .has()
  .uppercase() // Must have uppercase letters
  .has()
  .lowercase() // Must have lowercase letters
  .has()
  .digits(2) // Must have at least 2 digits
  .has()
  .not()
  .spaces() // Should not have spaces
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123"]); // Blacklist these values

exports.password = (req, res, next) => {
  if (schema.validate(req.body.password)) {
    next();
  } else {
    console.log(schema.validate(req.body.password, { details: true }));
    res.status(400).json({
      error: `Le mot de passe n'est pas assez fort :  + ${schema.validate(
        req.body.password,
        { list: true }
      )}`,
    });
  }
};
