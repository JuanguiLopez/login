const { Router } = require("express");
const userModel = require("../models/user");
const session = require("express-session");
const { createHash, isValidPassword } = require("../utils");

const sessionRouter = Router();

sessionRouter.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  if (!first_name || !last_name || !email || !age || !password) {
    return res.status(400).send({ status: "error", error: "missing data" });
  }

  const hashedPassword = createHash(password);

  const result = await userModel.create({
    first_name,
    last_name,
    email,
    age,
    password: hashedPassword,
  });

  res.send({ status: "success", message: "user registered", details: result });
});

sessionRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ status: "error", error: "missing data" });
  }

  const user = await userModel.findOne({ email: email });
  if (!user) {
    return res
      .status(401)
      .send({ status: "error", error: "incorrect credentials" });
  }

  if (!isValidPassword(user, password)) {
    return res
      .status(401)
      .send({ status: "error", error: "incorrect password" });
  }

  /** Create session */
  req.session.user = {
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    age: user.age,
  };

  /** Service answer */
  res.status(200).send({
    status: "success",
    payload: req.session.user,
    message: "succesfully logged in",
  });
});

sessionRouter.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err)
      return res
        .status(500)
        .send({ status: "error", error: "there was an error login out" });

    res.redirect("/login");
  });
});

sessionRouter.post("/resetPassword", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ status: "error", error: "missing data" });
  }

  const user = await userModel.findOne({ email: email });
  if (!user) {
    return res.status(401).send({ status: "error", error: "user not found" });
  }

  const hashedPassword = createHash(password);

  const result = await userModel.updateOne(
    { _id: user._id },
    { $set: { password: hashedPassword } }
  );

  res.send({
    status: "success",
    message: "password reset succesfully",
    details: result,
  });
});

module.exports = sessionRouter;
