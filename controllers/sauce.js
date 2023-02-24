const Sauce = require("./../models/sauce");
const fs = require("fs");

exports.createSauce = (req, res) => {
  const sauceObject = {
    ...JSON.parse(req.body.sauce),
  };
  delete sauceObject._id;
  delete sauceObject._userId;

  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    dislikes: 0,
    likes: 0,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getAllSauce = (req, res) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json({ error }));
};
exports.modifySauce = (req, res) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  delete sauceObject._userId;

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(403).json({ message: "unauthorized request" });
      } else {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.updateOne(
            { _id: req.params.id },
            { ...sauceObject, _id: req.params.id }
          )
            .then(() => res.status(200).json({ message: "objet modifiée !" }))
            .catch((error) => res.status(400).json({ error }));
        });
      }
    })
    .catch((error) => res.status(404).json({ error }));
};

exports.deleteSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(403).json({ message: "unauthorized request" });
      } else {
        const filename = sauce.imageUrl.split("/images/")[1];

        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Sauce supprimée" }))
            .catch((error) => res.status(400).json({ error }));
        });
      }
    })
    .catch((error) => res.status(404).json({ error }));
};
exports.likeDislikeSauce = (req, res) => {
  const SauceObject = { ...req.body };

  delete SauceObject._userId;
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(403).json({ message: " unauthorized request" });
      } else {
        if (SauceObject.like === 0) {
          const usersLikedFiltered = SauceObject.usersLiked.filter(
            (elt) => elt.userId != sauce.userId
          );
          const usersDislikedFiltered = SauceObject.usersDisliked.filter(
            (elt) => elt.userId != sauce.userId
          );
          const likes = usersLikedFiltered.length;
          const dislikes = usersDislikedFiltered.length;
          Sauce.updateOne(
            { _id: req.params.id },
            {
              ...SauceObject,
              usersLiked: usersLikedFiltered,
              usersDisliked: usersDislikedFiltered,
              likes: likes,
              dislikes: dislikes,
              _id: req.params.id,
            }
          )
            .then(() =>
              res.status(200).json({ message: "Apréciation mise à jour" })
            )
            .catch((error) => res.status(400).json({ error }));
        }
      }
    })
    .catch((error) => res.status(404).json({ error }));
};
