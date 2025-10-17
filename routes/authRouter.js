const express = require('express');
const router = express.Router();
const { Admin, User } = require('../models/model');
const { sign } = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

router.post("/rootman", async (req, res) => {
    const { email, password } = req.body;
    await Admin.findOne({ where: { email: email } })
        .then(admin => {
            if (!admin || admin.email !== email) {
                res.json({ error: "Ulanyjynyň nomeri ýa-da açar sözi nädogry" })
            } else {
                var passwordIsValid = bcrypt.compareSync(password, admin.password)
                if (!passwordIsValid) {
                    res.json({ error: "Ulanyjynyň nomeri ýa-da açar sözi nädogry" })
                } else {
                    res.json({
                        token: sign({ id: admin.id, role: admin.role }, process.env.JWT_ACCESS_KEY, {
                            expiresIn: '24h'
                        })
                    });
                }
            }
        })
});


router.post("/register", async (req, res) => {
    const { name, phone_num, password, role } = req.body;
    try {
        const user = await User.findOne({ where: { phone_num: phone_num } });
        if (!user) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({
                name: name,
                phone_num: phone_num,
                password: hashedPassword,
                role: role
            });
            const token = sign({ id: newUser.id, role: newUser.role }, process.env.JWT_ACCESS_KEY, {
                expiresIn: '24h'
            });
            res.status(201).json({ token: token });
        } else {
            res.status(400).json({ error: "Sizin nomeriniz bilen on hasap acylypdyr" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});


router.post("/login", async (req, res) => {
    const { phone_num, password } = req.body;
    try {
        const user = await User.findOne({ where: { phone_num: phone_num } });
        if (!user) {
            return res.status(400).json({ error: "Ulanyjynyň nomeri ýa-da açar sözi nädogry" });
        }
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(400).json({ error: "Ulanyjynyň nomeri ýa-da açar sözi nädogry" });
        }
        const token = sign({ id: user.id, role: user.role, username: user.username, isAdmin: user.isAdmin }, process.env.JWT_ACCESS_KEY, {
            expiresIn: '24h'
        });
        res.json({ token : token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});






module.exports = router;