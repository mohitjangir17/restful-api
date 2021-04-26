const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "mohitjangir17", (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.redirect("/");
      } else {
        // console.log(decodedToken);
        next();
      }
    });
  } else {
    res.render("index", { error: "Please login with your account first" });
  }
};

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "mohitjangir17", (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.locals.user = null;
      } else {
        // console.log(decodedToken);
        const userEmail = decodedToken.email;
        // console.log(userEmail);
        res.locals.user = userEmail;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, checkUser };
