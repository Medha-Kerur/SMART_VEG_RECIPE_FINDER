import Recipe from '../models/Recipe.js';

export const getRecipes = async (req, res) => {
  try {
    res.json(await Recipe.find({}).populate('user', 'name'));
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const createRecipe = async (req, res) => {
  try {
    const { name, ingredients, instructions, cookingTime, image, isVeg } = req.body;
    const recipe = await new Recipe({ user: req.user._id, name, ingredients, instructions, cookingTime, image, isVeg }).save();
    res.status(201).json(recipe);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    const { name, ingredients, instructions, cookingTime, image, isVeg } = req.body;
    Object.assign(recipe, {
      name: name || recipe.name,
      ingredients: ingredients || recipe.ingredients,
      instructions: instructions || recipe.instructions,
      cookingTime: cookingTime || recipe.cookingTime,
      image: image || recipe.image,
      isVeg: isVeg !== undefined ? isVeg : recipe.isVeg,
    });
    res.json(await recipe.save());
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    await recipe.deleteOne();
    res.json({ message: 'Recipe removed' });
  } catch (e) { res.status(500).json({ message: e.message }); }
};
