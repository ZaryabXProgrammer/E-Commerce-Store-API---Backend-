const router = require("express").Router();
const Cart = require("../models/Cart");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyToken,
} = require("../middleware/verifyToken");

//Creating Cart

//add verify token here when tested
router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);

  try {
    const savedCart = await newCart.save();
    res.json(savedCart);
  } catch (error) {
    res.status(400).json(error);
  }
});

//updating existing cart - only logged in user can update their own cart

//add verify token and authorization here after testting api
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  // const cartId = req.params.id

  const userId = req.params.id;

  try {
    const updatedCart = await Cart.findOneAndUpdate(
      { userId: userId },
      {
        $set: req.body,
      },
      { new: true }
    );

    res.json(updatedCart);
  } catch (error) {
    res.status(400).json(error);
  }
});

//Delete Cart; Own user could only delete his own cart

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  const cartId = req.params.id;

  try {
    const deletedCart = await Cart.deleteOne({ _id: cartId });
    res.json("Cart Deleted Successfully");
  } catch (error) {
    res.status(400).json(error);
  }
});

//Get Users Cart; - We will pass the userId as the parameter

router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
  const userId = req.params.id;

  try {
    const myCart = await Cart.findOne({ userId: userId });

    res.json(myCart);
  } catch (error) {
    res.status(404).json(error);
  }
});

//GET ALL CART - ONLY ADMIN COULD GET ALL THE CARTS

router.get("/find", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();

    res.json(carts);
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
