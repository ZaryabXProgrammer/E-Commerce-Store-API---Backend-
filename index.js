const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require("./routes/Users");
const authRouter = require("./routes/Auth");
const productRouter = require("./routes/Product");
const cartRouter = require("./routes/Cart");
const orderRouter = require("./routes/Order");
const paymentRouter = require("./routes/Stripe");
const cors = require("cors");

dotenv.config();

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)

  .then(() => console.log("MongoDb Connected"))
  .catch((err) => {
    console.log(err);
  });

app.use("/api/auth", authRouter);

app.use("/api/user", userRouter);

app.use("/api/products", productRouter);

app.use("/api/cart", cartRouter);

app.use("/api/orders", orderRouter);

app.use("/api/checkout", paymentRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server runs perfectly on http://localhost:${PORT}`);
});
