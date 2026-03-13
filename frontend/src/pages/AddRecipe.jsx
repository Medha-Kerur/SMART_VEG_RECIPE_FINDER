import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import AIGenerator from '../components/recipes/AIGenerator';
import { ChefHat } from 'lucide-react';
import API_BASE from '../api';

const AddRecipe = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    ingredients: '',
    instructions: '',
    cookingTime: '',
    image: '',
    isVeg: true,
    aiGenerated: false
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAIGenerated = (aiData) => {
    setFormData(prev => ({
      ...prev,
      name: aiData.name || prev.name,
      ingredients: aiData.ingredients || prev.ingredients,
      aiGenerated: aiData.aiGenerated
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Convert comma separated string to array for backend
      const recipePayload = {
        ...formData,
        ingredients: formData.ingredients.split(',').map(i => i.trim()).filter(i => i)
      };

      await axios.post(
        `${API_BASE}/api/recipes/add`,
        recipePayload,
        {
          headers: { Authorization: `Bearer ${user.token}` }
        }
      );
      
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add recipe');
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-wrapper">
        <div className="form-header">
          <ChefHat size={32} className="header-icon" />
          <h2>Share a Recipe</h2>
        </div>

        {/* AI Generator Section */}
        <AIGenerator onIngredientsGenerated={handleAIGenerated} userToken={user.token} />

        <div className="divider">
          <span>OR FILL MANUALLY</span>
        </div>

        {error && <div className="alert error">{error}</div>}

        <form onSubmit={handleSubmit} className="recipe-form">
          <div className="form-group">
            <label>Recipe Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., Spicy Paneer Tikka"
            />
          </div>

          <div className="form-group">
            <label>Ingredients (comma separated) *</label>
            <textarea
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Paneer, Yogurt, Spices, Lemon..."
            />
          </div>

          <div className="form-group">
            <label>Instructions</label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              rows="5"
              placeholder="Step by step cooking instructions..."
            />
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Cooking Time</label>
              <input
                type="text"
                name="cookingTime"
                value={formData.cookingTime}
                onChange={handleChange}
                placeholder="e.g., 30 mins"
              />
            </div>

            <div className="form-group half">
              <label>Image URL</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-container">
              <input
                type="checkbox"
                name="isVeg"
                checked={formData.isVeg}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              Is this a Pure Vegetarian Recipe?
            </label>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Publish Recipe'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRecipe;
