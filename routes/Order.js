const router = require("express").Router();

const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyToken,
} = require("../middleware/verifyToken");

const Order = require("../models/Order");

router.post("/:id", verifyTokenAndAuthorization, async (req, res) => {
  const newOrder = new Order(req.body);

  try {
    const savedOrder = await newOrder.save();
    res.json(savedOrder);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Only Admin can update the order!

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  const orderId = req.params.id;

  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId },
      {
        $set: req.body,
      },
      { new: true }
    );

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json(error);
  }
});

//DELETE THE Order

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  const orderId = req.params.id;

  try {
    await Order.findByIdAndDelete(orderId);

    res.status(200).json("Order Deleted Successfully");
  } catch (error) {
    res.status(401).json(error);
  }
});

//Get Particular User's Order, only logged in users(using users Id)

router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  const userId = req.params.userId;

  try {
    //since users can have more than one order so we use find to retrieve all of them
    const orders = await Order.find({ userId: userId });

    res.json(orders);
  } catch (error) {
    res.status(401).json(error);
  }
});

//Get All Order - Only admin

router.get("/find", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ _id: -1 }).limit(5);
    res.json(orders);
  } catch (error) {
    res.status(401).json(error);
  }
});

//Get Monthly Income;

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const productId = req.query.pid;

  const date = new Date();

  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));

  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    // Calculate the income for the previous month based on certain conditions.
    const income = await Order.aggregate([
      // First, filter the orders created in the previous month.
      {
        //if there is a product id adding 1 more condition
        $match: {
          createdAt: { $gte: previousMonth },
          ...(productId && {
            products: { $elemMatch: { productId: productId } },
          }), // Match orders with a creation date greater than or equal to 'previousMonth.'
        },
      },

      // Then, restructure the data to get the month and sales amount.
      {
        $project: {
          month: { $month: "$createdAt" }, // Extract the month from the 'createdAt' field.
          sales: "$amount", // Keep the 'amount' field as 'sales.'
        },
      },

      // Next, group the data by month and calculate the total sales for each month.
      {
        $group: {
          _id: "$month", // Group by the 'month' field.
          total: { $sum: "$sales" }, // Calculate the total sales for each month.
        },
      },
    ]);

    res.json(income);
  } catch (error) {
    res.status(401).json(error);
  }
});

//Get All Products By Particlar Category or get all products based on the param we passed the query to the URL

router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategories = req.query.category;

  try {
    let products;

    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(5);
    } else if (qCategories) {
      products = await Product.find({
        categories: {
          $in: [qCategories],
        },
      });
    } else {
      products = await Product.find();
    }

    res.json(products);
  } catch (error) {
    res.status(401).json(error);
  }
});

module.exports = router;
