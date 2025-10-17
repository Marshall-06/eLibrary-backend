const express = require("express");
const router = express.Router();
const { Category, Book } = require("../models/model");


router.get("/", async (req, res) => {
    const categories = await Category.findAll();
    res.json(categories);
});

// router.get("/single/:id", async (req, res) => {
//     const category = await Category.findByPk(req.params.id);
//     if (!category) {
//         return res.status(404).json({ error: "Category not found" });
//     }
//     res.json(category);
// });

router.get("/single/:id", async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id, {
            include: [
                {
                    association: "books", // alias defined in models
                    attributes: ["id", "name", "description", "pdf", "image"]
                }
            ]
        });

        if (!category) return res.status(404).json({ error: "Category not found" });

        res.status(200).json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

router.post("/add", async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: "Category name is required" });
    }
    const category = await Category.create({ name });
    res.json({ message: "Category added successfully", category });
});

router.put("/update/:id", async (req, res) => {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
        return res.status(404).json({ error: "Category not found" });
    }
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: "Category name is required" });
    }
    category.name = name;
    await category.save();
    res.json({ message: "Category updated successfully", category });
});


router.delete("/delete/:id", async (req, res) => {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
        return res.status(404).json({ error: "Category not found" });
    }
    await category.destroy();
    res.json({ message: "Category deleted successfully" });
});

module.exports = router;