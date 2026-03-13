import express from "express";
import Recipe from "../models/Recipe.js";
import { generateIngredients } from "../services/llmService.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/search", async (req, res) => {
  try {
    const q = req.query.ingredients;
    const query = { isVeg: true };
    if (q?.trim()) query.ingredients = { $in: q.split(",").map(i => i.trim()) };
    res.json(await Recipe.find(query));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json(recipe);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post("/add", protect, async (req, res) => {
  try {
    const recipe = await new Recipe({ ...req.body, user: req.user._id }).save();
    res.status(201).json(recipe);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/generate-ingredients', protect, async (req, res) => {
  try {
    if (!req.body.prompt) return res.status(400).json({ message: 'Please provide a prompt' });
    res.status(200).json(await generateIngredients(req.body.prompt));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

export default router;