const router = require("express").Router();
const auth = require("../../middleware/auth");
const { register, login } = require("./auth.controller");
const db = require("../../config/db");

router.post("/register", register);
router.post("/login", login);

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

router.get("/me", auth, (req, res) => {
  const userId = req.userId.id;
 console.log(userId);
  db.query(
    "SELECT * FROM user WHERE id = ?",
    [userId],
    (err, result) => {
      if (err || result.length === 0) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      res.json({ user: result[0] });
    }
  );
});

module.exports = router;
