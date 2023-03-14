const validator = require("validator");

exports.email = (req, res, next) => {
  const email = req.body.email;
  if (validator.isEmail(email)) {
    next();
  } else {
    return res.status(400).json({ error: `Email ${email} n'est pas valide` });
  }
};

// exports.password = (req, res, next) => {
//   const password = req.body.password;
//   if (validator.isPassword(password)) {
//     next();
//   } else {
//     return res
//       .status(400)
//       .json({ error: `password ${password} n'est pas valide` });
//   }
// };
