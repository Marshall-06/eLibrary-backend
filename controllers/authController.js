const User = require("../models/model").User;
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");

// ✅ Admin login (rootman)
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await User.findOne({ where: { email } });
    if (!admin) {
      return res.status(400).json({ error: "Ulanyjynyň nomeri ýa-da açar sözi nädogry" });
    }

    const passwordIsValid = bcrypt.compareSync(password, admin.password);
    if (!passwordIsValid) {
      return res.status(400).json({ error: "Ulanyjynyň nomeri ýa-da açar sözi nädogry" });
    }

    const token = sign(
      { id: admin.id, role: admin.role },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "24h" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

// ✅ User registration
exports.register = async (req, res) => {
  const { name, phone_num, password, email, role } = req.body;
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Sizin nomeriniz bilen on hasap acylypdyr" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      phone_num,
      password: hashedPassword,
      role,
    });

    const token = sign(
      { id: newUser.id, role: newUser.role },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "24h" }
    );

    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

// ✅ User login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(400)
        .json({ error: "Ulanyjynyň nomeri ýa-da açar sözi nädogry" });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res
        .status(400)
        .json({ error: "Ulanyjynyň nomeri ýa-da açar sözi nädogry" });
    }

    const token = sign(
      {
        id: user.id,
        role: user.role,
        username: user.username,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "24h" }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", message: err.message });
  }
};
