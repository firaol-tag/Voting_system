const db = require("../../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  register: (req, res) => {
    const { admName, email, password } = req.body;

    if (!admName || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const hashed = bcrypt.hashSync(password, 10);

    db.query(
      "INSERT INTO user(name,email,password) VALUES (?,?,?)",
      [admName, email, hashed],
      (err) => {
        if (err) return res.status(500).json({ message: "DB error" });
        res.json({ message: "Registered" });
      }
    );
  },

  login: (req, res) => {
    console.log("login");
    const { email, password } = req.body;

    db.query(
      "SELECT * FROM user WHERE email = ?",
      [email],
      (err, result) => {
        if (err || result.length === 0) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        const user = result[0];
        console.log(user);
        const match = bcrypt.compareSync(password, user.password);

        if (!match) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
          { id: user.id },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );

        res.cookie("token", token, {
          httpOnly: true,
          sameSite: "lax",
          secure: false,
        });

        res.json({
          message: "Login success",
          data: { id: user.id, name: user.name, email: user.email },
        });
      }
    );
  },
};
