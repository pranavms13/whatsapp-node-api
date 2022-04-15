const router = require("express").Router();
let MenuItems = require("../models/menuItems.model");

router.route("/getMenu").get((req, res) => {
  MenuItems.find()
    .then((dish) => res.json(dish))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/addMenu").post((req, res) => {
  const name = req.body.name;
  const description = req.body.description;
  const category = req.body.category;
  const priceFull = req.body.priceFull;
  const priceHalf = req.body.priceHalf;
  // const date = Date.parse(req.body.date);
  // const image = req.body.image;

  const newMenuItems = new MenuItems({
    name,
    description,
    category,
    priceFull,
    priceHalf,
    // image
  });

  newMenuItems
    .save()
    .then(() =>
      res.json({
        data: {
          statusCode: 200,
          title: "Hurray...!!",
          message: "Menu Items added successfully.",
        },
      })
    )
    .catch((err) =>
      res.status(400).json({
        data: {
          statusCode: 400,
          title: "Oppss...!!",
          message: err.message,
        },
      })
    );
});

router.route("/:id").get((req, res) => {
  MenuItems.findById(req.params.id)
    .then((dish) => res.json(dish))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").delete((req, res) => {
  MenuItems.findByIdAndDelete(req.params.id)
    .then(() => res.json("MenuItems deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/update/:id").post((req, res) => {
  MenuItems.findById(req.params.id)
    .then((dish) => {
      dish.name = req.body.name;
      dish.description = req.body.description;
      dish.category = req.body.category;
      dish.priceFull = req.body.priceFull;
      dish.priceHalf = req.body.priceHalf;

      dish
        .save()
        .then(() => res.json("MenuItems updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
