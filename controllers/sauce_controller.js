const Sauce = require("../models/sauce_model");
const fs = require("fs");

//-----------------------------------------------------
// LOGIQUE CREATESAUCE
//-----------------------------------------------------

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

//-----------------------------------------------------
// LOGIQUE GETALLSAUCE
//-----------------------------------------------------

exports.getAllSauce = (req, res) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

//-----------------------------------------------------
// LOGIQUE GETONESAUCE
//-----------------------------------------------------

exports.getOneSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json({ error }));
};

//-----------------------------------------------------
// LOGIQUE MODIFYSAUCE
//-----------------------------------------------------

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

//-----------------------------------------------------
// LOGIQUE DELETESAUCE
//-----------------------------------------------------

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

//-----------------------------------------------------
// LOGIQUE LIKEDISLIKESAUCE
//-----------------------------------------------------

exports.likeDislikeSauce = (req, res) => {
  const SauceObject = { ...req.body };

  if (SauceObject.userId != req.auth.userId) {
    res.status(403).json({ message: " unauthorized request" });
  } else {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        const usersLikedArray = sauce.usersLiked;
        const userDislikedArray = sauce.usersDisliked;

        const usersLikedFiltered = usersLikedArray.filter(
          (elt) => elt !== SauceObject.userId
        );
        const usersDislikedFiltered = userDislikedArray.filter(
          (elt) => elt !== SauceObject.userId
        );

        const foundUserLikes = usersLikedArray.includes(SauceObject.userId);
        const foundUserDislikes = userDislikedArray.includes(
          SauceObject.userId
        );

        switch (SauceObject.like) {
          case 1:
            if (!foundUserLikes) {
              usersLikedArray.push(SauceObject.userId);

              Sauce.updateOne(
                { _id: req.params.id },
                {
                  _id: req.params.id,
                  usersLiked: usersLikedArray,
                  usersDisliked: usersDislikedFiltered,
                  likes: usersLikedArray.length,
                  dislikes: usersDislikedFiltered.length,
                }
              )
                .then(() =>
                  res.status(200).json({ message: "Apréciation mise à jour" })
                )
                .catch((error) => res.status(400).json({ error }));
            }
            break;
          case -1:
            if (!foundUserDislikes) {
              userDislikedArray.push(SauceObject.userId);

              Sauce.updateOne(
                { _id: req.params.id },
                {
                  _id: req.params.id,
                  usersLiked: usersLikedFiltered,
                  usersDisliked: userDislikedArray,
                  likes: usersLikedFiltered.length,
                  dislikes: userDislikedArray.length,
                }
              )
                .then(() =>
                  res.status(200).json({ message: "Apréciation mise à jour" })
                )
                .catch((error) => res.status(400).json({ error }));
            }
            break;
          case 0:
            Sauce.updateOne(
              { _id: req.params.id },
              {
                _id: req.params.id,
                usersLiked: usersLikedFiltered,
                usersDisliked: usersDislikedFiltered,
                likes: usersLikedFiltered.length,
                dislikes: usersDislikedFiltered.length,
              }
            )
              .then(() =>
                res.status(200).json({ message: "Apréciation mise à jour" })
              )
              .catch((error) => res.status(400).json({ error }));
        }
      })
      .catch((error) => {
        res.status(404).json({ error });
      });
  }
};
