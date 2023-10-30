const router = require("express").Router();

const stripe = require("stripe")(
 'sk_test_51Nz1UiBEeHc50nXYVcjP5F5fDy9YOUWXPfEwTC07jONkq5Z8uqyqGUDJUFjaByVFQ5bV5PqzFpNVqGJ0rzvhHmSt00pqPf6CIG'
);


router.post("/payment", (req, res) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "usd",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr);
      } else {
        res.json(stripeRes);
      }
    }
  );
});

module.exports = router;
