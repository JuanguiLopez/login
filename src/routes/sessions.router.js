const { Router } = require("express");
const userModel = require("../models/user");
const session = require("express-session");
const { createHash, isValidPassword } = require("../utils");
const passport = require("passport");

const sessionRouter = Router();

sessionRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user: email"] }),
  async (req, res) => {}
);

sessionRouter.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = {
      name: `${req.user.first_name} ${req.user.last_name}`,
      age: req.user.age,
      email: req.user.email,
    };

    res.redirect("/");
  }
);

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
