import express from 'express';
import { getRecipes, createRecipe, updateRecipe, deleteRecipe } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();
router.route('/').get(protect, admin, getRecipes).post(protect, admin, createRecipe);
router.route('/:id').put(protect, admin, updateRecipe).delete(protect, admin, deleteRecipe);
export default router;
