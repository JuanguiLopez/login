const passport = require("passport");
const githubStrategy = require("passport-github2");
const { createHash, isValidPassword } = require("../utils");
const userModel = require("../models/user");

const LocalStrategy = githubStrategy.Strategy;

const initializePassport = () => {
  passport.use(
    "github",
    new githubStrategy(
      {
        clientID: "Iv1.6f21e9f4a7958fd1",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
        clientSecret: "880022b93683fe56bb7f6f0f7ed8e85657adc2e1",
      },
      async (_accesToken, _refreshToken, profile, done) => {
        try {
          const user = await userModel.findOne({ email: profile._json.email });

          if (!user) {
            let newUser = {
              first_name: profile._json.name,
              last_name: "Doe",
              age: 99,
              email: profile._json.email,
            };

            let result = await userModel.create(newUser);

            return done(null, result);
          } else {
            return done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  let user = await userModel.findById(id);
  done(null, user);
});

module.exports = initializePassport;
