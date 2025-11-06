const User = require("../models/model").User

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'username', 'phone_num', 'email', 'role', 'avatar_img', 'createdAt']
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, username, phone_num, email } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (req.file) {
      user.avatar_img = `/uploads/avatars/${req.file.filename}`;
    }

    user.name = name || user.name;
    user.username = username || user.username;
    user.phone_num = phone_num || user.phone_num;
    user.email = email || user.email;

    await user.save();

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
